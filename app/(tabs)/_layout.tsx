import { Colors } from '@/src/theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { LoyaltyService } from '@/src/services/LoyaltyService';

import { useRouter } from 'expo-router';

export default function TabLayout() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    // Kick out if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            // Wrap in timeout to avoid 'navigate before mount' error during initial render
            setTimeout(() => {
                router.replace('/');
            }, 0);
        }
    }, [isAuthenticated]);

    // Auto-Sync Loyalty History on App Start
    useEffect(() => {
        if (user?.id && user?.phone) {
            LoyaltyService.syncFullHistory(user.id, user.phone, user.email)
                .then(res => {
                    if (res.updated) {
                        console.log("Loyalty Auto-Sync Updated:", res);
                    }
                })
                .catch(err => console.error("Loyalty Auto-Sync Failed:", err));
        }
    }, [user?.id]);

    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: Colors.neutral.white,
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
                tabBarStyle: {
                    borderTopColor: Colors.primary.deep,
                    backgroundColor: Colors.primary.deep,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'index') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'campaigns') {
                        iconName = focused ? 'megaphone' : 'megaphone-outline';
                    } else if (route.name === 'appointments') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'loyalty') {
                        iconName = focused ? 'star' : 'star-outline';
                    } else if (route.name === 'profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else {
                        iconName = 'help-circle';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tabs.Screen name="index" options={{ title: 'Hjem' }} />
            <Tabs.Screen name="campaigns" options={{ title: 'Kampanjer' }} />
            <Tabs.Screen name="appointments" options={{ title: 'Mine timer' }} />
            <Tabs.Screen name="loyalty" options={{ title: 'Kundeklubb' }} />
            <Tabs.Screen name="shop" options={{ href: null, title: 'Butikk' }} />
            <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
            <Tabs.Screen
                name="prices"
                options={{
                    href: null,
                    title: 'Prisliste',
                }}
            />
            <Tabs.Screen
                name="about"
                options={{
                    href: null,
                    title: 'Om oss',
                }}
            />
            <Tabs.Screen
                name="contact"
                options={{
                    href: null,
                    title: 'Kontakt',
                }}
            />
            <Tabs.Screen
                name="booking"
                options={{
                    href: null,
                    headerShown: false,
                    tabBarStyle: { display: 'flex' }
                }}
            />
            <Tabs.Screen
                name="giftcard"
                options={{
                    href: null,
                    title: 'Gavekort',
                }}
            />

        </Tabs>
    );
}
