import { Colors } from '@/src/theme/Theme';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebViewScreen() {
    const params = useLocalSearchParams();
    const navigation = useNavigation();

    // Parse URL and Title
    const url = typeof params.url === 'string' ? params.url : 'https://www.tmklinikken.no';
    const title = typeof params.title === 'string' ? params.title : 'TM Klinikken';
    const script = typeof params.script === 'string' ? params.script : undefined;
    const successUrl = typeof params.successUrl === 'string' ? params.successUrl : undefined;

    const [isSuccess, setIsSuccess] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: title,
            headerBackTitle: 'Tilbake',
            headerTintColor: Colors.primary.deep,
        });
    }, [navigation, title]);

    const handleNavigationStateChange = (navState: any) => {
        if (successUrl && navState.url && navState.url.includes(successUrl) && !isSuccess) {
            setIsSuccess(true);
            // Auto close after 3 seconds
            setTimeout(() => {
                if (navigation.canGoBack()) navigation.goBack();
            }, 3000);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Custom Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text onPress={() => navigation.goBack()} style={styles.backButton}>← Tilbake</Text>
                </View>
                <Text style={styles.headerTitle}>{title}</Text>
                <View style={styles.headerRight}>
                    {isSuccess && <Text style={{ fontSize: 20 }}>🎉</Text>}
                </View>
            </View>

            {Platform.OS === 'web' ? (
                // @ts-ignore
                <iframe src={url} style={{ width: '100%', height: '100%', border: 'none' }} />
            ) : (
                <View style={{ flex: 1 }}>
                    <WebView
                        source={{ uri: url }}
                        style={styles.webview}
                        startInLoadingState={true}
                        injectedJavaScript={script}
                        onNavigationStateChange={handleNavigationStateChange}
                        renderLoading={() => (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={Colors.primary.main} />
                            </View>
                        )}
                    />
                    {isSuccess && (
                        <View style={styles.successOverlay}>
                            <Text style={styles.successText}>Kjøp fullført!</Text>
                            <Text style={styles.successSubText}>Sender deg tilbake...</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.neutral.white,
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: Colors.neutral.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral.lightGray,
    },
    headerLeft: {
        width: 80,
    },
    backButton: {
        fontSize: 16,
        color: Colors.primary.main,
        fontWeight: 'bold',
        cursor: 'pointer', // For web hover
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary.deep,
    },
    headerRight: {
        width: 80,
    },
    webview: {
        flex: 1,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.neutral.white,
    },
    successOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    successText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.status.success,
        marginBottom: 8,
    },
    successSubText: {
        fontSize: 16,
        color: Colors.neutral.darkGray,
    },
});
