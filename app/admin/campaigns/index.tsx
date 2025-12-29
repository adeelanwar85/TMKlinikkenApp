import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H2, H3 } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ContentService } from '@/src/services/ContentService';
import { Campaign } from '@/src/constants/Campaigns';
import { useFocusEffect } from '@react-navigation/native';

export default function AdminCampaignsScreen() {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadCampaigns();
        }, [])
    );

    const loadCampaigns = async () => {
        setLoading(true);
        const data = await ContentService.getAllCampaigns();
        setCampaigns(data);
        setLoading(false);
    };

    const handleCreate = () => {
        router.push('/admin/campaigns/new');
    };

    const renderItem = ({ item }: { item: Campaign }) => {
        // Handle image source safely (string vs require)
        const imageSource = typeof item.imageUrl === 'string' ? { uri: item.imageUrl } : item.imageUrl;

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/admin/campaigns/${item.id}`)}
                activeOpacity={0.8}
            >
                <View style={styles.imageContainer}>
                    {imageSource ? (
                        <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <Ionicons name="image-outline" size={24} color="#ccc" />
                        </View>
                    )}
                    {item.active && (
                        <View style={styles.activeBadge}>
                            <Body style={styles.activeText}>Aktiv</Body>
                        </View>
                    )}
                </View>
                <View style={styles.cardContent}>
                    <H3 style={styles.cardTitle} numberOfLines={1}>{item.title}</H3>
                    <Body style={styles.cardDesc} numberOfLines={2}>{item.description}</Body>
                    <Body style={styles.cardDate}>{item.date}</Body>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.neutral.lightGray} style={{ marginRight: 10 }} />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary.deep} />
                    </TouchableOpacity>
                    <H2 style={styles.pageTitle}>Kampanjer</H2>
                    <TouchableOpacity onPress={handleCreate} style={styles.addButton}>
                        <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.primary.deep} />
                </View>
            ) : (
                <FlatList
                    data={campaigns}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Body style={{ color: '#888' }}>Ingen kampanjer funnet. Trykk + for å legge til.</Body>
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
    addButton: {
        backgroundColor: Colors.primary.deep,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
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
        alignItems: 'center',
        backgroundColor: Colors.neutral.white,
        borderRadius: 16,
        marginBottom: Spacing.m,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        height: 100,
    },
    imageContainer: {
        width: 100,
        height: '100%',
        backgroundColor: '#f5f5f5',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    cardDate: {
        fontSize: 11,
        color: '#999',
    },
    activeBadge: {
        position: 'absolute',
        top: 6,
        left: 6,
        backgroundColor: '#4CAF50',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    activeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    }
});
