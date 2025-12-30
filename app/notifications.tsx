import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H2, H3 } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationService, SavedNotification } from '@/src/services/NotificationService';
import { useFocusEffect } from '@react-navigation/native';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

export default function NotificationsScreen() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<SavedNotification[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadNotifications();
            return () => {
                // Optional: Mark as read when leaving? Or do it immediately on load.
                // Let's do it on load so the badge clears.
                NotificationService.markAllAsRead();
            };
        }, [])
    );

    const loadNotifications = async () => {
        setLoading(true);
        const data = await NotificationService.getHistory();
        setNotifications(data);
        setLoading(false);
        // Mark read after fetching to update storage for next time, 
        // but we assume user "saw" them by opening the screen.
        await NotificationService.markAllAsRead();
    };

    const renderItem = ({ item }: { item: SavedNotification }) => {
        const dateStr = item.date ? format(item.date, 'd. MMMM HH:mm', { locale: nb }) : '';

        return (
            <View style={[styles.card, !item.read && styles.unreadCard]}>
                <View style={styles.iconContainer}>
                    <Ionicons name="notifications" size={24} color={Colors.primary.deep} />
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <H3 style={styles.cardTitle}>{item.title}</H3>
                        <Body style={styles.cardDate}>{dateStr}</Body>
                    </View>
                    <Body style={styles.cardBody}>{item.body}</Body>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary.deep} />
                    </TouchableOpacity>
                    <H2 style={styles.pageTitle}>Varslinger</H2>
                    <View style={{ width: 40 }} />
                </View>
            </SafeAreaView>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.primary.deep} />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="notifications-off-outline" size={48} color="#ccc" style={{ marginBottom: 10 }} />
                            <Body style={{ color: '#888', textAlign: 'center' }}>Ingen varslinger ennå.</Body>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    safeArea: {
        backgroundColor: Colors.background.main,
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.s,
        backgroundColor: Colors.background.main,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: -Spacing.s,
    },
    pageTitle: {
        fontSize: 20,
        color: Colors.primary.deep,
        fontWeight: '600',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: Spacing.m,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.neutral.white,
        borderRadius: 12,
        padding: Spacing.m,
        marginBottom: Spacing.m,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    unreadCard: {
        backgroundColor: '#fffcf5', // Very subtle highlight
        borderLeftWidth: 3,
        borderLeftColor: Colors.primary.deep,
    },
    iconContainer: {
        marginRight: Spacing.m,
        justifyContent: 'flex-start',
        paddingTop: 2,
    },
    cardContent: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    cardDate: {
        fontSize: 12,
        color: '#999',
        marginLeft: 8,
    },
    cardBody: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    emptyState: {
        padding: 60,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
