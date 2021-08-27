import { useCallback } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { closeModalsThunk, AuthForm } from '../../features'
import { Box, Headline } from "@whosaidtrue/ui";

const Login: React.FC = () => {
    const history = useHistory()
    const dispatch = useAppDispatch()
    const goHome = useCallback(() => history.push('/'), [history])

    const close = () => {
        dispatch(closeModalsThunk())
    }

    // render
    return (
        <div className="px-8 w-96  mx-12 py-10">
            <AuthForm onSuccess={goHome} endpoint="/user/login" buttonlabel="login" title="Login" />
            <div className="text-center text-basic-black mt-8">
                <Headline>Don't have an account?</Headline>
                <Link onClick={close} to="/create-account"><Headline className="underline">Create Account</Headline></Link>
            </div>
        </div>

    )
}

export default Login;