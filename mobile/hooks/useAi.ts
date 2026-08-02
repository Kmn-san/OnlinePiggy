import { useApi } from "@/lib/api"
import { useMutation } from "@tanstack/react-query";

export const useAiChat = () => {
    const api = useApi();

    return useMutation({
        mutationFn: async (message: any) => {
            const { data } = await api.post("/ai/chat", message)
            return data
        }
    })

}