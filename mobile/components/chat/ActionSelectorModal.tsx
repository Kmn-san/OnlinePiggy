// components/ActionSelectorModal.tsx
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ActionSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onAddFriend: () => void;
  onAddGroup: () => void;
  onFriendList: () => void;
}

export default function ActionSelectorModal({
  visible,
  onClose,
  onAddFriend,
  onAddGroup,
  onFriendList,
}: ActionSelectorModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-3xl h-[42%] shadow-2xl">
          
          {/* Header Controls */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
            <Text className="text-lg font-bold text-gray-800">Create & Connect</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-2">
            {/* Action Row 1: Add New Friend */}
            <TouchableOpacity 
              className="flex-row items-center p-4 m-2 bg-purple-50 rounded-xl border border-purple-100"
              onPress={onAddFriend}
            >
              <View className="bg-purple-600 rounded-full p-2.5">
                <Ionicons name="person-add" size={20} color="white" />
              </View>
              <View className="ml-4">
                <Text className="text-sm font-bold text-gray-800">Add Friend</Text>
                <Text className="text-xs text-gray-500">Search profiles using application tags</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" className="ml-auto" />
            </TouchableOpacity>

            {/* Action Row 2: Add Group */}
            <TouchableOpacity 
              className="flex-row items-center p-4 m-2 bg-indigo-50 rounded-xl border border-indigo-100"
              onPress={onAddGroup}
            >
              <View className="bg-indigo-600 rounded-full p-2.5">
                <Ionicons name="people" size={20} color="white" />
              </View>
              <View className="ml-4">
                <Text className="text-sm font-bold text-gray-800">Add Group</Text>
                <Text className="text-xs text-gray-500">Form clean multi-user chat structures</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" className="ml-auto" />
            </TouchableOpacity>

            {/* Action Row 3: Friend List */}
            <TouchableOpacity 
              className="flex-row items-center p-4 m-2 bg-emerald-50 rounded-xl border border-emerald-100"
              onPress={onFriendList}
            >
              <View className="bg-emerald-600 rounded-full p-2.5">
                <Ionicons name="list" size={20} color="white" />
              </View>
              <View className="ml-4">
                <Text className="text-sm font-bold text-gray-800">Friend List</Text>
                <Text className="text-xs text-gray-500">View and converse with existing friends</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" className="ml-auto" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}