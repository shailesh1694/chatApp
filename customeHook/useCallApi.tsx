import React, { useEffect, useState } from 'react'
import axios from "axios";
import { toastMessage } from '../widgets/toastMessage';

const useCallApi = (url?: string) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<any>()
    const [data, setData] = useState<any>()

    useEffect(() => {
        if (!url) return;
        fetchData(url, "get")
    }, [url])



    const fetchData = async (url?: string, method?: string, payload?: any) => {
        setIsLoading(true)
        setIsError(null)
        try {
            const result = await axios({ url, data: payload, method, withCredentials: true })
            setData(result.data);
        } catch (error: any) {
            toastMessage(error.response.data.msg, 'error')
            setIsError(error.response.data)
        } finally {
            setIsLoading(false)
        }
        return { data, isError }
    }

    return { isLoading,data, fetchData }
}

export default useCallApi