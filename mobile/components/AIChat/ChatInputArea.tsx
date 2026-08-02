import React from 'react';
import {
    View,
    TextInput,
    Pressable,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '@/lib/i18n';

type Props = {
    input: string;
    setInput: (text: string) => void;
    onSend: () => void;
    loading: boolean;
};

export default function ChatInputArea({ input, setInput, onSend, loading }: Props) {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    borderTopWidth: 1,
                    borderTopColor: '#e5e7eb',
                    backgroundColor: '#ffffff',
                    gap: 10,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        backgroundColor: loading ? '#f3f4f6' : '#f9fafb',
                        borderRadius: 24,
                        borderWidth: 1,
                        borderColor: loading ? '#e5e7eb' : '#d1d5db',
                        paddingHorizontal: 16,
                        paddingVertical: 4,
                        minHeight: 48,
                        maxHeight: 120,
                        opacity: loading ? 0.6 : 1,
                    }}
                >
                    <TextInput
                        value={input}
                        onChangeText={setInput}
                        placeholder={
                            loading
                                ? i18n.t('aiChat.input.thinking')
                                : i18n.t('aiChat.input.placeholder')
                        }
                        placeholderTextColor="#9ca3af"
                        multiline
                        editable={!loading}
                        style={{
                            flex: 1,
                            fontSize: 16,
                            color: loading ? '#9ca3af' : '#1f2937',
                            paddingVertical: 10,
                            maxHeight: 100,
                        }}
                    />
                </View>

                <Pressable
                    onPress={onSend}
                    disabled={loading || !input.trim()}
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: loading || !input.trim() ? '#d1d5db' : '#059669',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: loading ? 0.6 : 1,
                    }}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                        <Ionicons name="send" size={22} color="#ffffff" />
                    )}
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}