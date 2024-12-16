import { Button } from '@Components/RadixComponents/Button';
import NewFormControl from '@Components/common/FormUI/NewFormControl';
import SubmitButton from '@Components/common/SubmitButton';
import useForm from '@Hooks/useForm';
import { postEmailChannelUser } from '@Services/adminDashboard';
import { emailUserValidation } from '@Validators/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const AddEmailUser = ({ onClose }: any) => {
  const queryClient = useQueryClient();
  const {
    mutate: postEmailUser,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useMutation({
    mutationKey: ['post-email'],
    mutationFn: postEmailChannelUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-email-get'] });

      toast.success('User added Successfully.');
      onClose();
    },
  });
  const { register, handleSubmit } = useForm({
    initialValues: {},
    validationSchema: emailUserValidation,
    postDataInterceptor: data => {
      const { email, username } = data;
      return { username, email };
    },

    service: postEmailUser,
  });

  return (
    // <div className="absolute left-[calc(50%--15rem)] top-[18rem] h-[18rem] max-h-[90vh] w-[25rem] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white">
    <div
      className="absolute left-[60%] top-[45%] h-[18rem] max-h-[90vh] w-[25rem] 
    -translate-x-1/2 -translate-y-1/2 
    rounded-lg bg-white"
    >
      <div className="body flex h-full flex-col">
        <form
          onSubmit={handleSubmit}
          className="controls flex h-full min-h-[9.5rem] flex-col justify-between gap-y-8 p-6 "
        >
          <div
            className="controls scrollbar flex max-h-[60vh] min-h-[11rem] flex-col space-y-4 overflow-y-auto"
            style={{ scrollbarGutter: 'stable' }}
          >
            <NewFormControl
              label="Username"
              placeholder="Username"
              controlType="input"
              requiredControl
              {...register('username')}
            />
            <NewFormControl
              label="Email"
              placeholder="Email"
              controlType="input"
              requiredControl
              {...register('email')}
            />
          </div>
          <div className="actions mb-2 flex items-center justify-center gap-2">
            <SubmitButton
              isSubmitting={isLoading}
              isError={isError}
              isSuccess={isSuccess}
              variant="default"
              className="flex items-center justify-center gap-1  text-white disabled:!pointer-events-auto disabled:!cursor-not-allowed"
              error={
                // @ts-ignore
                error?.response?.data?.message
              }
            >
              Save
            </SubmitButton>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmailUser;
