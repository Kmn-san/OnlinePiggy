import { useApi } from "@/lib/api"
import { useQuery } from "@tanstack/react-query";

const useAccount = () => {
    const api = useApi();

    return useQuery({
        queryKey: ["accounts"],
        queryFn: async () => {
            const { data } = await api.get("/account/getAccounts")
            return data
        }
    })
}

export default useAccount