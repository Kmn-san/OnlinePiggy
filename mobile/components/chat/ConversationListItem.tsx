// components/ConversationListItem.tsx
import { View, Text, TouchableOpacity, Image } from "react-native";

export interface ConversationItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;    // Optional for group items
  isGroup?: boolean;   // Flag to identify groups
  members?: number;    // Optional member count display
  lastChat: string;
}

interface ConversationListItemProps {
  item: ConversationItem;
  onPress: () => void;
}

export default function ConversationListItem({ item, onPress }: ConversationListItemProps) {
  return (
    <TouchableOpacity 
      className="flex-row items-center p-4 bg-white border-b border-gray-100"
      onPress={onPress}
    >
      <View className="relative">
        <Image source={{ uri: item.avatar }} className="w-14 h-14 rounded-full" />
        
        {/* Render Group Member Counter Bubble */}
        {item.isGroup && item.members !== undefined && (
          <View className="absolute bottom-0 right-0 bg-purple-600 rounded-full px-1.5 py-0.5 border border-white">
            <Text className="text-white text-[10px] font-bold">{item.members}</Text>
          </View>
        )}

        {/* Render Direct Message Online Ring Dot */}
        {!item.isGroup && item.online && (
          <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
        )}
      </View>
      <View className="flex-1 ml-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-base font-semibold text-gray-800">{item.name}</Text>
          <Text className="text-xs text-gray-400">{item.time}</Text>
        </View>
        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-sm text-gray-500 flex-1 mr-2" numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View className="bg-purple-600 rounded-full px-2 py-0.5">
              <Text className="text-white text-xs font-semibold">{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}