import { Colors } from '@/src/theme/Theme';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebViewScreen() {
    const params = useLocalSearchParams();
    const navigation = useNavigation();

    // Parse URL and Title
    const url = typeof params.url === 'string' ? params.url : 'https://www.tmklinikken.no';
    const title = typeof params.title === 'string' ? params.title : 'TM Klinikken';

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: title,
            headerBackTitle: 'Tilbake',
            headerTintColor: Colors.primary.deep,
        });
    }, [navigation, title]);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                presentation: 'card',
                headerShown: true, // Ensure header is shown for back button
                headerStyle: { backgroundColor: Colors.neutral.white },
                headerTintColor: Colors.primary.deep,
                headerTitleStyle: { color: Colors.primary.deep },
            }} />
            {Platform.OS === 'web' ? (
                // @ts-ignore
                <iframe src={url} style={{ width: '100%', height: '100%', border: 'none' }} />
            ) : (
                <WebView
                    source={{ uri: url }}
                    style={styles.webview}
                    startInLoadingState={true}
                    renderLoading={() => (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.primary.main} />
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.neutral.white,
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
});
