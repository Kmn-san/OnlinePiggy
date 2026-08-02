import React from 'react';
import { View, Text, Image } from 'react-native';
import i18n from '@/lib/i18n';
import { Message, AI_USER } from '@/types';

type Props = {
    item: Message;
    loading: boolean;
};

export default function MessageBubble({ item, loading }: Props) {
    const isUser = item.role === 'user';

    return (
        <View
            style={{
                paddingHorizontal: 16,
                marginTop: 14,
                alignItems: isUser ? 'flex-end' : 'flex-start',
            }}
        >
            {!isUser && (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 6,
                        marginLeft: 4,
                    }}
                >
                    <Image
                        source={{ uri: AI_USER.avatar }}
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: 17,
                            marginRight: 8,
                            borderWidth: 2,
                            borderColor: '#059669',
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#059669',
                        }}
                    >
                        {i18n.t('aiChat.headerTitle')}
                    </Text>
                    <View
                        style={{
                            marginLeft: 8,
                            backgroundColor: '#059669',
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 8, fontWeight: '700' }}>
                            {i18n.t('aiChat.aiLabel')}
                        </Text>
                    </View>
                </View>
            )}

            <View
                style={{
                    backgroundColor: isUser ? '#059669' : '#ffffff',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 20,
                    borderTopRightRadius: isUser ? 4 : 20,
                    borderTopLeftRadius: isUser ? 20 : 4,
                    maxWidth: '82%',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                    borderWidth: isUser ? 0 : 1,
                    borderColor: isUser ? 'transparent' : '#e5e7eb',
                }}
            >
                <Text
                    style={{
                        color: isUser ? '#fff' : '#1f2937',
                        fontSize: 16,
                        lineHeight: 24,
                    }}
                >
                    {item.content || (item.role === 'assistant' && loading && '...')}
                </Text>
            </View>
        </View>
    );
}