import { useApi } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useAccount = () => {
    const api = useApi();
    const queryClient = useQueryClient()

    const { data: accounts, isLoading, isError, error } = useQuery({
        queryKey: ["accounts"],
        queryFn: async () => {
            const { data } = await api.get("/account/getAccounts")
            return data
        }
    })

    const createGoal = useMutation({
        mutationFn: async (formData: { goalName: string; targetAmount: string }) => api.patch('/account/goalAccounts', formData),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
    })
    return {
        accounts,
        isLoading,
        isError,
        error,
        createGoal
    }
}

export default useAccount