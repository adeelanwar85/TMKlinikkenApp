import { AuthProvider } from '@/src/context/AuthContext';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <ActionSheetProvider>
                <>
                    <AuthProvider>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="index" />
                            <Stack.Screen name="login" />
                            <Stack.Screen name="(tabs)" />
                        </Stack>
                    </AuthProvider>
                    <StatusBar style="auto" />
                </>
            </ActionSheetProvider>
        </SafeAreaProvider>
    );
}
