import React, { ReactNode, useEffect } from 'react'
import { getUser } from '../utils/getuserdata';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { getAuthToken } from '../reducer/chatReducer';
import { useNavigate } from 'react-router-dom';


const PrivateRoutes: React.FC<{ children: ReactNode }> = ({ children }): any => {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { authToken } = useAppSelector((state) => state.chat)

  useEffect(() => {
    // if (!authToken?.data) {
    dispatch(getAuthToken(null)).then((res) => {
      if (!res.payload.success) {
        navigate("/login")
      }
    })
    // }
  }, [])

  return children
}

export default PrivateRoutes