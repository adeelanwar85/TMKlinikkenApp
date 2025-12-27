import { CAMPAIGNS } from '@/src/constants/Campaigns';
import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H1, H2, H3 } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { FlatList, Image, Platform, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';

export default function CampaignsScreen() {

    useEffect(() => {
        // Mock subscription to topic
        registerForNewsUpdates();
    }, []);

    const registerForNewsUpdates = async () => {
        // In a real app, we would send the token to a backend with a tag 'news'
        // For now, we just simulate asking for permission if not granted
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
            // Silently try to get it, or just ignore. 
            // We usually ask in a more controlled flow.
        }
        console.log("Ready to receive campaign updates");
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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <H1 style={styles.pageTitle}>Kampanjer</H1>
                <TouchableOpacity style={styles.bellButton} onPress={() => Alert.alert("Varslinger", "Du abonnerer på nyheter fra oss.")}>
                    <Ionicons name="notifications" size={24} color={Colors.primary.dark} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={CAMPAIGNS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
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
    bellButton: {
        padding: Spacing.s,
    },
    listContent: {
        padding: Spacing.m,
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
});
