// app/(tabs)/Chat.tsx
import { View, Text, ScrollView, Alert } from "react-native";
import { useState, useLayoutEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useLanguage } from "../../context/languageContext";
import i18n from "../../lib/i18n";

// Custom Modular Components
import GradientHeader from "../../components/GradientHeader";
import ConversationListItem, { ConversationItem } from "@/components/chat/ConversationListItem";
import ActionSelectorModal from "@/components/chat/ActionSelectorModal";

export default function Chat() {
  const { language } = useLanguage();
  const navigation = useNavigation();
  i18n.locale = language;

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Consolidated Single Roster Stream for Chat Feeds (DMs + Groups Combined)
  const [conversations, setConversations] = useState<ConversationItem[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=8B5CF6&color=fff',
      lastMessage: 'Hey! How are you doing?',
      time: '2 min ago',
      unread: 3,
      online: true,
      isGroup: false,
      lastChat: '2024-01-15T10:30:00'
    },
    {
      id: 'g1',
      name: 'Study Group 📚',
      avatar: 'https://ui-avatars.com/api/?name=Study+Group&background=8B5CF6&color=fff',
      lastMessage: 'Sarah: Check out these notes',
      time: '30 min ago',
      unread: 5,
      isGroup: true,
      members: 8,
      lastChat: '2024-01-15T10:00:00'
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=3B82F6&color=fff',
      lastMessage: 'See you tomorrow at 3pm',
      time: '1 hour ago',
      unread: 0,
      online: false,
      isGroup: false,
      lastChat: '2024-01-15T09:00:00'
    }
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleCreateGroup = () => {
    Alert.alert(
      "Create Group Chat",
      "Enter group name:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Create",
          onPress: () => {
            const newGroup: ConversationItem = {
              id: `g_${Date.now()}`,
              name: 'New Group 💬',
              avatar: 'https://ui-avatars.com/api/?name=New+Group&background=8B5CF6&color=fff',
              lastMessage: 'Group created',
              time: 'Just now',
              unread: 0,
              isGroup: true,
              members: 1,
              lastChat: new Date().toISOString()
            };
            setConversations([newGroup, ...conversations]);
            setModalVisible(false);
            Alert.alert("Success", "Group chat created!");
          }
        }
      ]
    );
  };

  const getFilteredConversations = () => {
    const query = searchQuery.toLowerCase().trim();
    return conversations.filter(c => c.name.toLowerCase().includes(query));
  };

  return (
    <View className="flex-1 bg-gray-50">
      <GradientHeader
        colors={['#6D28D9', '#4F46E5']}
        title={i18n.t("tabs.chat") || "Messages"}
        showAddButton={true}
        onAddPress={() => setModalVisible(true)}
      />

      {/* Unified Messaging Feed Panel */}
      <ScrollView className="flex-1 pt-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {getFilteredConversations().length > 0 ? (
          <View>
            {getFilteredConversations().map((item) => (
              <ConversationListItem
                key={item.id}
                item={item}
                onPress={() => router.push({
                  pathname: "/chat/[id]",
                  params: { id: item.id },
                })}
              />
            ))}
          </View>
        ) : (
          <View className="items-center justify-center p-8 mt-16">
            <Ionicons name="chatbubbles-outline" size={70} color="#D1D5DB" />
            <Text className="text-lg font-semibold text-gray-400 mt-4">
              No active conversations found
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Action Popover Context Trigger Modal */}
      <ActionSelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddFriend={() => {
          setModalVisible(false);
          router.push("/friend/addFriend")
        }}
        onAddGroup={handleCreateGroup}
        onFriendList={() => {
          setModalVisible(false);
          router.push("/friend/friendList")
        }}
      />
    </View>
  );
}