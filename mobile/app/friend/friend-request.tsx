// app/friend-requests.tsx
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native'
import React, { useState, useLayoutEffect } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import GradientHeader from '@/components/GradientHeader'
import { useLanguage } from '@/context/languageContext'
import i18n from '@/lib/i18n'
import useFriend from '@/hooks/useFriend'

interface FriendRequest {
    id: string
    username: string
    opid: string
    avatar_url: string
    mutualFriends: number
    created_at: string
}

export default function FriendRequests() {
    const { language } = useLanguage()
    const navigation = useNavigation()
    const router = useRouter()
    i18n.locale = language
    const { friendRequests, responseRequest } = useFriend()

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Friend Requests',
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

    const formatDate = (isoString: string): string => {
        const date = new Date(isoString)
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    }
    const handleAcceptRequest = (requestId: string) => {
        const request = friendRequests.find(r => r.id === requestId);

        if (request) {
            Alert.alert(
                "Accept Request",
                `Accept friend request from ${request.username}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Accept',
                        onPress: () => {
                            responseRequest.mutate(
                                { requestId: request.id, respondRequest: 'accepted' },
                                {
                                    onSuccess: () => {
                                        Alert.alert('Success', `${request.username} is now your friend!`)
                                    }
                                }
                            )
                        }
                    }
                ]
            );
        }
    };

    const handleRejectRequest = (requestId: string) => {
        const request = friendRequests.find(r => r.id === requestId);
        Alert.alert(
            "Reject Request",
            `Reject friend request from ${request?.username}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reject',
                    style: 'destructive',
                    onPress: () => {
                        responseRequest.mutate(
                            { requestId: requestId, respondRequest: 'rejected' },
                            {
                                onSuccess: () => {
                                    Alert.alert('Request Rejected', 'You have rejected this friend request.')
                                }
                            }
                        )
                    }
                }
            ]
        );
    };

    const renderFriendRequestItem = ({ item }: { item: FriendRequest }) => (
        <View className="flex-row items-center p-4 bg-white border-b border-gray-100">
            <Image
                source={{ uri: item.avatar_url }}
                className="w-14 h-14 rounded-full"
            />

            <View className="flex-1 ml-3">
                <Text className="text-base font-semibold text-gray-800">
                    {item.username}
                </Text>
                <View className="flex-row items-center mt-1">
                    <Text className="text-xs text-gray-400">
                        OPID: {item.opid}
                    </Text>
                </View>
                <Text className="text-xs text-gray-400 mt-0.5">
                    Sent {formatDate(item.created_at)}
                </Text>
            </View>

            <View className="flex-row">
                <TouchableOpacity
                    className="bg-green-500 rounded-full p-2 mr-2"
                    onPress={() => handleAcceptRequest(item.id)}
                >
                    <Ionicons name="checkmark" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-red-500 rounded-full p-2"
                    onPress={() => handleRejectRequest(item.id)}
                >
                    <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderEmptyState = () => (
        <View className="flex-1 items-center justify-center p-8">
            <Ionicons name="checkmark-circle-outline" size={80} color="#D1D5DB" />
            <Text className="text-xl font-semibold text-gray-400 mt-4">
                No Friend Requests
            </Text>
            <Text className="text-gray-400 text-center mt-2">
                You're all caught up! No pending friend requests.
            </Text>
            <TouchableOpacity
                className="mt-4 bg-purple-500 rounded-full px-6 py-2"
                onPress={() => router.back()}
            >
                <Text className="text-white font-semibold">Go Back</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <View className="flex-1 bg-white">
            <GradientHeader
                colors={["#6D28D9", "#4F46E5"]}
                title={"Friend Requests"}
                showBackButton={true}
                onBackPress={() => router.back()}
            />

            {/* Request Count */}
            <View className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <Text className="text-sm text-gray-500">
                    {friendRequests.length} {friendRequests.length === 1 ? 'request' : 'requests'}
                </Text>
            </View>

            {/* Request List */}
            {friendRequests.length > 0 ? (
                <FlatList
                    data={friendRequests}
                    renderItem={renderFriendRequestItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            ) : (
                renderEmptyState()
            )}
        </View>
    )
}