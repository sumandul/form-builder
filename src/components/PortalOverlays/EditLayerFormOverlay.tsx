/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
import { IDropDownData } from '@Components/RadixComponents/Dropdown';
import NewFormControl from '@Components/common/FormUI/NewFormControl';
import Icon from '@Components/common/Icon';
import SubmitButton from '@Components/common/SubmitButton';
import useForm from '@Hooks/useForm';
import {
  getRasterLayerDetail,
  getVectorLayerDetail,
  getWmsLayerDetail,
  patchRasterLayerDetail,
  patchVectorLayerLayerDetail,
  patchWmsLayerDetail,
  postCategory,
} from '@Services/adminDashboard';

import { getLayerCategory, getLayerSubCategory } from '@Services/layerUpload';
import { convertJsonToFormData } from '@Utils/index';
import { editLayerFormValidator } from '@Validators/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function EditLayerFormOverlay({
  onCancel,
  id,
  type,
}: {
  onCancel: () => void;
  id: string | null;
  type: string;
}) {
  const queryClient = useQueryClient();
  const { mutate, isSuccess, isError, error, isLoading } = useMutation({
    mutationKey: ['post-layer'],
    mutationFn: postCategory,
    onSuccess: () => {
      toast.success('Layer added successfully.');
      clearAndInitialiseForm();
      queryClient.invalidateQueries({ queryKey: ['get-map-layer'] });
      onCancel();
    },
  });

  const { data: layerDetail } = useQuery({
    queryKey: ['get-layer-data', type, id],
    queryFn: () => {
      if (type === 'wms') return getWmsLayerDetail(id || '');
      if (type === 'raster') return getRasterLayerDetail(id || '');
      return getVectorLayerDetail(id || '');
    },
    enabled: !!id,
    select: response => {
      const { name_en, category_id, subcategory, detail } = response.data;
      return {
        name_en,
        category: category_id || '',
        subcategory,
        detail,
      };
    },
  });

  const {
    mutate: patchWmsLayer,
    error: patchWmsError,
    isLoading: patchWmsLoading,
    isSuccess: patchWmsIsSuccess,
    isError: patchWmsIsError,
  } = useMutation({
    mutationKey: ['patch-wms-data'],
    mutationFn: patchWmsLayerDetail,
    onSuccess: () => {
      clearAndInitialiseForm();
      queryClient.invalidateQueries({ queryKey: ['get-map-category'] });
      toast.success('Layer Updated Successfully.');
      onCancel();
    },
  });

  const {
    mutate: patchRasterLayer,
    error: patchRasterError,
    isLoading: patchRasterLoading,
    isSuccess: patchRasterIsSuccess,
    isError: patchRasterIsError,
  } = useMutation({
    mutationKey: ['patch-raster-data'],
    mutationFn: patchRasterLayerDetail,
    onSuccess: () => {
      clearAndInitialiseForm();
      queryClient.invalidateQueries({ queryKey: ['get-map-category'] });
      toast.success('Layer Updated Successfully.');
      onCancel();
    },
  });

  const {
    mutate: patchVectorLayer,
    error: patchVectorError,
    isLoading: patchVectorLoading,
    isSuccess: patchVectorIsSuccess,
    isError: patchVectorIsError,
  } = useMutation({
    mutationKey: ['patch-Vector-data'],
    mutationFn: patchVectorLayerLayerDetail,
    onSuccess: () => {
      clearAndInitialiseForm();
      queryClient.invalidateQueries({ queryKey: ['get-map-category'] });
      toast.success('Layer Updated Successfully.');
      onCancel();
    },
  });

  const {
    register,
    handleSubmit,
    clearAndInitialiseForm,
    setBindValues,
    values,
  } = useForm({
    initialValues: { is_public: true },
    validationSchema: editLayerFormValidator,
    postDataInterceptor: vals => {
      const formData = convertJsonToFormData(vals);
      return { formData, id };
    },
    postInterceptor: async (props: any) => {
      if (id) {
        if (type === 'raster') {
          patchRasterLayer({ id: props.id, formData: props.formData });
        }
        if (type === 'wms') {
          patchWmsLayer({ id: props.id, formData: props.formData });
        }
        if (type === 'vector') {
          patchVectorLayer({ id: props.id, formData: props.formData });
        }
      } else {
        mutate(props);
      }
    },
    // service: id ? patchCategory : mutate,
  });

  useEffect(() => {
    if (id && layerDetail) setBindValues(layerDetail);
  }, [layerDetail]);

  const { data: layerCategory } = useQuery({
    queryKey: ['get-category'],
    queryFn: getLayerCategory,
    select: (response: any) => {
      // eslint-disable-next-line prefer-destructuring
      const data: Record<string, any>[] = response.data;
      const dropDownOptions = data.reduce((acc, item) => {
        const { id: idx, name_en } = item;
        acc?.push({
          id: idx,
          code: idx,
          label: name_en || 'No Name',
          value: name_en || 'No Name',
        });
        return acc;
      }, []);
      return dropDownOptions;
    },
  });

  const { data: layerSubCategory } = useQuery({
    queryKey: ['get-sub-category', values.category],
    queryFn: () => getLayerSubCategory(values.category),
    select: (response: any) => {
      // eslint-disable-next-line prefer-destructuring
      const data: Record<string, any>[] = response.data;
      const dropDownOptions = data.reduce((acc, item) => {
        const { id: idx, name_en } = item;
        acc?.push({
          id: idx,
          code: idx,
          label: name_en || 'No Name',
          value: name_en || 'No Name',
        });
        return acc;
      }, []);

      return dropDownOptions;
    },
    enabled: !!values.category,
  });

  return (
    <div className="absolute left-1/2 top-1/2 h-[38rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white ">
      <div className="body flex h-full flex-col ">
        <div className="head flex w-full items-center justify-center gap-2 p-6">
          <div className="content flex w-full flex-col gap-2">
            <h4>Edit Layer</h4>
            <p className="text-body-md">
              Please fill up the details to {id ? 'update' : 'add'} layer.
            </p>
          </div>
          <Icon name="close" onClick={() => onCancel()} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="controls flex flex-col gap-8 px-6"
        >
          <div
            className="controls scrollbar flex max-h-[32rem] w-full flex-col gap-4 overflow-y-auto pr-1"
            style={{ scrollbarGutter: 'stable' }}
          >
            <NewFormControl
              controlType="input"
              label="Layer Name"
              placeholder="Layer Name"
              requiredControl
              {...register('name_en')}
            />

            <NewFormControl
              controlType="comboBox"
              label="Category"
              placeholder="Category"
              requiredControl
              options={layerCategory as IDropDownData[]}
              {...register('category')}
            />

            <NewFormControl
              controlType="comboBox"
              label="Sub-Category"
              placeholder="Sub-Category"
              requiredControl
              disabled={!values.category}
              choose="value"
              options={layerSubCategory as IDropDownData[]}
              {...register('subcategory')}
            />
            <NewFormControl
              controlType="textArea"
              label="Layer Detail"
              placeholder="Input Layer Details"
              {...register('detail')}
            />
          </div>
          <div className="actions flex items-center justify-center gap-2">
            <SubmitButton
              isSubmitting={
                isLoading ||
                patchWmsLoading ||
                patchRasterLoading ||
                patchVectorLoading
              }
              isError={
                isError ||
                patchWmsIsError ||
                patchRasterIsError ||
                patchVectorIsError
              }
              isSuccess={
                isSuccess ||
                patchWmsIsSuccess ||
                patchRasterIsSuccess ||
                patchVectorIsSuccess
              }
              variant="default"
              className="flex items-center justify-center gap-1  text-white disabled:!pointer-events-auto disabled:!cursor-not-allowed"
              error={
                // @ts-ignore
                error?.response?.data?.message ||
                // @ts-ignore
                patchWmsError?.response?.data?.message ||
                // @ts-ignore
                patchRasterError?.response?.data?.message ||
                // @ts-ignore
                patchVectorError?.response?.data?.message
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
