import React, { useRef, useState, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GradientHeader from '../../components/GradientHeader';
import i18n from '@/lib/i18n';
import { useAiChat } from '@/hooks/useAi';
import { Message } from '@/types';
import PrivacyNoticeModal from '@/components/AIChat/PrivacyNoticeModal';
import EmptyState from '@/components/AIChat/EmptyState';
import MessageBubble from '@/components/AIChat/MessageBubble';
import ChatInputArea from '@/components/AIChat/ChatInputArea';

const PRIVACY_STORAGE_KEY = '@ai_privacy_notice_accepted';

export default function AIChatScreen() {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

  const chatMutation = useAiChat();

  // Runs ONLY when the user actually navigates/focuses on the chat page
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const checkPrivacyStatus = async () => {
        try {
          const value = await AsyncStorage.getItem(PRIVACY_STORAGE_KEY);
          if (value !== 'true' && isActive) {
            setShowPrivacyNotice(true);
          }
        } catch (error) {
          if (isActive) setShowPrivacyNotice(true);
        }
      };

      checkPrivacyStatus();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleClosePrivacy = async () => {
    setShowPrivacyNotice(false);
    try {
      await AsyncStorage.setItem(PRIVACY_STORAGE_KEY, 'true');
    } catch (error) {
      console.error('Failed to save privacy notice status', error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({
        animated: true,
      });
    }, 100);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    const assistantId = `${Date.now()}-assistant`;
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    const userInput = input;
    setInput('');
    setLoading(true);
    scrollToBottom();

    try {
      const response = await chatMutation.mutateAsync({
        message: userInput,
      });

      const reply = response?.reply || i18n.t('aiChat.noResponse');
      let currentText = '';

      for (let i = 0; i < reply.length; i++) {
        currentText += reply[i];
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: currentText } : msg
          )
        );
        scrollToBottom();
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: i18n.t('aiChat.error') }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <PrivacyNoticeModal
        visible={showPrivacyNotice}
        onClose={handleClosePrivacy}
      />

      <GradientHeader
        colors={['#059669', '#047857']}
        title={i18n.t('aiChat.headerTitle')}
        showBackButton={false}
      />

      <View style={{ flex: 1 }}>
        {messages.length === 0 && !showPrivacyNotice && <EmptyState />}

        {messages.length > 0 && !showPrivacyNotice && (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble item={item} loading={loading} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 80 + insets.bottom,
              paddingTop: 8,
            }}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
          />
        )}

        {!showPrivacyNotice && (
          <ChatInputArea
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            loading={loading}
          />
        )}
      </View>
    </View>
  );
}