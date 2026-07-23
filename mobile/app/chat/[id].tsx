import { View, Text, TextInput, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useLanguage } from "../../context/languageContext";
import i18n from "../../lib/i18n";
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import { useLayoutEffect, useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import GradientHeader from "@/components/GradientHeader";
import useFriend from "@/hooks/useFriend";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  isOwn: boolean;
}

export default function ChatRoom() {
  const { language } = useLanguage();
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  i18n.locale = language;
  const insets = useSafeAreaInsets();

  // Extract ID with fallback to opid
  const opid = (params.id as string) || (params.opid as string) || '';

  // Look up friend details using opid
  const { friends = [] } = useFriend();
  const friend = friends.find((f) => f.opid === opid);

  // User details fallbacks
  const username = friend?.username || opid || 'User';
  const avatar = friend?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=8B5CF6&color=fff`;
  const userId = friend?.id || opid || 'user2';
  const online = friend?.online ?? false;

  // Hide native header since GradientHeader is used inside the component tree
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey! How are you doing?',
      senderId: userId,
      timestamp: '10:30 AM',
      isOwn: false
    },
    {
      id: '2',
      text: "I'm doing great! Thanks for asking 😊",
      senderId: 'user1',
      timestamp: '10:32 AM',
      isOwn: true
    },
    {
      id: '3',
      text: 'Want to meet up later?',
      senderId: userId,
      timestamp: '10:35 AM',
      isOwn: false
    },
    {
      id: '4',
      text: 'Sure! What time?',
      senderId: 'user1',
      timestamp: '10:36 AM',
      isOwn: true
    },
    {
      id: '5',
      text: 'How about 3pm at the usual place?',
      senderId: userId,
      timestamp: '10:38 AM',
      isOwn: false
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      senderId: 'user1',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Show typing indicator
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 600);

    // Simulate auto reply
    setTimeout(() => {
      setIsTyping(false);
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutoReply(),
        senderId: userId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false
      };
      setMessages((prev) => [...prev, replyMessage]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2200);
  };

  const getAutoReply = () => {
    const replies = [
      "That's great to hear! 😊",
      'I see what you mean!',
      'Let me think about that...',
      'Sure, sounds good!',
      'Thanks for sharing!',
      "That's interesting!",
      'I agree with you 👍',
      "Haha, that's funny! 😄",
      'Good point!',
      "Alright, let's do that!"
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View className={`px-4 py-2 ${item.isOwn ? 'items-end' : 'items-start'}`}>
      <View
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${item.isOwn ? 'bg-purple-500' : 'bg-gray-200'
          }`}
      >
        <Text className={`${item.isOwn ? 'text-white' : 'text-gray-800'}`}>
          {item.text}
        </Text>
        <Text className={`text-xs mt-1 ${item.isOwn ? 'text-purple-200' : 'text-gray-500'}`}>
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  const renderTypingIndicator = () => (
    <View className="px-4 py-2 items-start">
      <View className="bg-gray-200 rounded-2xl px-4 py-3 max-w-[80%]">
        <View className="flex-row space-x-1">
          <View className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
          <View className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <View className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Custom Gradient Header */}
      <GradientHeader
        colors={["#6D28D9", "#4F46E5"]}
        title={username}
        showBackButton={true}
        onBackPress={() => router.back()}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          ListFooterComponent={isTyping ? renderTypingIndicator : null}
        />

        {/* Input Area */}
        <View
          className="border-t border-gray-200 px-4 pt-2 bg-white"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-2">
              <Ionicons name="add-circle-outline" size={32} color="#6D28D9" />
            </TouchableOpacity>

            <TextInput
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-800 max-h-24"
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />

            <TouchableOpacity
              className={`ml-2 rounded-full p-2 ${inputText.trim() ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <Ionicons
                name="send"
                size={24}
                color={inputText.trim() ? 'white' : '#9CA3AF'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}