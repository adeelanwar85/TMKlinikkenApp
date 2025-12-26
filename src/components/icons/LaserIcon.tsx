import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/src/theme/Theme';

export const LaserIcon = ({ color = 'white', size = 48 }: { color?: string; size?: number }) => {
    // Scaling factor based on default size 48
    const scale = size / 48;

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {/* The Beam (Horizontal Line entering from left) */}
            <View style={[
                styles.beam,
                { backgroundColor: color, width: 22 * scale, height: 3 * scale, top: (24 * scale) - (1.5 * scale), left: 4 * scale }
            ]} />

            {/* Central Spark Wrapper to center the burst */}
            <View style={[styles.centerWrapper, { top: 0, left: 24 * scale, width: 24 * scale, height: size }]}>

                {/* Central Dot */}
                <View style={[
                    styles.dot,
                    { backgroundColor: color, width: 8 * scale, height: 8 * scale, borderRadius: 4 * scale }
                ]} />

                {/* Rays */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
                    <View
                        key={index}
                        style={[
                            styles.ray,
                            {
                                backgroundColor: color,
                                width: 10 * scale,
                                height: 2 * scale,
                                transform: [
                                    { rotate: `${angle}deg` },
                                    { translateX: 8 * scale } // Push ray out from center
                                ]
                            }
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'flex-start', // Align beam to left
    },
    beam: {
        position: 'absolute',
        borderRadius: 2,
    },
    centerWrapper: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        position: 'absolute',
        zIndex: 10,
    },
    ray: {
        position: 'absolute',
        borderRadius: 1,
    }
});
