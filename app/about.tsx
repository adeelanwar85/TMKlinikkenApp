import { EMPLOYEES } from '@/src/constants/Employees';
import { GradientHeader } from '@/src/components/GradientHeader';
import { Colors, Spacing } from '@/src/theme/Theme';
import { Body, H2, H3 } from '@/src/theme/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Linking, Platform, ScrollView, StyleSheet, TouchableOpacity, View, LayoutAnimation, UIManager, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function AboutScreen() {
    const router = useRouter();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const handleCall = () => {
        Linking.openURL('tel:+4721423636');
    };

    const handleEmail = () => {
        Linking.openURL('mailto:post@tmklinikken.no');
    };

    const handleMap = () => {
        const address = 'Nygaardsgata 36, 1607 Fredrikstad';
        const url = Platform.select({
            ios: `maps:0,0?q=${address}`,
            android: `geo:0,0?q=${address}`,
            web: `https://www.google.com/maps/search/?api=1&query=${address}`
        });
        if (url) Linking.openURL(url);
    };

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.header}>
                <H2 style={styles.pageTitle}>Om oss</H2>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Intro Section */}
                <View style={styles.section}>
                    <View style={{ alignItems: 'center', marginBottom: Spacing.l }}>
                        <Image
                            source={require('../assets/images/tm-logo.png')}
                            style={styles.pageLogo}
                            resizeMode="contain"
                        />
                    </View>
                    <H2 style={styles.heading}>Din klinikk for estetisk medisin</H2>
                    <Body style={styles.paragraph}>
                        TM Klinikken ligger i Fredrikstad sentrum. Vi tilbyr et bredt spekter av estetiske behandlinger og medisinske hudprogrammer, utført av sertifisert helsepersonell.
                    </Body>
                </View>



                {/* Team Section */}
                <H3 style={styles.subHeading}>Vårt Team</H3>
                {/* @ts-ignore */}
                {EMPLOYEES.map((employee, index) => {
                    const isExpanded = expandedIndex === index;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.card, isExpanded && styles.cardExpanded]}
                            activeOpacity={0.9}
                            onPress={() => {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                setExpandedIndex(isExpanded ? null : index);
                            }}
                        >
                            <View style={styles.doctorHeader}>
                                <Image source={employee.image} style={styles.avatar} />
                                <View style={styles.doctorInfo}>
                                    <H3 style={styles.doctorName}>{employee.name}</H3>
                                    <Body style={styles.doctorTitle}>{employee.title}</Body>
                                </View>
                                <Ionicons
                                    name={isExpanded ? "chevron-up" : "chevron-down"}
                                    size={24}
                                    color={Colors.neutral.lightGray}
                                />
                            </View>

                            {isExpanded && (
                                <View style={styles.bioContainer}>
                                    <View style={styles.separator} />
                                    <Body style={styles.bioText}>{employee.bio}</Body>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}

                {/* Contact Actions */}
                <H3 style={styles.subHeading}>Kontakt oss</H3>

                <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                    <View style={styles.iconBox}>
                        <Ionicons name="call" size={20} color={Colors.neutral.white} />
                    </View>
                    <View>
                        <Body style={styles.actionLabel}>Ring oss</Body>
                        <Body style={styles.actionValue}>21 42 36 36</Body>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.neutral.lightGray} style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
                    <View style={styles.iconBox}>
                        <Ionicons name="mail" size={20} color={Colors.neutral.white} />
                    </View>
                    <View>
                        <Body style={styles.actionLabel}>Send e-post</Body>
                        <Body style={styles.actionValue}>post@tmklinikken.no</Body>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.neutral.lightGray} style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleMap}>
                    <View style={styles.iconBox}>
                        <Ionicons name="location" size={20} color={Colors.neutral.white} />
                    </View>
                    <View>
                        <Body style={styles.actionLabel}>Besøk oss</Body>
                        <Body style={styles.actionValue}>Nygaardsgata 36, Fredrikstad</Body>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.neutral.lightGray} style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    content: {
        paddingTop: 0,
        paddingBottom: 40,
    },
    header: {
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.s,
        backgroundColor: Colors.background.main,
    },
    pageTitle: {
        fontSize: 28,
        color: Colors.primary.deep,
    },
    // introContainer: removed
    // logoCard: removed
    pageLogo: {
        width: 140,
        height: 45,
    },
    section: {
        marginBottom: Spacing.l,
        paddingHorizontal: Spacing.l,
    },
    heading: {
        fontSize: 22,
        color: Colors.primary.deep,
        marginBottom: Spacing.s,
    },
    subHeading: {
        fontSize: 18,
        color: Colors.primary.deep,
        marginTop: Spacing.l,
        marginBottom: Spacing.m,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: Colors.neutral.charcoal,
    },
    card: {
        backgroundColor: Colors.neutral.white,
        borderRadius: 16,
        padding: Spacing.m,
        marginBottom: Spacing.m,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    doctorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.m,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: Spacing.m,
        backgroundColor: Colors.neutral.lightGray,
    },
    doctorInfo: {
        flex: 1,
    },
    doctorName: {
        fontSize: 18,
        color: Colors.primary.deep,
    },
    doctorTitle: {
        fontSize: 14,
        color: Colors.neutral.darkGray,
        opacity: 0.8,
    },
    cardExpanded: {
        backgroundColor: '#fff',
        borderColor: Colors.primary.light,
        borderWidth: 1,
    },
    bioContainer: {
        marginTop: Spacing.s,
    },
    bioText: {
        fontSize: 15,
        lineHeight: 24,
        color: Colors.neutral.charcoal,
        opacity: 0.9,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.neutral.lightGray,
        opacity: 0.5,
        marginVertical: Spacing.m,
    },
    // ... Action Button styles remain
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.neutral.white,
        padding: Spacing.m,
        borderRadius: 12,
        marginBottom: Spacing.s,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: Colors.primary.main,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.m,
    },
    actionLabel: {
        fontSize: 12,
        color: Colors.neutral.darkGray,
        marginBottom: 2,
    },
    actionValue: {
        fontSize: 15,
        color: Colors.primary.deep,
        fontWeight: '600',
    },
});
