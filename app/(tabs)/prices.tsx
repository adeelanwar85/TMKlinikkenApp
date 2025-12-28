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
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PRICES, PriceCategory } from '@/src/constants/Prices';
import { useRouter } from 'expo-router';
import { LaserIcon } from '@/src/components/icons/LaserIcon';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function PricesScreen() {
    const router = useRouter();
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
    const handleBook = () => router.push('/booking');

    const filterPrices = () => {
        if (!searchQuery) return PRICES;

        const query = searchQuery.toLowerCase().trim();

        return PRICES.map(category => {
            // 1. Check if category title or keywords match
            const categoryMatch =
                category.title.toLowerCase().includes(query) ||
                category.keywords?.some(k => k.toLowerCase().includes(query));

            // If category matches top-level, we still want to filter its items to show relevant ones, 
            // OR show all if it's a direct category match. 
            // Strategy: Filter items deeply. If category matches, maybe show all? 
            // Let's stick to "show valid items only" unless the query is very generic for the category.

            // Check items matches
            const matchingItems = category.items.map(sub => {
                // 2. Check subcategory title or keywords
                const subMatch =
                    sub.title?.toLowerCase().includes(query) ||
                    sub.keywords?.some(k => k.toLowerCase().includes(query));

                // 3. Filter distinct data items
                const matchingData = sub.data.filter(item =>
                    item.name.toLowerCase().includes(query) ||
                    item.description?.toLowerCase().includes(query) ||
                    (categoryMatch || subMatch) // If parent matches, include item? 
                    // Better UX: strict filtering on items unless parent is a strong match.
                    // But usually users want search to narrow down.
                );

                // If subcategory matches, we might want to show all its data?
                if (subMatch) {
                    return sub;
                }

                if (matchingData.length > 0) return { ...sub, data: matchingData };
                return null;
            }).filter(Boolean);

            // If category matched via keywords (e.g. "botox" -> Injeksjoner), we should ensure we have items.
            // If category matches but no items match specifically, we could arguably show all, 
            // but usually we want to highlight the specific treatments.
            // Let's return if we found any matching items.
            if (matchingItems.length > 0) return { ...category, items: matchingItems };

            // Fallback: if category matched title/keywords but no specific items were caught (rare if keywords are good),
            // maybe user just wants to see that category?
            if (categoryMatch) return category;

            return null;
        }).filter(Boolean) as PriceCategory[];
    };

    const filteredPrices = filterPrices();
    const displayCategories = searchQuery ? filteredPrices : PRICES;

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
                                        onPress={handleBook}
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
                    <Text style={styles.headerTitle}>Prisliste</Text>
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
                                const allTitles = new Set(filterPrices().map(p => p.title));
                                setExpandedCategories(allTitles);
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
