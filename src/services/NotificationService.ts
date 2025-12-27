import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications behave when the app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const NotificationService = {
    /**
     * Request permissions for push/local notifications
     */
    async registerForPushNotificationsAsync() {
        if (Platform.OS === 'web') {
            // console.log("Web - Notification permission skipping");
            return;
        }

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
    },

    /**
     * Schedule a notification 24 hours before the appointment
     * @param appointmentDate Date object of the appointment
     * @param treatmentName Name of the treatment
     */
    async scheduleAppointmentReminder(appointmentDate: Date, treatmentName: string) {
        if (Platform.OS === 'web') return;

        // Calculate trigger time: 24 hours before appointment
        const triggerDate = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000); // -24 hours

        // If the calculated time is in the past (e.g. booked for today), don't schedule
        if (triggerDate.getTime() < Date.now()) {
            console.log("Appointment is less than 24h away, skipping specific 24h reminder.");
            return;
        }

        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "📅 Påminnelse: Time i morgen",
                    body: `Du har time for ${treatmentName} hos TM Klinikken kl. ${appointmentDate.getHours()}:${appointmentDate.getMinutes().toString().padStart(2, '0')}.`,
                    data: { appointmentDate },
                    sound: true,
                },
                trigger: {
                    date: triggerDate, // Exact date trigger
                },
            });
            console.log("Notification scheduled for: ", triggerDate);
        } catch (e) {
            console.error("Error scheduling notification:", e);
        }
    },

    async cancelAllNotifications() {
        if (Platform.OS === 'web') return;
        await Notifications.cancelAllScheduledNotificationsAsync();
    }
};
