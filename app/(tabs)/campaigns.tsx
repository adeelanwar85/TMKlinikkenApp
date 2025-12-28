import { CAMPAIGNS } from '@/src/constants/Campaigns';
import { GradientHeader } from '@/src/components/GradientHeader';
import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H1, H2, H3 } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { FlatList, Image, Platform, StyleSheet, TouchableOpacity, View, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';

export default function CampaignsScreen() {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [notifications, setNotifications] = React.useState<any[]>([]);

    useEffect(() => {
        registerForNewsUpdates();
        // Setup listeners for incoming notifications
        import('@/src/services/NotificationService').then(({ NotificationService }) => {
            NotificationService.setupNotificationListeners();
        });
    }, []);

    const registerForNewsUpdates = async () => {
        const { NotificationService } = await import('@/src/services/NotificationService');
        await NotificationService.registerForPushNotificationsAsync();
    };

    const openNotificationInbox = async () => {
        const { NotificationService } = await import('@/src/services/NotificationService');
        const history = await NotificationService.getHistory();
        setNotifications(history);
        setModalVisible(true);
    };

    const renderItem = ({ item }: { item: typeof CAMPAIGNS[0] }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.9}>
            <Image source={item.imageUrl} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <H3 style={styles.cardTitle}>{item.title}</H3>
                </View>
                <Body style={styles.dateText}>{item.date}</Body>
                <Body style={styles.description} numberOfLines={3}>
                    {item.description}
                </Body>
                <View style={styles.readMore}>
                    <Body style={styles.readMoreText}>Les mer</Body>
                    <Ionicons name="arrow-forward" size={16} color={Colors.primary.main} />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.header}>
                <H1 style={styles.pageTitle}>Kampanjer</H1>
                <TouchableOpacity style={styles.bellButton} onPress={openNotificationInbox}>
                    <Ionicons name="notifications-outline" size={24} color={Colors.primary.deep} />
                </TouchableOpacity>
            </SafeAreaView>

            {/* Content */}
            <FlatList
                data={CAMPAIGNS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {/* Notification Inbox Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <H2>Dine Varsler</H2>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color={Colors.neutral.darkGray} />
                            </TouchableOpacity>
                        </View>

                        {notifications.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="notifications-off-outline" size={48} color={Colors.neutral.lightGray} />
                                <Body style={{ color: Colors.neutral.darkGray, marginTop: 10 }}>Ingen varsler enda</Body>
                            </View>
                        ) : (
                            <FlatList
                                data={notifications}
                                keyExtractor={(item) => item.id + item.date}
                                renderItem={({ item }) => (
                                    <View style={styles.notificationItem}>
                                        <View style={styles.notifIcon}>
                                            <Ionicons name="mail-outline" size={20} color={Colors.primary.main} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <H3 style={{ fontSize: 16 }}>{item.title}</H3>
                                            <Body style={{ fontSize: 14, color: Colors.neutral.charcoal }}>{item.body}</Body>
                                            <Body style={{ fontSize: 10, color: Colors.neutral.lightGray, marginTop: 4 }}>
                                                {new Date(item.date).toLocaleDateString()}
                                            </Body>
                                        </View>
                                    </View>
                                )}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.m,
        backgroundColor: Colors.neutral.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral.lightGray,
    },
    pageTitle: {
        fontSize: 28,
        color: Colors.primary.deep,
    },
    listContent: {
        padding: Spacing.m,
        paddingTop: 0, // Handled by header overlap
    },
    bellButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    introContainer: {
        marginBottom: Spacing.m,
        marginTop: -30,
        zIndex: 10,
        alignItems: 'center',
    },
    logoCard: {
        backgroundColor: 'white',
        paddingVertical: Spacing.s,
        paddingHorizontal: Spacing.xl,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        width: '100%',
    },
    logo: {
        width: 120,
        height: 40,
    },
    card: {
        backgroundColor: Colors.neutral.white,
        borderRadius: 16,
        marginBottom: Spacing.l,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: 180,
        backgroundColor: Colors.neutral.lightGray,
    },
    cardContent: {
        padding: Spacing.m,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    cardTitle: {
        fontSize: 20,
        color: Colors.primary.deep,
        flex: 1,
    },
    dateText: {
        fontSize: 12,
        color: Colors.neutral.darkGray,
        marginBottom: Spacing.s,
    },
    description: {
        fontSize: 16,
        color: Colors.neutral.charcoal,
        lineHeight: 22,
        marginBottom: Spacing.m,
    },
    readMore: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    readMoreText: {
        fontSize: 14,
        color: Colors.primary.main,
        fontWeight: '600',
        marginRight: 4,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.neutral.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '70%',
        padding: Spacing.m,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.m,
        paddingBottom: Spacing.s,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral.lightGray,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.5,
    },
    notificationItem: {
        flexDirection: 'row',
        paddingVertical: Spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral.lightGray,
    },
    notifIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.m,
    },
});
