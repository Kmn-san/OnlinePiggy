import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
    ActivityIndicator
} from 'react-native'
import React, { useState, useLayoutEffect } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useLanguage } from '../../context/languageContext'
import i18n from '../../lib/i18n'
import GradientHeader from '@/components/GradientHeader'
import useFriend from '@/hooks/useFriend'
import { getFirstLetter } from '@/constants/getFirsrtLetter'

interface Friend {
    id: string
    username: string
    opid: string
    avatar_url: string
    online?: boolean
    lastActive?: string
}

export default function FriendList() {
    const { language } = useLanguage()
    const navigation = useNavigation()
    const router = useRouter()
    i18n.locale = language

    const [searchQuery, setSearchQuery] = useState('')

    // Destructure with default empty arrays & optional isLoading flag
    const { friends = [], friendRequests = [], isLoadingFriends } = useFriend()
    console.log(friends);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: i18n.t('friendList.title'),
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="ml-2 flex-row items-center"
                >
                    <Ionicons name="arrow-back" size={24} color="#8B5CF6" />
                    <Text className="text-purple-500 ml-1 font-semibold">
                        {i18n.t('common.back')}
                    </Text>
                </TouchableOpacity>
            ),
        })
    }, [navigation, language])

    // Filtering & grouping by English initial letters
    const getFilteredFriends = (): [string, Friend[]][] => {
        const safeFriends = Array.isArray(friends) ? friends : []
        let filtered = [...safeFriends]

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim()
            filtered = filtered.filter(friend =>
                (friend.username || '').toLowerCase().includes(query) ||
                (friend.opid || '').toLowerCase().includes(query)
            )
        }

        filtered.sort((a, b) => (a.username || '').localeCompare(b.username || ''))

        const grouped: Record<string, Friend[]> = {}
        filtered.forEach(friend => {
            const firstLetter = getFirstLetter(friend.username)
            if (!grouped[firstLetter]) {
                grouped[firstLetter] = []
            }
            grouped[firstLetter].push(friend)
        })

        // Sort section headers: A-Z first, '#' at the end
        const sortedEntries = Object.entries(grouped).sort(([keyA], [keyB]) => {
            if (keyA === '#') return 1
            if (keyB === '#') return -1
            return keyA.localeCompare(keyB)
        })

        return sortedEntries
    }

    const handleViewAllRequests = () => {
        router.push('/friend/friend-request')
    }

    const groupedFriendsEntries = getFilteredFriends()
    const allFriends = groupedFriendsEntries.flatMap(([, list]) => list)
    const requestCount = friendRequests?.length || 0

    const renderFriendItem = ({ item }: { item: Friend }) => {
        const avatarUrl = item.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.username || 'User')}&background=8B5CF6&color=fff`

        return (
            <TouchableOpacity
                className="flex-row items-center p-4 bg-white border-b border-gray-100"
                onPress={() => router.push({
                    pathname: "/chat/[id]",
                    params: { id: item.opid },
                })}
            >
                <View className="relative">
                    <Image
                        source={{ uri: avatarUrl }}
                        className="w-14 h-14 rounded-full"
                    />
                    {item.online && (
                        <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                    )}
                </View>

                <View className="flex-1 ml-3">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-base font-semibold text-gray-800">
                            {item.username || 'Unknown'}
                        </Text>
                        <Text className="text-xs text-gray-400">
                            {item.online ? 'Online' : 'Offline'}
                        </Text>
                    </View>
                    <View className="flex-row items-center justify-between mt-1">
                        <Text className="text-sm text-gray-500">
                            OPID: {item.opid || 'N/A'}
                        </Text>
                        {!item.online && item.lastActive && (
                            <Text className="text-xs text-gray-400">
                                {item.lastActive}
                            </Text>
                        )}
                    </View>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
        )
    }

    const renderSection = ({ item }: { item: [string, Friend[]] }) => {
        const [letter, sectionFriends] = item
        return (
            <View key={letter}>
                <View className="bg-gray-100 px-4 py-2">
                    <Text className="text-sm font-bold text-gray-500">{letter}</Text>
                </View>
                <FlatList
                    data={sectionFriends}
                    keyExtractor={(friend) => friend.id}
                    renderItem={renderFriendItem}
                    scrollEnabled={false}
                />
            </View>
        )
    }

    const renderEmptyState = () => (
        <View className="flex-1 items-center justify-center p-8">
            <Ionicons name="people-outline" size={80} color="#D1D5DB" />
            <Text className="text-xl font-semibold text-gray-400 mt-4">
                No Friends Found
            </Text>
            <Text className="text-gray-400 text-center mt-2">
                {searchQuery.trim()
                    ? 'Try searching with a different name or OPID'
                    : 'Add friends to see them here'}
            </Text>
            {searchQuery.trim() && (
                <TouchableOpacity
                    className="mt-4 bg-purple-500 rounded-full px-6 py-2"
                    onPress={() => setSearchQuery('')}
                >
                    <Text className="text-white font-semibold">Clear Search</Text>
                </TouchableOpacity>
            )}
        </View>
    )

    if (isLoadingFriends) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
        )
    }

    return (
        <View className="flex-1 bg-white">
            <GradientHeader
                colors={["#6D28D9", "#4F46E5"]}
                title={"Friends"}
                showBackButton={true}
                onBackPress={() => router.back()}
            />

            {/* Search Bar */}
            <View className="px-4 py-3 bg-white border-b border-gray-200">
                <View className="flex-row items-center bg-gray-100 rounded-xl px-4">
                    <Ionicons name="search-outline" size={20} color="#9CA3AF" />
                    <TextInput
                        className="flex-1 py-3 px-2 text-gray-800"
                        placeholder="Search by name or OPID..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Show friend request if exist */}
            {requestCount > 0 && (
                <TouchableOpacity
                    className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200"
                    onPress={handleViewAllRequests}
                >
                    <View className="flex-row items-center">
                        <View className="bg-purple-100 rounded-full p-2 mr-3">
                            <Ionicons name="person-add" size={20} color="#8B5CF6" />
                        </View>
                        <View>
                            <Text className="text-base font-semibold text-gray-800">
                                New Friend Requests
                            </Text>
                            <Text className="text-xs text-gray-500">
                                {requestCount} pending request{requestCount > 1 ? 's' : ''}
                            </Text>
                        </View>
                    </View>
                    <View className="flex-row items-center">
                        <View className="bg-purple-500 rounded-full px-3 py-1 mr-2">
                            <Text className="text-white text-xs font-semibold">
                                {requestCount}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </View>
                </TouchableOpacity>
            )}

            {/* Friend Count Header */}
            <View className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <Text className="text-sm text-gray-500">
                    {allFriends.length} {allFriends.length === 1 ? 'friend' : 'friends'}
                </Text>
            </View>

            {/* Friend List */}
            {allFriends.length > 0 ? (
                <FlatList
                    data={groupedFriendsEntries}
                    keyExtractor={(item) => item[0]}
                    renderItem={renderSection}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            ) : (
                renderEmptyState()
            )}
        </View>
    )
}