import { Stack } from 'expo-router';

export default function TreatmentLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="[id]/index" />
            <Stack.Screen name="[id]/[subId]" />
        </Stack>
    );
}
