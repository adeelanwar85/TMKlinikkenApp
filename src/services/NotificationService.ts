import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_STORAGE_KEY = 'tmklinikken_notifications';

export interface SavedNotification {
    id: string;
    date: number;
    title: string;
    body: string;
    data: any;
    read: boolean;
}

// Configure how notifications behave when the app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const NotificationService = {
    /**
     * Request permissions for push/local notifications
     */
    async registerForPushNotificationsAsync() {
        if (Platform.OS === 'web') return;

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }

        // In a real app, we would get the token here:
        // const token = (await Notifications.getExpoPushTokenAsync()).data;
        // console.log(token);
    },

    /**
     * Listen for incoming notifications and save them
     */
    setupNotificationListeners() {
        if (Platform.OS === 'web') return;

        // Foreground listener
        Notifications.addNotificationReceivedListener(notification => {
            NotificationService.saveNotification(notification);
        });

        // Background/Response listener (user tapped notification)
        Notifications.addNotificationResponseReceivedListener(response => {
            const notification = response.notification;
            // Mark as read or handle navigation here
            NotificationService.saveNotification(notification);
        });
    },

    /**
     * Save a notification to local storage
     */
    async saveNotification(notification: Notifications.Notification) {
        try {
            const newNotif: SavedNotification = {
                id: notification.request.identifier,
                date: notification.date,
                title: notification.request.content.title || 'Varsel',
                body: notification.request.content.body || '',
                data: notification.request.content.data,
                read: false,
            };

            const existingJSON = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
            let history: SavedNotification[] = existingJSON ? JSON.parse(existingJSON) : [];

            // Avoid duplicates
            if (!history.find(n => n.id === newNotif.id)) {
                history = [newNotif, ...history].slice(0, 50); // Keep last 50
                await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(history));
            }
        } catch (e) {
            console.error("Failed to save notification", e);
        }
    },

    /**
     * Get notification history
     */
    async getHistory(): Promise<SavedNotification[]> {
        try {
            const json = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
            return json ? JSON.parse(json) : [];
        } catch (e) {
            return [];
        }
    },

    /**
     * Clear history
     */
    async clearHistory() {
        await AsyncStorage.removeItem(NOTIFICATION_STORAGE_KEY);
    },

    /**
     * Mark all notifications as read
     */
    async markAllAsRead() {
        try {
            const history = await NotificationService.getHistory();
            const updated = history.map(n => ({ ...n, read: true }));
            await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
            console.error("Failed to mark read", e);
        }
    },

    /**
     * Get number of unread notifications
     */
    async getUnreadCount(): Promise<number> {
        try {
            const history = await NotificationService.getHistory();
            return history.filter(n => !n.read).length;
        } catch (e) {
            return 0;
        }
    },

    /**
     * Schedule a notification 24 hours before the appointment
     */
    async scheduleAppointmentReminder(appointmentDate: Date, treatmentName: string) {
        if (Platform.OS === 'web') return;
        const triggerDate = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);

        if (triggerDate.getTime() < Date.now()) return;

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "📅 Påminnelse: Time i morgen",
                body: `Du har time for ${treatmentName} hos TM Klinikken kl. ${appointmentDate.getHours()}:${appointmentDate.getMinutes().toString().padStart(2, '0')}.`,
                data: { appointmentDate },
                sound: true,
            },
            trigger: { type: SchedulableTriggerInputTypes.DATE, date: triggerDate },
        });
    },

    async cancelAllNotifications() {
        if (Platform.OS === 'web') return;
        await Notifications.cancelAllScheduledNotificationsAsync();
    }
};
