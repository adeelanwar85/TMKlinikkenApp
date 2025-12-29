
import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Linking, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/src/theme/Theme';
import { H2, H3, Body } from '@/src/theme/Typography';
import { ContentService } from '@/src/services/ContentService';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ContactScreen() {
    const router = useRouter();
    const [config, setConfig] = React.useState<any>(null);

    useFocusEffect(
        React.useCallback(() => {
            loadConfig();
        }, [])
    );

    const loadConfig = async () => {
        const data = await ContentService.getAppConfig();
        setConfig(data);
    };

    const contact = config?.contactInfo || {
        phone: '21 42 36 36',
        email: 'post@tmklinikken.no',
        address: 'Nygaardsgata 36, 1607 Fredrikstad'
    };

    const handleCall = () => {
        Linking.openURL(`tel:${contact.phone.replace(/\s/g, '')}`);
    };

    const handleEmail = () => {
        Linking.openURL(`mailto:${contact.email}`);
    };

    const handleMap = () => {
        const address = contact.address;
        const url = Platform.select({
            ios: `maps:0,0?q=${address}`,
            android: `geo:0,0?q=${address}`,
            web: `https://www.google.com/maps/search/?api=1&query=${address}`
        });
        if (url) Linking.openURL(url);
    };

    const handleBack = () => router.back();
    const handleInsta = () => Linking.openURL('https://www.instagram.com/tmklinikken/');
    const handleFacebook = () => Linking.openURL('https://www.facebook.com/tmklinikken/');

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        {/* Use close icon if modal, or arrow if stack. Arrow is fine. */}
                        <Ionicons name="arrow-back" size={24} color={Colors.primary.deep} />
                    </TouchableOpacity>
                    <H2 style={styles.pageTitle}>Kontakt oss</H2>

                    {/* Social Icons in Header */}
                    <View style={styles.headerRight}>
                        <TouchableOpacity onPress={handleFacebook} style={styles.socialIcon}>
                            <Ionicons name="logo-facebook" size={24} color={Colors.primary.deep} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleInsta} style={styles.socialIcon}>
                            <Ionicons name="logo-instagram" size={24} color={Colors.primary.deep} />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Intro */}
                <View style={styles.introContainer}>
                    <Body style={styles.introText}>
                        Har du spørsmål eller ønsker å bestille time? Ta gjerne kontakt med oss.
                    </Body>
                </View>

                {/* Contact Buttons */}
                <TouchableOpacity style={styles.actionButton} onPress={handleCall} activeOpacity={0.7}>
                    <View style={styles.iconBox}>
                        <Ionicons name="call" size={20} color={Colors.neutral.white} />
                    </View>
                    <View>
                        <Body style={styles.actionLabel}>Ring oss</Body>
                        <H3 style={styles.actionValue}>{contact.phone}</H3>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.neutral.lightGray} style={styles.chevron} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleEmail} activeOpacity={0.7}>
                    <View style={styles.iconBox}>
                        <Ionicons name="mail" size={20} color={Colors.neutral.white} />
                    </View>
                    <View>
                        <Body style={styles.actionLabel}>Send e-post</Body>
                        <H3 style={styles.actionValue}>{contact.email}</H3>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.neutral.lightGray} style={styles.chevron} />
                </TouchableOpacity>

                {/* Address */}
                <TouchableOpacity style={styles.actionButton} onPress={handleMap} activeOpacity={0.7}>
                    <View style={styles.iconBox}>
                        <Ionicons name="location" size={20} color={Colors.neutral.white} />
                    </View>
                    <View>
                        <Body style={styles.actionLabel}>Adresse</Body>
                        <H3 style={styles.actionValue}>{contact.address}</H3>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.neutral.lightGray} style={styles.chevron} />
                </TouchableOpacity>

                {/* Map Preview Card */}
                <TouchableOpacity style={styles.mapCard} onPress={handleMap} activeOpacity={0.9}>
                    <Image
                        source={{ uri: 'https://tmklinikken.no/wp-content/uploads/2021/04/tm-klinikken-kart.png' }}
                        style={styles.mapImage}
                    />
                    <View style={styles.mapOverlay}>
                        <View style={styles.mapIconCircle}>
                            <Ionicons name="map" size={28} color={Colors.primary.main} />
                        </View>
                        <Body style={styles.clickToOpen}>Trykk for å åpne kart</Body>
                    </View>
                </TouchableOpacity>

                {/* Opening Hours - Center & Narrow */}
                <H3 style={styles.sectionTitle}>Åpningstider</H3>
                <View style={styles.openingHoursContainerCentered}>
                    <View style={styles.cardNarrow}>
                        {(() => {
                            const hours = config?.openingHours;
                            let rows: { day: string, time: string }[] = [];
                            let notes: string[] = [];

                            if (typeof hours === 'string') {
                                const lines = hours.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
                                lines.forEach((line: string) => {
                                    // Heuristic: if line has a colon and is relatively short, it's a time row
                                    if (line.includes(':') && line.length < 50 && !line.startsWith('(')) {
                                        const firstColon = line.indexOf(':');
                                        const day = line.substring(0, firstColon).trim();
                                        const time = line.substring(firstColon + 1).trim();
                                        rows.push({ day, time });
                                    } else {
                                        notes.push(line); // It's a note line
                                    }
                                });
                            } else if (typeof hours === 'object' && hours !== null) {
                                // Legacy object (fallback)
                                const dayMap: { [key: string]: string } = {
                                    monday: 'Mandag', tuesday: 'Tirsdag', wednesday: 'Onsdag', thursday: 'Torsdag', friday: 'Fredag', saturday: 'Lørdag', sunday: 'Søndag'
                                };
                                Object.keys(dayMap).forEach((key) => {
                                    if (hours[key] && hours[key] !== 'Stengt') {
                                        rows.push({ day: dayMap[key], time: hours[key] });
                                    }
                                });
                                notes.push('(Behandlinger på kveldstid etter avtale)');
                            } else {
                                // Default static
                                rows = [
                                    { day: 'Mandag - Fredag', time: '10:00 – 16:00' },
                                    { day: 'Torsdag', time: '10:00 – 20:00' },
                                    { day: 'Lørdag', time: '11:00 – 15:00' }
                                ];
                                notes.push('(Behandlinger på kveldstid etter avtale)');
                            }

                            return (
                                <View>
                                    {rows.map((row, i) => (
                                        <React.Fragment key={i}>
                                            <View style={styles.hourRow}>
                                                <Body style={styles.dayText}>{row.day}</Body>
                                                <Body style={styles.timeText}>{row.time}</Body>
                                            </View>
                                            {i < rows.length - 1 && <View style={[styles.separator, { marginVertical: 8 }]} />}
                                        </React.Fragment>
                                    ))}

                                    {notes.length > 0 && (
                                        <>
                                            <View style={[styles.separator, { marginTop: Spacing.l }]} />
                                            {notes.map((note, i) => (
                                                <Body key={i} style={styles.noteText}>{note}</Body>
                                            ))}
                                        </>
                                    )}
                                </View>
                            );
                        })()}


                    </View>
                </View>

                {/* Org Nr */}
                <View style={styles.actionButton}>
                    <View style={styles.iconBox}>
                        <Ionicons name="business" size={20} color={Colors.neutral.white} />
                    </View>
                    <View>
                        <Body style={styles.actionLabel}>Org.nr.</Body>
                        <H3 style={styles.actionValue}>913 941 128</H3>
                    </View>
                </View>

                {/* Ansvarlig Lege Section */}
                <H3 style={styles.sectionTitle}>Ansvarlig lege</H3>
                <View style={styles.actionButton}>
                    <View style={styles.iconBox}>
                        <Ionicons name="medkit" size={20} color={Colors.neutral.white} />
                    </View>
                    <View>
                        <H3 style={styles.actionValue}>Dr. Adeel Anwar</H3>
                        <Body style={styles.actionLabel}>{contact.email}</Body>
                    </View>
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
        backgroundColor: Colors.background.main,
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
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12, // Gap between icons
    },
    socialIcon: {
        padding: 4,
    },
    content: {
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.m,
    },
    introContainer: {
        marginBottom: Spacing.l,
        alignItems: 'center',
        paddingHorizontal: Spacing.l,
    },
    introText: {
        fontSize: 16,
        textAlign: 'center',
        color: Colors.neutral.darkGray,
        lineHeight: 24,
    },
    sectionTitle: {
        fontSize: 18,
        color: Colors.primary.deep,
        marginBottom: Spacing.m,
        marginTop: Spacing.l,
        marginLeft: Spacing.s,
    },
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
    chevron: {
        marginLeft: 'auto',
    },
    // Map Stuff
    mapCard: {
        height: 180,
        borderRadius: 16,
        backgroundColor: '#E0E0E0',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.l,
    },
    mapImage: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#D1D5DB',
        opacity: 0.8,
    },
    mapOverlay: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.85)',
        paddingHorizontal: Spacing.l,
        paddingVertical: Spacing.s,
        borderRadius: 20,
    },
    mapIconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.neutral.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clickToOpen: {
        fontSize: 14,
        color: Colors.primary.deep,
        fontWeight: '600',
        marginTop: 4,
    },
    // Opening Hours
    openingHoursContainerCentered: {
        alignItems: 'center',
        width: '100%',
    },
    cardNarrow: {
        backgroundColor: Colors.neutral.white,
        borderRadius: 16,
        padding: Spacing.m,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: Spacing.m,
        width: '90%', // Reduce width
        maxWidth: 400,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.neutral.lightGray,
        opacity: 0.3,
        marginVertical: Spacing.m,
    },
    hourRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    dayText: {
        fontSize: 16,
        color: Colors.neutral.charcoal,
    },
    timeText: {
        fontSize: 16,
        color: Colors.primary.deep,
        fontWeight: '500',
    },
    noteText: {
        fontSize: 14,
        color: Colors.neutral.darkGray,
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: Spacing.s,
    },
});
