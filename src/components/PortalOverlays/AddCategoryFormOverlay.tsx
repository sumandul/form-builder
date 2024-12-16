/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
import NewFormControl from '@Components/common/FormUI/NewFormControl';
import Icon from '@Components/common/Icon';
import SubmitButton from '@Components/common/SubmitButton';
import useForm from '@Hooks/useForm';
import {
  getCategoryDetail,
  patchCategoryDetail,
  postCategory,
} from '@Services/adminDashboard';
import { convertJsonToFormData } from '@Utils/index';
import { addCategoryValidator } from '@Validators/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function AddCategoryFormOverlay({
  onCancel,
  id,
}: {
  onCancel: () => void;
  id: string | null;
}) {
  const queryClient = useQueryClient();
  const { mutate, isSuccess, isError, error, isLoading } = useMutation({
    mutationKey: ['post-category'],
    mutationFn: postCategory,
    onSuccess: () => {
      toast.success('Category added successfully.');
      clearAndInitialiseForm();
      queryClient.invalidateQueries({ queryKey: ['get-map-category'] });
      onCancel();
    },
  });

  const { data: categoryDetail } = useQuery({
    queryKey: ['get-category-data', id],
    queryFn: () => getCategoryDetail(id),
    enabled: !!id,
    select: response => {
      const { name_en, details } = response.data;
      return {
        name_en,
        details,
      };
    },
  });

  const {
    mutate: patchCategory,
    error: patchError,
    isLoading: patchLoading,
    isSuccess: patchIsSuccess,
    isError: patchIsError,
  } = useMutation({
    mutationKey: ['patch-catagory-data'],
    mutationFn: patchCategoryDetail,
    onSuccess: () => {
      clearAndInitialiseForm();
      queryClient.invalidateQueries({ queryKey: ['get-map-category'] });
      toast.success('Category Updated Successfully.');
      onCancel();
    },
  });

  const { register, handleSubmit, clearAndInitialiseForm, setBindValues } =
    useForm({
      initialValues: { is_public: true },
      validationSchema: addCategoryValidator,
      postDataInterceptor: vals => {
        const formData = convertJsonToFormData(vals);
        return { formData, id };
      },
      service: id ? patchCategory : mutate,
    });

  useEffect(() => {
    if (id && categoryDetail) setBindValues(categoryDetail);
  }, [categoryDetail]);

  return (
    <div className="absolute left-1/2 top-1/2 h-[28rem] max-h-[90vh] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white ">
      <div className="body flex h-full flex-col ">
        <div className="head flex w-full items-center justify-center gap-2 p-6">
          <div className="content flex w-full flex-col gap-2">
            <h4>Category form</h4>
            <p className="text-body-md">
              Please fill up the details to {id ? 'update' : 'add'} category.
            </p>
          </div>
          <Icon name="close" onClick={() => onCancel()} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="controls flex h-full flex-col justify-between gap-8 px-6"
        >
          <div
            className="controls scrollbar flex max-h-[32rem] w-full flex-col gap-4 overflow-y-auto pr-1"
            style={{ scrollbarGutter: 'stable' }}
          >
            <NewFormControl
              controlType="input"
              options={[]}
              label="Category"
              placeholder="Enter Category Name"
              requiredControl
              {...register('name_en')}
            />

            <NewFormControl
              controlType="textArea"
              label="Description"
              placeholder="Description of Category"
              requiredControl
              {...register('details')}
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
