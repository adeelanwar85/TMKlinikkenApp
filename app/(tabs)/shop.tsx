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
            {/* WebView takes remaining space */}
            <WebView
                source={{ uri: 'https://www.tmklinikken.no/butikk' }}
                style={styles.webview}
                startInLoadingState
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
    }
});
