import { useApi } from "../lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { User } from "../types"
import { Alert } from "react-native"
import i18n from "@/lib/i18n"

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

    const updateAvatar = useMutation({
        mutationFn: (formData: FormData) => api.patch('/user/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
    });

    const updateCurrency = useMutation({
        mutationFn: async (body: Partial<User>) => {
            const { data } = await api.patch("/user/currency", body)
            return data
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["me"] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });

            return data
        }
    })

    const useUpdateUser = useMutation({
        mutationFn: async (body: Partial<User>) => {
            const { data } = await api.patch("/user/me", body)
            return data
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["me"] });

            const code = data?.code;
            const successHandlers: Record<string, () => void> = {
                UPDATE_SUCCESS: () =>
                    Alert.alert(i18n.t("common.success"), i18n.t("success.profileUpdated")),
            };

            if (code && successHandlers[code]) {
                successHandlers[code]();
            }
        },
        onError: (error: any) => {
            const code = error.response?.data?.code;
            const responseData = error.response?.data;

            const errorHandlers: Record<string, () => void> = {
                INTERNAL_SERVER_ERROR: () =>
                    Alert.alert(i18n.t("common.error"), i18n.t("errorDetial.INTERNAL_SERVER_ERROR")),

                OPID_CHANGE_COOLDOWN: () =>
                    Alert.alert(i18n.t("error.cooldown"), i18n.t("errorDetial.OPID_CHANGE_COOLDOWN", { days: responseData?.daysRemaining })),

                USER_NOT_FOUND: () =>
                    Alert.alert(i18n.t("error.notFound"), i18n.t("errorDetial.USER_NOT_FOUND")),

                NO_DATA_PROVIDED: () =>
                    Alert.alert(i18n.t("error.noDataGiven"), i18n.t("errorDetial.NO_DATA_PROVIDED")),

                OPID_ALREADY_EXISTS: () =>
                    Alert.alert(i18n.t("error.opidExists"), i18n.t("errorDetial.OPID_ALREADY_EXISTS")),

                NO_VALID_FIELDS: () =>
                    Alert.alert(i18n.t("error.noValidFields"), i18n.t("errorDetial.NO_VALID_FIELDS")),

                NO_FILE_UPLOAD: () =>
                    Alert.alert(i18n.t("error.noFileUpload"), i18n.t("errorDetial.NO_FILE_UPLOAD")),
            };
            if (code && errorHandlers[code]) {
                errorHandlers[code]();
            } else {
                Alert.alert(i18n.t("common.error"), i18n.t("errorDetail.UNKNOWN_ERROR"));
            }
        }
    })

    return {
        user,
        isLoading,
        isError,
        error,
        updateCurrency,
        updateUser: useUpdateUser,
        updateAvatar
    };
}
export default useCurrentUser
