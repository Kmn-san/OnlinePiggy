import { useApi } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useTransactions = () => {
    const api = useApi();
    const queryClient = useQueryClient()

    const { data: transactions, isLoading, isError, error } = useQuery({
        queryKey: ["transactions"],
        queryFn: async () => {
            const { data } = await api.get("/transaction/getTransaction")
            return data
        }
    })

    const createTransaction = useMutation({
        mutationFn: async (FormData: { fromAccId: string | null, toAccountName: string, accountType: string, amount: number, note: string }) =>
            api.patch("/transaction/createTransaction", FormData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        }
    })
    return {
        transactions,
        isLoading,
        isError,
        createTransaction
    }

}

export default useTransactions