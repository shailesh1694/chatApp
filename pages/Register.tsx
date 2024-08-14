import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { postRegisterUser } from '../reducer/chatReducer';
import Loader from '../widgets/Loader';
import { toastMessage } from '../widgets/toastMessage';

type InputRegisterType = {
    email: string;
    password: number;
    fullname: string;
    username: string;
    avatar: File[],
    coverImage?: File[] | string
}


const Register = () => {

    const { register, formState: { errors }, reset, watch, handleSubmit } = useForm<InputRegisterType>()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { isLoading } = useAppSelector(state => state.chat)
    const onSubmitFrom = async (data: InputRegisterType) => {
        dispatch(postRegisterUser({
            username: data.username,
            email: data.email,
            fullname: data.fullname,
            password: data.password,
            avatar: data.avatar[0],
            coverImage: data.coverImage?.[0] || ""
        })).then((res) => {
            if (res.type === "chat/postRegisterUser/fulfilled") {
                toastMessage(res.payload.msg, "success")
                navigate("/login")
            } else {
                toastMessage(res.payload.msg, "error")
            }
        })

    }

    return (
        <div className='container-fluid'>
            {isLoading && <Loader />}
            <div className='row justify-content-center m-1'>
                <h3 className='text-center display-6'>Register</h3>
                <form className='col-xl-4 col-lg-6 col-md-6 col-sm-12' onSubmit={handleSubmit(onSubmitFrom)} >
                    <div className="mb-3">
                        <label htmlFor="input_username" className="form-label">User name</label>
                        <input autoComplete='off' type="text" className="form-control" id="input_username" {...register("username", { required: "username is required !" })} aria-describedby="emailHelp" />
                        {errors.username?.type && <p className='text-danger'>{errors.username.message}</p>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="input_fullname" className="form-label">Full name</label>
                        <input  type="text" className="form-control" id="input_fullname" {...register("fullname", { required: "fullname is required !" })} aria-describedby="emailHelp" />
                        {errors.fullname?.type && <p className='text-danger'>{errors.fullname.message}</p>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="input_email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="input_email" {...register("email", { required: "Email is required !", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter valid email !" } })} aria-describedby="emailHelp" />
                        {errors.email?.type && <p className='text-danger'>{errors.email.message}</p>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="input_password" className="form-label">Password</label>
                        <input type="password" className="form-control" {...register("password", { required: "Password is required !" })} id="input_password" />
                        {errors.password?.type && <p className='text-danger'>{errors.password.message}</p>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="avatar_file" className="form-label">Avatar</label>
                        <input className="form-control" {...register("avatar", { required: "avatar required !" })} type="file" id="avatar_file" />
                        {errors.avatar?.type && <p className='text-danger'>{errors.avatar.message}</p>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="coverImage_file" className="form-label">Cover Image</label>
                        <input className="form-control" {...register("coverImage", { required: false })} type="file" id="coverImage" />
                    </div>
                    <div className="mb-3">
                        <span className="label">Already an account ? </span>
                        <Link className='text-decoration-none' to="/login">
                            Login Here !
                        </Link>
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
                </form>
            </div>
        </div>
    )
}

export default Register