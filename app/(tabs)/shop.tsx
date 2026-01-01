import { Colors } from '@/src/theme/Theme';
import { GradientHeader } from '@/src/components/GradientHeader';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ShopScreen() {
    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.header}>
                <Text style={styles.pageTitle}>Butikk</Text>
            </SafeAreaView>
            <WebView
                source={{ uri: 'https://tmklinikken.no/butikk/' }}
                style={styles.webview}
                startInLoadingState
                renderLoading={() => (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary.main} />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.main,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: Colors.background.main,
    },
    pageTitle: {
        fontSize: 28,
        color: Colors.primary.deep,
        fontWeight: 'bold',
    },
    webview: {
        flex: 1,
        overflow: 'hidden',
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background.main,
    }
});
