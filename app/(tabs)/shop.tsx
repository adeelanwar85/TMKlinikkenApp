import { Colors } from '@/src/theme/Theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ShopScreen() {
    return (
        <View style={styles.container}>
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
    webview: {
        flex: 1,
    }
});
