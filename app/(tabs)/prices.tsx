import { Colors, Spacing } from '@/src/theme/Theme';
import { H1, H2, H3, Body } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    LayoutAnimation,
    Platform,
    UIManager,
    Image,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PRICES, PriceCategory, PriceItem } from '@/src/constants/Prices';
import { useRouter } from 'expo-router';
import { LaserIcon } from '@/src/components/icons/LaserIcon';
import { useTreatments } from '@/src/hooks/useTreatments';
import { useBooking } from '@/src/context/BookingContext';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function PricesScreen() {
    const router = useRouter();
    const { treatments, loading, refresh } = useTreatments();
    const { setTreatment } = useBooking(); // Hook call is fine here
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const toggleCategory = (title: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(title)) {
                next.delete(title);
            } else {
                next.add(title);
            }
            return next;
        });
    };

    const handleBack = () => router.back();

    const handleBook = (item: PriceItem) => {
        if (item.id) {
            // Map PriceItem to Service (HanoType)
            // Note: Duration might be number or string depending on API. 
            // HanoService now maps it. We cast safely.
            setTreatment({
                Id: item.id,
                Name: item.name,
                Price: parseInt(item.price.replace(/\D/g, '')) || 0,
                Duration: item.duration?.toString() || '00:30:00', // Default if missing
                Description: item.description
            });
            // Go straight to date selection since we picked a treatment
            router.push('/booking/date-select');
        } else {
            // Fallback for manual items or missing IDs
            router.push('/booking');
        }
    };

    const filterPrices = (overrideQuery?: string) => {
        // Use live treatments instead of static PRICES
        const dataToFilter = treatments;

        // Use override if provided (for instant updates), otherwise state
        const queryToUse = overrideQuery !== undefined ? overrideQuery : searchQuery;

        if (!queryToUse) return dataToFilter;

        const query = queryToUse.toLowerCase().trim();

        return dataToFilter.map(category => {
            // 1. Check if category title matches (Strictly title, not keywords, to avoid "Filler" -> "Injeksjoner" -> All)
            const categoryTitleMatch = category.title.toLowerCase().includes(query);

            const matchingItems = category.items.map(sub => {
                // 2. Check subcategory title or keywords
                const subMatch =
                    sub.title?.toLowerCase().includes(query) ||
                    sub.keywords?.some(k => k.toLowerCase().includes(query));

                // 3. Filter distinct data items
                const matchingData = sub.data.filter(item =>
                    item.name.toLowerCase().includes(query) ||
                    item.description?.toLowerCase().includes(query)
                );

                // If sub-category title/keyword matches, return the whole sub-category
                if (subMatch) {
                    return sub;
                }

                // If specific data items match, return sub-category with ONLY those items
                if (matchingData.length > 0) return { ...sub, data: matchingData };

                return null;
            }).filter(Boolean);

            // If we found specific matching items/sub-cats, return category with filtered content
            if (matchingItems.length > 0) return { ...category, items: matchingItems };

            // Fallback: If ONLY the category title matches (e.g. "Injeksjoner"), show everything
            // This ensures searching "Injeksjoner" still lists all injections.
            if (categoryTitleMatch) return category;

            return null;
        }).filter(Boolean) as PriceCategory[];
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.primary.main} />
                <Body style={{ marginTop: 20 }}>Laster priser fra Hano...</Body>
            </View>
        );
    }

    const filteredPrices = filterPrices();
    const displayCategories = searchQuery ? filteredPrices : treatments;

    const renderCategoryIcon = (category: PriceCategory) => {
        if (category.icon === 'custom-laser') {
            return <LaserIcon color={Colors.primary.main} size={24} />;
        }
        if (category.image) {
            return (
                <Image
                    source={category.image}
                    style={styles.categoryImage}
                    resizeMode="contain"
                />
            );
        }
        return (
            <Ionicons
                name={category.icon as any || 'pricetag-outline'}
                size={24}
                color={Colors.primary.main}
            />
        );
    };

    const renderCategory = (category: PriceCategory) => {
        const isExpanded = expandedCategories.has(category.id);

        return (
            <View key={category.id} style={styles.categoryCard}>
                <TouchableOpacity
                    style={styles.categoryHeader}
                    onPress={() => toggleCategory(category.id)}
                    activeOpacity={0.7}
                >
                    <View style={styles.categoryHeaderLeft}>
                        <View style={styles.iconContainer}>
                            {renderCategoryIcon(category)}
                        </View>
                        <H3 style={styles.categoryTitle}>{category.title}</H3>
                    </View>
                    <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={Colors.neutral.darkGray}
                    />
                </TouchableOpacity>

                {isExpanded && (
                    <View style={styles.subCategoryList}>
                        {category.items.map((subCategory, index) => (
                            <View key={index} style={styles.subCategoryContainer}>
                                {subCategory.title && (
                                    <H3 style={styles.subCategoryTitle}>{subCategory.title}</H3>
                                )}
                                {subCategory.data.map((item, itemIndex) => (
                                    <TouchableOpacity
                                        key={itemIndex}
                                        style={styles.priceItem}
                                        onPress={() => handleBook(item)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.priceItemContent}>
                                            <View style={styles.priceItemLeft}>
                                                <Body style={styles.priceItemName}>{item.name}</Body>
                                                {item.description && (
                                                    <Body style={styles.priceItemDescription}>{item.description}</Body>
                                                )}
                                            </View>
                                            <View style={styles.priceItemRight}>
                                                <Body style={styles.priceItemPrice}>
                                                    {item.fromPrice && 'fra '}
                                                    {item.price}
                                                </Body>
                                                <Ionicons name="chevron-forward" size={16} color={Colors.neutral.lightGray} style={{ marginLeft: 8 }} />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.primary.deep} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Priser</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color={Colors.neutral.darkGray} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Søk etter behandling..."
                        placeholderTextColor={Colors.neutral.lightGray}
                        value={searchQuery}
                        onChangeText={(text) => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            setSearchQuery(text);
                            if (text) {
                                // Expand all matching categories when searching
                                // Pass 'text' explicitly to avoid stale state
                                const results = filterPrices(text);
                                const allIds = new Set(results.map(p => p.id));
                                setExpandedCategories(allIds);
                            } else {
                                setExpandedCategories(new Set());
                            }
                        }}
                        clearButtonMode="while-editing"
                        autoCapitalize="none"
                    />
                </View>
            </SafeAreaView>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.listContainer}>
                    {displayCategories.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="alert-circle-outline" size={40} color={Colors.neutral.lightGray} />
                            <Body style={{ textAlign: 'center', marginTop: 10, color: Colors.neutral.darkGray }}>
                                Ingen behandlinger funnet for "{searchQuery}"
                            </Body>
                        </View>
                    ) : (
                        displayCategories.map(renderCategory)
                    )}
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
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
        marginBottom: Spacing.s,
    },
    backButton: {
        padding: Spacing.s,
        marginLeft: -Spacing.s,
    },
    headerTitle: {
        fontSize: 20,
        color: Colors.primary.deep,
        fontWeight: '600',
    },
    scrollContent: {
        paddingTop: Spacing.s,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.neutral.white,
        marginHorizontal: Spacing.m,
        marginBottom: Spacing.m,
        paddingHorizontal: Spacing.m,
        height: 50,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    searchIcon: {
        marginRight: Spacing.s,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.neutral.charcoal,
        height: '100%',
    },
    listContainer: {
        paddingHorizontal: Spacing.m,
    },
    categoryCard: {
        backgroundColor: Colors.neutral.white,
        borderRadius: 12,
        marginBottom: Spacing.m,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Changed to space-between for arrow alignment
        padding: Spacing.m,
        backgroundColor: '#FCFCFC',
    },
    categoryHeaderExpanded: {
        backgroundColor: '#F8F8F8', // Slightly darker when expanded
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    categoryHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F5F5F5', // Matching booking page clean style
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.m,
    },
    categoryImage: {
        width: 24,
        height: 24,
        tintColor: Colors.primary.main,
    },
    categoryTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: Colors.primary.deep,
    },
    subCategoryList: {
        paddingTop: Spacing.s,
    },
    subCategoryContainer: {
        marginBottom: Spacing.m,
    },
    subCategoryTitle: {
        fontSize: 14,
        color: Colors.neutral.darkGray,
        marginBottom: Spacing.s,
        marginTop: Spacing.s,
        paddingHorizontal: Spacing.m,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '600',
    },
    priceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: Spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.03)',
        backgroundColor: Colors.neutral.white,
    },
    priceItemContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceItemLeft: {
        flex: 1,
        marginRight: Spacing.m,
    },
    priceItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceItemName: {
        fontSize: 16,
        color: Colors.neutral.charcoal,
    },
    priceItemDescription: {
        fontSize: 13,
        color: Colors.neutral.darkGray,
        marginTop: 2,
    },
    priceItemPrice: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.primary.deep,
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: 40,
    },
});
