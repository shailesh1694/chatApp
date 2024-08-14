import React, { ReactNode, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { getUser } from '../utils/getuserdata'
import { useAppDispatch } from '../store/hook'
import { getAuthToken } from '../reducer/chatReducer'

const PublicRoutes: React.FC<{ children: ReactNode }> = ({ children }) => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getAuthToken(null)).then((res) => {
            if (res.payload.success) {
                navigate("/")
            }
        })
    }, [])

    return children

}

export default PublicRoutes