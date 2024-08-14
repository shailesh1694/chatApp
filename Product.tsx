import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './store/hook'
import { getProductData } from './reducer/chatReducer'

interface ProductDataType {
    stock: number;
    _id: string
    title: string;
    code: string;
    brand: string;
    description: string;
    price: number;
    totalrating: number;
    category: string;
    numOfReviews: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    images: string[]
}

const App = () => {

    const dispatch = useAppDispatch()
    const { productData } = useAppSelector((state) => state.test)

    useEffect(() => {
        dispatch(getProductData(null)).then((res) => {
            console.log(res, "res")
        })
    }, [])

  
    return (
        <div>
            {productData?.data?.map((item: ProductDataType, index: number) => {
                return <div key={item._id}>
                    <h1>{item.description}</h1>
                    <h1>{item.brand}</h1>
                </div>
            })}
        </div>
    )
}

export default App