import { useApi } from "../lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { User } from "../types"

const useCurrentUser = (options?: { enabled?: boolean }) => {
    const api = useApi()
    const queryClient = useQueryClient()

    const { data: user, isLoading, isError, error } = useQuery({
        queryKey: ["me"],
        queryFn: async () => {
            const { data } = await api.get<User>("/user/me")
            return data
        },
        enabled: options?.enabled ?? true// Default to true if not specified
    })

    const useUpdateUser = useMutation({
        mutationFn: async (body: Partial<User>) => {
            const { data } = await api.patch("/user/me", body)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["me"]
            })
        }
    })

    return {
        user,
        isLoading,
        isError,
        error,
        updateUser: useUpdateUser,
    };
}
export default useCurrentUser
