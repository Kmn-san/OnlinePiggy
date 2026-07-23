import { useApi } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useFriend = () => {
    const api = useApi()
    const queryClient = useQueryClient()

    const { data: friends,
        isLoading: isLoadingFriends,
        isError: isFriendsError } = useQuery({
            queryKey: ["friend"],
            queryFn: async () => {
                const { data } = await api.get("/friend/friends")
                return data
            }
        })

    const {
        data: friendRequests,
        isLoading: isLoadingRequests,
        isError: isRequestsError
    } = useQuery({
        queryKey: ["friendRequests"],
        queryFn: async () => {
            const { data } = await api.get("/friend/all-requests");
            return data;
        }
    });

    const searchUser = useMutation({
        mutationFn: async (opid: string) => {
            const { data } = await api.patch(`/friend/findFriend/${opid}`)
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["friend"] }),
    })

    const sendRequest = useMutation({
        mutationFn: async (friendId: string) => {
            const { data } = await api.post('/friend/requests', { friendId })
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["friend"] }),
    })

    const responseRequest = useMutation({
        mutationFn: async ({ requestId, respondRequest }: { requestId: string; respondRequest: 'accepted' | 'rejected' | string }) => {
            const { data } = await api.patch(`/friend/requests/${requestId}`, { respondRequest })
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["friend"] })
            queryClient.invalidateQueries({ queryKey: ["friendRequests"] })
        },
    })

    return {
        friends,
        searchUser,
        sendRequest,
        isLoadingFriends,
        isFriendsError,
        friendRequests,
        isLoadingRequests,
        isRequestsError,
        responseRequest
    }

}

export default useFriend;