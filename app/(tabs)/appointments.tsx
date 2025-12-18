import { Colors, Spacing } from '@/src/theme/Theme';
import { H1 } from '@/src/theme/Typography';
import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const PASIENTSKY_URL = 'https://psno-patient-platform-fe.svc.pasientsky.no/embedded/planner/booking?serviceProviderId=f6589276-da31-11ef-84dd-6e2f1650ebae';

export default function AppointmentsScreen() {
    // Attempt to inject styling to match app theme (Native only)
    const injectedCSS = `
        const style = document.createElement('style');
        style.textContent = \`
            :root {
                --primary-color: ${Colors.primary.deep};
                --secondary-color: ${Colors.primary.main};
                --button-color: ${Colors.primary.deep};
                --background-color: ${Colors.neutral.white};
                --text-color: ${Colors.neutral.charcoal};
            }
            
            body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
                background-color: ${Colors.neutral.white} !important;
            }

            /* Buttons */
            button, .btn, .MuiButton-root, [class*="button"], [class*="Button"] {
                background-color: ${Colors.primary.deep} !important;
                color: ${Colors.neutral.white} !important;
                border-radius: 12px !important;
                border: none !important;
                box-shadow: none !important;
            }
            
            /* Secondary Buttons */
            .btn-secondary, [class*="secondary"], [class*="outlined"] {
                background-color: transparent !important;
                color: ${Colors.primary.deep} !important;
                border: 1px solid ${Colors.primary.deep} !important;
            }

            /* Headers */
            h1, h2, h3, h4, h5, h6, [class*="title"], [class*="header"] {
                color: ${Colors.primary.deep} !important;
            }

            /* Links */
            a {
                color: ${Colors.primary.dark} !important;
            }

            /* Calendar Selected State */
            .selected, [class*="selected"], [aria-selected="true"] {
                background-color: ${Colors.primary.main} !important;
                color: white !important;
            }
        \`;
        document.head.appendChild(style);
        true; // note: important for injectedJavaScript to not hang
    `;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <H1 style={styles.headerTitle}>Bestill time</H1>
            </View>

            <View style={styles.content}>
                {Platform.OS === 'web' ? (
                    // @ts-ignore
                    <iframe
                        src={PASIENTSKY_URL}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Timebestilling"
                    />
                ) : (
                    <WebView
                        source={{ uri: PASIENTSKY_URL }}
                        style={styles.webview}
                        startInLoadingState={true}
                        injectedJavaScript={injectedCSS}
                        renderLoading={() => (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={Colors.primary.main} />
                            </View>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.neutral.white,
    },
    header: {
        paddingHorizontal: Spacing.m,
        paddingBottom: Spacing.s,
        backgroundColor: Colors.neutral.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral.lightGray,
    },
    headerTitle: {
        color: Colors.primary.deep,
        // @ts-ignore
        fontDesign: 'rounded',
    },
    content: {
        flex: 1,
    },
    webview: {
        flex: 1,
        backgroundColor: Colors.neutral.white,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.neutral.white,
    },
});
