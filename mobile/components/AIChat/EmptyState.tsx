import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '@/lib/i18n';
import { AI_USER } from '@/types';

export default function EmptyState() {
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 32,
            }}
        >
            <View
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: '#ecfdf5',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                }}
            >
                <Image
                    source={{ uri: AI_USER.avatar }}
                    style={{ width: 64, height: 64, borderRadius: 32 }}
                />
            </View>
            <Text
                style={{
                    fontSize: 22,
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: 8,
                }}
            >
                {i18n.t('aiChat.empty.title')}
            </Text>
            <Text
                style={{
                    fontSize: 14,
                    color: '#6b7280',
                    textAlign: 'center',
                    lineHeight: 20,
                }}
            >
                {i18n.t('aiChat.empty.subtitle')}
            </Text>

            <View
                style={{
                    marginTop: 24,
                    backgroundColor: '#fef2f2',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#fecaca',
                }}
            >
                <Ionicons name="information-circle" size={18} color="#dc2626" />
                <Text
                    style={{
                        fontSize: 12,
                        color: '#dc2626',
                        marginLeft: 8,
                        flex: 1,
                    }}
                >
                    {i18n.t('aiChat.empty.banner')}
                </Text>
            </View>
        </View>
    );
}