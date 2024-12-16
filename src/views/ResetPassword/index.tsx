/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// import Image from '@Components/RadixComponents/Image';
import modalImage from '@Assets/images/modalImage.png';
import NewFormControl from '@Components/common/FormUI/NewFormControl';
import SubmitButton from '@Components/common/SubmitButton';
import useForm from '@Hooks/useForm';
import { userForgetPassword } from '@Services/authentication';
import { resetPasswordFormValidation } from '@Validators/index';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { convertJsonToFormData } from '@Utils/index';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { mutate, isError, isLoading, isSuccess, error } = useMutation({
    mutationKey: ['post-reset-password'],
    mutationFn: userForgetPassword,
    onSuccess: (res: any) => {
      toast.success(res?.data?.message);
      // setTimeout(() => {
      navigate('/signin');
      // }, 200);
    },
  });

  const { register, handleSubmit } = useForm({
    initialValues: { email: '' },
    validationSchema: resetPasswordFormValidation,
    postDataInterceptor: vals => {
      return convertJsonToFormData(vals);
    },
    service: mutate,
  });
  return (
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
          className="mb-10 font-primary  text-[3rem] text-[#14428B]"
        >
          ForeC
        </h4>
        <form
          onSubmit={handleSubmit}
          className="flex min-w-[31.25rem] flex-col  gap-16"
        >
          <div className="controls flex flex-col items-center justify-center gap-5">
            <div className="description-of-form flex flex-col gap-3">
              <h4>Forget Your Password?</h4>
              <span className="text-body-md">
                Enter your Email address associated with account and we will
                send you a link to reset your account
              </span>
            </div>
            <NewFormControl
              controlType="input"
              label="Email address"
              className="w-full"
              {...register('email')}
            />
            <span
              onClick={() => navigate('/signin')}
              className="w-full cursor-pointer text-left text-[#14428B] hover:underline"
            >
              Sign In
            </span>
          </div>
          <div className="actions">
            <SubmitButton
              isSubmitting={isLoading}
              isError={isError}
              isSuccess={isSuccess}
              // @ts-ignore
              error={error?.response.data.message}
            >
              SUBMIT
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
