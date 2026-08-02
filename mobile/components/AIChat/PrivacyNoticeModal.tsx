import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '@/lib/i18n';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function PrivacyNoticeModal({ visible, onClose }: Props) {
  const sensitiveItems = [
    i18n.t('aiChat.privacy.items.passwords'),
    i18n.t('aiChat.privacy.items.creditCards'),
    i18n.t('aiChat.privacy.items.idNumbers'),
    i18n.t('aiChat.privacy.items.bankDetails'),
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            padding: 24,
            width: '100%',
            maxWidth: 340,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: '#ecfdf5',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Ionicons name="shield-checkmark-outline" size={32} color="#059669" />
          </View>

          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            {i18n.t('aiChat.privacy.title')}
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: '#6b7280',
              textAlign: 'center',
              lineHeight: 22,
              marginBottom: 20,
            }}
          >
            {i18n.t('aiChat.privacy.subtitle')}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 20,
            }}
          >
            {sensitiveItems.map((item) => (
              <View
                key={item}
                style={{
                  backgroundColor: '#fef2f2',
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#fecaca',
                }}
              >
                <Text style={{ color: '#dc2626', fontSize: 12, fontWeight: '500' }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>

          <Text
            style={{
              fontSize: 13,
              color: '#9ca3af',
              textAlign: 'center',
              lineHeight: 20,
              marginBottom: 24,
            }}
          >
            {i18n.t('aiChat.privacy.footer')}
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: '#059669',
              borderRadius: 16,
              paddingVertical: 14,
              paddingHorizontal: 48,
              width: '100%',
            }}
            onPress={onClose}
          >
            <Text
              style={{
                color: '#ffffff',
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              {i18n.t('aiChat.privacy.button')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
} 