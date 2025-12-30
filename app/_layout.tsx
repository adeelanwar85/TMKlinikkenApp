import { AuthProvider } from '@/src/context/AuthContext';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BookingProvider } from '@/src/context/BookingContext';
import { useEffect, useRef } from 'react';
import { NotificationService } from '@/src/services/NotificationService';
import { ContentService, BroadcastMessage } from '@/src/services/ContentService';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_NOTIF_KEY = 'last_seen_notification_time';

export default function RootLayout() {
    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();

    useEffect(() => {
        // 1. Register for permissions
        NotificationService.registerForPushNotificationsAsync();

        // 2. Setup local listeners
        NotificationService.setupNotificationListeners();

        // 3. Listen to Firestore "Broadcasts" (Simulated Push)
        const unsubscribe = ContentService.subscribeToNotifications(async (messages) => {
            if (messages.length === 0) return;

            const latest = messages[0];
            const lastSeenTimeStr = await AsyncStorage.getItem(LAST_NOTIF_KEY);
            const lastSeenTime = lastSeenTimeStr ? parseInt(lastSeenTimeStr) : Date.now(); // Default to now if first run/install

            // Only show if it's NEWER than what we've seen (and recently created, e.g. within last hour)
            // But for simplicity, we just check if it's newer than lastSeenTime
            if (latest.date > lastSeenTime) {
                // It's a new message!
                console.log("New broadcast received:", latest.title);

                // Show local notification
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: latest.title,
                        body: latest.body,
                        sound: true,
                    },
                    trigger: null, // Show immediately
                });

                // Update last seen
                await AsyncStorage.setItem(LAST_NOTIF_KEY, latest.date.toString());
            }
        });

        return () => {
            unsubscribe();
            if (notificationListener.current) notificationListener.current.remove();
            if (responseListener.current) responseListener.current.remove();
        };
    }, []);

    return (
        <SafeAreaProvider>
            <ActionSheetProvider>
                <>
                    <AuthProvider>
                        <BookingProvider>
                            <Stack screenOptions={{ headerShown: false }}>
                                <Stack.Screen name="index" />
                                <Stack.Screen name="login" />
                                <Stack.Screen name="(tabs)" />
                            </Stack>
                        </BookingProvider>
                    </AuthProvider>
                    <StatusBar style="auto" />
                </>
            </ActionSheetProvider>
        </SafeAreaProvider>
    );
}
