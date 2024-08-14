import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../widgets/Loader';
import { toastMessage } from '../widgets/toastMessage';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { postLoginUser } from '../reducer/chatReducer';
import { setUser } from '../utils/getuserdata';
import { useState } from 'react';
import { requestApiHandler } from '../utils';
import { userLogin } from '../hepler/apiCall';

type InputType = {
    username: string;
    password: number;
}

const Login = () => {
    const { register, formState: { errors }, reset, handleSubmit } = useForm<InputType>()
    const [loginLoading, setloginLoading] = useState<boolean>(false)


    const navigate = useNavigate()
    const onSubmitFrom = async (payload: InputType) => {

        await requestApiHandler(
            async () => await userLogin(payload.username, payload.password),
            setloginLoading,
            (res) => {
                if (res.success) {
                    toastMessage(res.data.message, "success");
                    navigate("/")
                }
            },
            (error) => {
                toastMessage(error.msg, "error")
            }
        )
    }

    return (<div className='container-fluid position-relative'>
        {loginLoading && <Loader />}
        <div className='row justify-content-center m-1'>
            <h3 className='text-center display-6'>Login</h3>
            <form className='col-xl-4 col-lg-6 col-md-6 col-sm-12' onSubmit={handleSubmit(onSubmitFrom)}>
                <div className="mb-3">
                    <label htmlFor="input_email" className="form-label">User name</label>
                    <input type="text" className="form-control" id="input_email" {...register("username", { required: "Username is required !" })} aria-describedby="emailHelp" />
                    {errors.username?.type && <p className='text-danger'>{errors.username.message}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="input_password" className="form-label">Password</label>
                    <input type="password" className="form-control" {...register("password", { required: "Password is required !" })} id="input_password" />
                    {errors.password?.type && <p className='text-danger'>{errors.password.message}</p>}
                </div>
                <div className="mb-3">
                    <span className="label">Have not account ? </span>
                    <Link className='text-decoration-none' to="/register">
                        Register Here !
                    </Link>
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    </div>
    )
}

export default Login