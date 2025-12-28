import { Stack } from 'expo-router';
import { BookingProvider } from '../../src/context/BookingContext';
import { Colors } from '../../src/theme/Theme';

export default function BookingLayout() {
    return (
        <BookingProvider>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: Colors.background.main,
                    },
                    headerTintColor: Colors.neutral.darkGray,
                    headerTitleStyle: {
                        fontFamily: 'PlayfairDisplay-Bold',
                        fontSize: 20,
                    },
                    headerBackTitle: '',
                    contentStyle: { backgroundColor: Colors.background.main },
                    headerShadowVisible: false, // Cleaner look
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        title: 'Behandlinger',
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="date-select"
                    options={{
                        title: 'Velg Tid', // Norwegian
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="summary"
                    options={{
                        title: 'Bekreftelse',
                        headerShown: false,
                        presentation: 'modal'
                    }}
                />
            </Stack>
        </BookingProvider>
    );
}
