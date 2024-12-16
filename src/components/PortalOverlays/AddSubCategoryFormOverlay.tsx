/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
import { IDropDownData } from '@Components/RadixComponents/Dropdown';
import NewFormControl from '@Components/common/FormUI/NewFormControl';
import Icon from '@Components/common/Icon';
import SubmitButton from '@Components/common/SubmitButton';
import useForm from '@Hooks/useForm';
import {
  getMapCategory,
  getSubCategoryDetail,
  patchSubCategoryDetail,
  postSubCategory,
} from '@Services/adminDashboard';
import { convertJsonToFormData } from '@Utils/index';
import { addSubCategoryValidator } from '@Validators/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function AddSubCategoryFormOverlay({
  onCancel,
  id,
}: {
  onCancel: () => void;
  id: string | null;
}) {
  const queryClient = useQueryClient();

  const { mutate, isSuccess, isError, error, isLoading } = useMutation({
    mutationKey: ['post-sub-category'],
    mutationFn: postSubCategory,
    onSuccess: () => {
      toast.success('Sub Category added successfully.');
      clearAndInitialiseForm();
      queryClient.invalidateQueries({ queryKey: ['get-sub-cat'] });
      onCancel();
    },
  });

  const { data: subCategoryDetail } = useQuery({
    queryKey: ['get-sub-cat-detail', id],
    queryFn: () => getSubCategoryDetail(id),
    enabled: !!id,
    select: response => {
      const { name_en, details, category } = response.data;
      return {
        name_en,
        details,
        category,
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
    mutationFn: patchSubCategoryDetail,
    onSuccess: () => {
      clearAndInitialiseForm();
      queryClient.invalidateQueries({ queryKey: ['get-sub-cat', id] });
      toast.success('Sub Category Updated Successfully.');
      onCancel();
    },
  });

  const { register, handleSubmit, clearAndInitialiseForm, setBindValues } =
    useForm({
      initialValues: { is_public: true },
      validationSchema: addSubCategoryValidator,
      postDataInterceptor: vals => {
        const formData = convertJsonToFormData(vals);
        return { formData, id };
      },
      service: id ? patchCategory : mutate,
    });

  useEffect(() => {
    if (id && subCategoryDetail) setBindValues(subCategoryDetail);
  }, [subCategoryDetail]);

  const { data: categoryData } = useQuery({
    queryKey: ['get-map-category'],
    queryFn: () => getMapCategory(),
    select: response => {
      const { data } = response;
      const dropDownData: IDropDownData[] = data.map(
        ({ name_en, id: catId }: Record<string, any>) => {
          return { label: name_en, id: catId };
        },
      );
      return dropDownData;
    },
  });

  return (
    <div className="absolute left-1/2 top-1/2 h-[32rem] max-h-[90vh] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white ">
      <div className="body flex h-full flex-col ">
        <div className="head flex w-full items-center justify-center gap-2 p-6">
          <div className="content flex w-full flex-col gap-2">
            <h4>Sub Category form</h4>
            <p className="text-body-md">
              Please fill up the details to {id ? 'update' : 'add'} sub
              category.
            </p>
          </div>
          <Icon name="close" onClick={() => onCancel()} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="controls flex h-full flex-col justify-between gap-8 px-6"
        >
          <div
            className="controls scrollbar flex max-h-[50vh] w-full flex-col gap-4 overflow-y-auto pr-1"
            style={{ scrollbarGutter: 'stable' }}
          >
            <NewFormControl
              controlType="comboBox"
              options={categoryData as IDropDownData[]}
              label="Category"
              placeholder="Select a Category"
              requiredControl
              choose="id"
              {...register('category')}
            />

            <NewFormControl
              controlType="input"
              label="Sub-Category Name"
              placeholder="Sub-Category Name"
              requiredControl
              {...register('name_en')}
            />

            <NewFormControl
              controlType="textArea"
              label="Description"
              placeholder="Sub Description of Sub Category"
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
