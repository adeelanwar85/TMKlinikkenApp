import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H2, H3 } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ContentService } from '@/src/services/ContentService';
import { Employee } from '@/src/constants/Employees';
import { useFocusEffect } from '@react-navigation/native';

export default function AdminEmployeesScreen() {
    const router = useRouter();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadEmployees();
        }, [])
    );

    const loadEmployees = async () => {
        setLoading(true);
        const data = await ContentService.getAllEmployees();
        setEmployees(data);
        setLoading(false);
    };

    const handleCreate = () => {
        router.push('/admin/employees/new');
    };

    const renderItem = ({ item }: { item: Employee }) => {
        // Handle image source safely (string vs require)
        const imageSource = typeof item.image === 'string' ? { uri: item.image } : item.image;

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/admin/employees/${item.name}`)}
                activeOpacity={0.8}
            >
                <View style={styles.imageContainer}>
                    {imageSource ? (
                        <Image source={imageSource} style={styles.avatar} resizeMode="cover" />
                    ) : (
                        <View style={[styles.avatar, styles.placeholderAvatar]}>
                            <Ionicons name="person" size={24} color="#ccc" />
                        </View>
                    )}
                </View>
                <View style={styles.cardContent}>
                    <H3 style={styles.cardTitle}>{item.name}</H3>
                    <Body style={styles.cardRole}>{item.title}</Body>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.neutral.lightGray} />
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
                    <H2 style={styles.pageTitle}>Ansatte</H2>
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
                    data={employees}
                    renderItem={renderItem}
                    keyExtractor={item => item.name}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Body style={{ color: '#888' }}>Ingen ansatte funnet. Trykk + for å legge til.</Body>
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
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    imageContainer: {
        marginRight: 16,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f5f5f5',
    },
    placeholderAvatar: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    cardRole: {
        fontSize: 14,
        color: Colors.primary.deep,
        fontWeight: '500',
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    }
});
