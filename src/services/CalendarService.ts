import * as Calendar from 'expo-calendar';
import { Platform, Alert } from 'react-native';

export const CalendarService = {
    async requestCalendarPermissions() {
        if (Platform.OS === 'web') return false;

        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
            const reminders = await Calendar.requestRemindersPermissionsAsync();
            return reminders.status === 'granted';
        }
        return false;
    },

    async getDefaultCalendarSource() {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
        return defaultCalendars.length > 0 ? defaultCalendars[0].source : calendars[0].source;
    },

    async addAppointmentToCalendar(date: Date, treatmentName: string, durationMinutes: number = 30) {
        if (Platform.OS === 'web') {
            alert("Kalender-integrasjon støttes kun på mobil.");
            return;
        }

        const hasPermission = await this.requestCalendarPermissions();
        if (!hasPermission) {
            Alert.alert("Mangler tilgang", "Vi trenger tilgang til kalenderen din for å legge til timen.");
            return;
        }

        try {
            const start = new Date(date);
            const end = new Date(date.getTime() + durationMinutes * 60 * 1000);

            // Get a calendar to write to
            const defaultCalendarSource = Platform.OS === 'ios'
                ? await Calendar.getDefaultCalendarAsync()
                : { id: (await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT))[0].id }; // Pick first available on Android

            // Create Event
            await Calendar.createEventAsync(defaultCalendarSource.id, {
                title: `Time: ${treatmentName} @ TM Klinikken`,
                startDate: start,
                endDate: end,
                timeZone: 'Europe/Oslo',
                location: 'TM Klinikken, Fredrikstad',
                notes: 'Husk å møte opp 5 minutter før.',
            });

            Alert.alert("Suksess", "Timen er lagt til i din kalender! 📅");
        } catch (e) {
            console.error("Error adding to calendar:", e);
            Alert.alert("Feil", "Kunne ikke legge til i kalender.");
        }
    }
};
