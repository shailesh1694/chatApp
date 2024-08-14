import { AxiosResponse } from "axios";
import { ApiSuccessResponse } from "../interface/response";

export const requestApiHandler = async (
    api: () => Promise<AxiosResponse<ApiSuccessResponse, any>>,
    setLoading: ((loading: boolean) => void) | null,
    onSuccess: (data: ApiSuccessResponse) => void,
    onError: (error: { msg: string, success: boolean }) => void
) => {
    setLoading && setLoading(true)
    try {
        const response = await api();
        const { data } = response;
        if (data?.success) {
            onSuccess(data)
        }
    } catch (error: any) {
        onError(error?.response?.data)
    } finally {
        setLoading && setLoading(false)
    }
}