import { Redirect, Stack, useSegments } from 'expo-router';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/src/theme/Theme';
import { AdminAuthProvider, useAdminAuth } from '@/src/context/AdminAuthContext';

function AdminAuthGuard() {
    const { isAuthenticated, isLoading } = useAdminAuth();
    const segments = useSegments();

    // Check if we are on the login page (or forgot password, etc)
    // admin/login -> segments = ['admin', 'login']
    const inAuthGroup = segments[1] === 'login' || segments[1] === 'forgot-password';

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background.main }}>
                <ActivityIndicator size="large" color={Colors.primary.deep} />
            </View>
        );
    }

    if (!isAuthenticated && !inAuthGroup) {
        // Redirect to login if not authenticated and not already there
        return <Redirect href="/admin/login" />;
    }

    if (isAuthenticated && inAuthGroup) {
        // If logged in and trying to access login, go to dashboard
        return <Redirect href="/admin" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            {/* Add other screens as needed */}
        </Stack>
    );
}

export default function AdminLayout() {
    return (
        <AdminAuthProvider>
            <AdminAuthGuard />
        </AdminAuthProvider>
    );
}
