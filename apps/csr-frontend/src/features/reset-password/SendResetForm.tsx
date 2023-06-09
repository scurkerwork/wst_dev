import { useFormik } from "formik";
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from "../../app/hooks";
import { api } from '../../api';
import { setEmail } from './resetPasswordSlice';
import {
    FormGroup,
    Button,
    Title1,
    BodySmall,
    InputLabel,
    Form,
    TextInput,
    ErrorText
} from "@whosaidtrue/ui";
import { showError } from '../modal/modalSlice';

/**
 * Make a request to send a code via email.
 */
const SendResetForm: React.FC = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
            email: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Email is invalid').required('Email is required')
        }),
        onSubmit: (values) => {
            const { email } = values;

            // send request
            api.post('/user/send-reset', { email }).then(() => {
                dispatch(setEmail(email))
                history.push('/reset/enter-code')
            }).catch(e => {
                const { status, data } = e.response;
                if (status === 400) {
                    dispatch(showError('Could not find a user with that email'))
                } else if (status === 403 && data === 'Reset limit reached') { // if user has sent 3 code requests in the last 24 hours
                    dispatch(showError('Daily reset attempt limit reached. You can try again in 24 hours.'))
                } else {
                    dispatch(showError('Oops, something went wrong. Please try again later'))
                }
            })
        }
    })

    const emailErr = formik.touched.email && formik.errors.email ? true : false;
    return (
        <Form className="bg-white-ish rounded-3xl w-max mx-auto filter drop-shadow-card px-8 py-6" onSubmit={formik.handleSubmit}>
            <div>
                <Title1>Reset Password</Title1>
                <BodySmall>Please enter your email</BodySmall>
            </div>

            <FormGroup>
                <InputLabel htmlFor='email'>Email</InputLabel>
                <TextInput className="mb-3" $border $hasError={emailErr} type="email" id="email" {...formik.getFieldProps('email')} />
                {emailErr && <ErrorText className="block">{formik.errors.email}</ErrorText>}
            </FormGroup>

            <Button data-cy="submit-send-reset" type="submit">Send Reset Email</Button>
        </Form>
    )
}

export default SendResetForm