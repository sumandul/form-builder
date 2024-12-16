/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// import Image from '@Components/RadixComponents/Image';
import modalImage from '@Assets/images/modalImage.png';
import NewFormControl from '@Components/common/FormUI/NewFormControl';
import Icon from '@Components/common/Icon';
import SubmitButton from '@Components/common/SubmitButton';
import useAuth from '@Hooks/useAuth';
import useForm from '@Hooks/useForm';
import { signInUser } from '@Services/authentication';
import { signinFormValidation } from '@Validators/index';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import Curtain from '@Components/Curtain';
// import { useTypedSelector } from '@Store/hooks';

export default function Login() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated]);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  // const openCurtain = useTypedSelector(state => state.curtain.openCurtain);

  const { mutate, isError, isLoading, isSuccess, error } = useMutation({
    mutationFn: signInUser,
    onSuccess: (res: any) => {
      // eslint-disable-next-line no-use-before-define
      localStorage.setItem('token', res.data.token);
      // should dispatch this event to activate storage listner
      window.dispatchEvent(new Event('storage'));

      // add username to local storage if remember me is enabled
      if (values.remember_me)
        localStorage.setItem('forec-username', values.email);
      else localStorage.removeItem('forec-username');

      toast.success('Logged In Succesfully.');
    },
  });

  const storageEmail = localStorage.getItem('forec-username');

  const { register, handleSubmit, values } = useForm({
    initialValues: {
      email: storageEmail || '',
      password: '',
      // remember_me: true,
      remember_me: !!storageEmail,
    },
    validationSchema: signinFormValidation,
    postDataInterceptor: data => {
      const { email, password } = data;
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      return formData;
    },
    service: mutate,
  });

  const handleShow = () => {
    return setShowPassword(prev => !prev);
  };

  return (
    <>
      {/* {openCurtain && <Curtain />} */}
      <div className="flex h-[calc(100vh-60px)] w-full bg-blue-50 ">
        {/* <div className="banner-image h-full bg-red-300"> */}
        <img
          alt="banner"
          src={modalImage}
          className="hidden h-full w-[30%] object-fill lg:flex"
        />
        {/* </div> */}
        <div className="form flex w-full flex-col  items-center justify-center lg:w-[70%]">
          <h4
            // onClick={() => navigate('/')}
            className="font-primary text-[3rem]  text-blue-600"
          >
            ForeC
          </h4>
          <form
            onSubmit={handleSubmit}
            className="flex min-w-[31.25rem] flex-col  gap-16"
          >
            <div className="controls flex flex-col items-center justify-center gap-5">
              <NewFormControl
                controlType="input"
                label="Email address"
                className="w-full"
                {...register('email')}
              />
              <div className="relative w-full ">
                <NewFormControl
                  className="w-full"
                  controlType="input"
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                />
                <Icon
                  name={showPassword ? 'visibility' : 'visibility_off'}
                  className="absolute right-2 top-3 cursor-pointer select-none text-[#484848]"
                  onClick={() => handleShow()}
                />
              </div>
              <div className="meta flex w-full items-center justify-between  py-[0.62rem]">
                <span
                  onClick={() => navigate('/resetpassword')}
                  className="text- cursor-pointer font-bold text-primary-500 hover:underline"
                >
                  FORGOT YOUR PASSWORD?
                </span>
              </div>
            </div>
            <div className="actions">
              <SubmitButton
                isSubmitting={isLoading}
                isError={isError}
                isSuccess={isSuccess}
                // @ts-ignore
                error={error?.response?.data?.message}
              >
                SIGN IN
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
