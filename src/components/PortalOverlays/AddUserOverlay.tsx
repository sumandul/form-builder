/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { IDropDownData } from '@Components/RadixComponents/Dropdown';
import NewFormControl from '@Components/common/FormUI/NewFormControl';
import Icon from '@Components/common/Icon';
import SubmitButton from '@Components/common/SubmitButton';
import useForm from '@Hooks/useForm';
import { scrollToComponent } from '@Hooks/useForm/useFormUtils';
import {
  fetUserRoles,
  getUserDetail,
  patchUserDetail,
  postUserDetails,
} from '@Services/adminDashboard';
import { addUserFormValidation } from '@Validators/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function AddUserOverlay({
  onCancel,
  id,
}: {
  onCancel: () => void;
  id: string | null;
}) {
  const queryClient = useQueryClient();

  // get user details if there is id
  const { data: userDetail } = useQuery({
    queryKey: ['get-user-data', id],
    queryFn: () => getUserDetail(id),
    enabled: !!id,
    select: response => {
      const { thumbnail, email, username, role_type, designation } =
        response.data;
      return {
        image: [{ id: 0, name: 'User Profile', document: thumbnail }],
        email,
        username,
        role_type,
        designation,
      };
    },
  });

  const { mutate, error, isLoading, isSuccess, isError } = useMutation({
    mutationKey: ['post-user-data'],
    mutationFn: postUserDetails,
    onSuccess: () => {
      clearAndInitialiseForm();
      queryClient.invalidateQueries({ queryKey: ['user-data-list'] });

      toast.success('User added Successfully.');
      onCancel();
    },
  });

  const {
    mutate: patchUser,
    error: patchError,
    isLoading: patchLoading,
    isSuccess: patchIsSuccess,
    isError: patchIsError,
  } = useMutation({
    mutationKey: ['patch-user-data'],
    mutationFn: patchUserDetail,
    onSuccess: () => {
      clearAndInitialiseForm();
      queryClient.invalidateQueries({ queryKey: ['user-data-list'] });
      toast.success('User updated Successfully.');
      onCancel();
    },
  });
  const { handleSubmit, register, clearAndInitialiseForm, setBindValues } =
    useForm({
      initialValues: {},
      validationSchema: addUserFormValidation,
      postDataInterceptor: data => {
        const { email, username, designation, role_type, image } = data;
        const formData = new FormData();
        formData.append('email', email);
        formData.append('username', username);
        formData.append('designation', designation);
        formData.append('role_type', role_type);
        if (image[0].fileObject) formData.append('image', image[0].fileObject);
        return { formData, id };
      },
      service: id ? patchUser : mutate,
    });

  useEffect(() => {
    if (id && userDetail) setBindValues(userDetail);
  }, [userDetail]);

  const { data: userRoles } = useQuery({
    queryKey: ['user-roles'],
    queryFn: fetUserRoles,
    select: response => {
      const newResponse: IDropDownData[] = response.data?.map(
        (role: string, index: number) => ({
          label: role,
          value: role,
          code: index,
          id: index,
        }),
      );
      return newResponse;
    },
  });
  return (
    <div className="absolute left-1/2 top-1/2 h-[45.5rem] max-h-[90vh] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white ">
      <div className="body flex h-full flex-col ">
        <div className="head flex w-full items-center justify-center gap-2 p-6">
          <div className="content flex w-full flex-col gap-2">
            <h4>{id ? 'Edit User' : 'Add User'}</h4>
            <p className="text-body-md">
              Please fill up the details to {id ? 'update' : 'add'} user.
            </p>
          </div>
          <Icon name="close" onClick={() => onCancel()} />
        </div>
        {/* content */}
        <form
          onSubmit={handleSubmit}
          className="controls flex h-full flex-col justify-between gap-8 px-6"
        >
          <div
            className="controls scrollbar flex max-h-[50vh] flex-col gap-4 overflow-y-auto pr-1"
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
              disabled={!!id}
              {...register('email')}
            />
            <NewFormControl
              label="Designation"
              placeholder="Designation"
              controlType="input"
              requiredControl
              options={userRoles as IDropDownData[]}
              choose="value"
              {...register('designation')}
            />
            <NewFormControl
              label="Role"
              requiredControl
              placeholder="Role"
              controlType="dropDown"
              options={userRoles as IDropDownData[]}
              choose="value"
              {...register('role_type')}
            />
            <NewFormControl
              label="Upload Photo"
              placeholder="Please upload picture (Jpeg, Png file format.)"
              controlType="dragAndDrop"
              requiredControl
              {...register('image', {
                setCustomValue: e => {
                  if (e?.length) scrollToComponent('--form-field-image');
                  return e;
                },
              })}
            />
          </div>
          <div className="actions mb-2 flex items-center justify-center gap-2">
            <SubmitButton
              isSubmitting={isLoading || patchLoading}
              isError={isError || patchIsError}
              isSuccess={isSuccess || patchIsSuccess}
              variant="default"
              className="flex items-center justify-center gap-1  text-white disabled:!pointer-events-auto disabled:!cursor-not-allowed"
              error={
                // @ts-ignore
                error?.response?.data?.message ||
                // @ts-ignore
                patchError?.response?.data?.message
              }
            >
              {id ? 'UPDATE' : 'UPLOAD'}
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
