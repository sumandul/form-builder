/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { IDropDownData } from '@Components/RadixComponents/Dropdown';
import NewFormControl from '@Components/common/FormUI/NewFormControl';
import SubmitButton from '@Components/common/SubmitButton';
import useForm from '@Hooks/useForm';
import { getMapLayer } from '@Services/adminDashboard';
import {
  getLayerCategory,
  getLayerSubCategory,
  postWMSLayer,
} from '@Services/layerUpload';
import { convertJsonToFormData } from '@Utils/index';
import { addWMSLayerFormValidation } from '@Validators/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export default function WMSLayer() {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isSuccess, isError, error } = useMutation({
    mutationKey: ['post-wms-layer'],
    mutationFn: postWMSLayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wms-layer-list'] });
      queryClient.invalidateQueries({ queryKey: ['layer-data-list'] });
      toast.success('WMS Layer uploaded Successfully.');
      clearAndInitialiseForm();
    },
  });

  const { handleSubmit, register, values, clearAndInitialiseForm } = useForm({
    initialValues: { wmslayer_type: 'imageserver' },
    validationSchema: addWMSLayerFormValidation,
    onChangeDataInterceptor: props => {
      const { currentValues } = props;
      const { select_existing_layer, name_en } = currentValues;

      if (select_existing_layer && name_en) {
        const selectedLayer = mapLayerData?.find(
          (item: Record<string, any>) => item.value === name_en,
        );

        return {
          ...props.currentValues,
          category: selectedLayer?.category_id || '',
          subcategory: selectedLayer?.subcategory || '',
        };
      }
      return props.currentValues;
    },
    postDataInterceptor: val => {
      const {
        wmslayer_type,
        url,
        name_en,
        category,
        subcategory,
        detail,
        select_existing_layer,
        published_date,
      } = val;
      const formDate = convertJsonToFormData(
        select_existing_layer
          ? {
              name_en,
              url,
              wmslayer_type,
              updated_date: published_date,
              detail,
              category,
              subcategory,
            }
          : {
              name_en,
              url,
              wmslayer_type,
              category,
              subcategory,
            },
      );

      return formDate;
    },
    service: mutate,
  });

  const { data: layerCategory } = useQuery({
    queryKey: ['get-category'],
    queryFn: getLayerCategory,
    select: (response: any) => {
      // eslint-disable-next-line prefer-destructuring
      const data: Record<string, any>[] = response.data;
      const dropDownOptions = data.reduce((acc, item) => {
        const { id, name_en } = item;
        acc?.push({
          id,
          code: id,
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
        const { id, name_en } = item;
        acc?.push({
          id,
          code: id,
          label: name_en || 'No Name',
          value: name_en || 'No Name',
        });
        return acc;
      }, []);

      return dropDownOptions;
    },
    enabled: !!values.category,
  });

  const { data: mapLayerData } = useQuery({
    queryKey: ['map-layers', 'wms'],
    queryFn: () => getMapLayer({ layer_type: 'wms' }),
    enabled: !!values.select_existing_layer,
    select: response => {
      // eslint-disable-next-line prefer-destructuring
      const data: Record<string, any>[] = response.data;

      const dropDownOptions = data.reduce((acc, item) => {
        const { name_en, id, category_id, subcategory } = item;
        acc?.push({
          id,
          code: id,
          label: name_en || 'No Name',
          value: name_en || 'No Name',
          category_id,
          subcategory,
        });
        return acc;
      }, []);

      return dropDownOptions;
    },
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col items-center justify-between pb-3"
    >
      <div
        className="controls scrollbar  flex h-fit max-h-full w-full flex-col gap-4 overflow-y-auto pb-3  pr-1"
        style={{ scrollbarGutter: 'stable' }}
      >
        <div className="row flex">
          <NewFormControl
            controlType="toggle"
            label="Select Existing Layer"
            {...register('select_existing_layer')}
          />
        </div>
        <div className="row flex w-full items-start justify-center gap-2">
          <NewFormControl
            controlType="dropDown"
            label="URL Type"
            placeholder="URL Type"
            requiredControl
            options={[
              { id: 1, label: 'WMS', value: 'wms' },
              { id: 2, label: 'ArcGIS Image Server', value: 'imageserver' },
              { id: 3, label: 'ArcGIS Map Server', value: 'imagemap' },
            ]}
            choose="value"
            className="w-[40%]"
            {...register('wmslayer_type')}
          />

          <NewFormControl
            controlType="input"
            label="Your URL Here"
            placeholder="URL Here"
            className="flex-1"
            requiredControl
            {...register('url')}
          />
        </div>

        <NewFormControl
          controlType={values.select_existing_layer ? 'comboBox' : 'input'}
          label="Layer Name"
          placeholder="Layer Name"
          requiredControl
          options={mapLayerData as IDropDownData[]}
          choose="value"
          {...register('name_en')}
        />

        {values.select_existing_layer ? (
          <NewFormControl
            controlType="datePicker"
            label="Date"
            placeholder="Pick a Date"
            // disabled={values.select_existing_layer}
            requiredControl
            {...register('published_date')}
          />
        ) : null}

        <NewFormControl
          controlType="comboBox"
          label="Category"
          placeholder="Category"
          requiredControl
          disabled={values.select_existing_layer}
          options={layerCategory as IDropDownData[]}
          {...register('category')}
        />

        <NewFormControl
          controlType="comboBox"
          label="Sub-Category"
          placeholder="Sub-Category"
          requiredControl
          disabled={!values.category || values.select_existing_layer}
          choose="value"
          options={layerSubCategory as IDropDownData[]}
          {...register('subcategory')}
        />
        {!values.select_existing_layer && (
          <NewFormControl
            controlType="input"
            label="Detail"
            placeholder="Layer Detail"
            className="flex-1"
            requiredControl
            {...register('detail')}
          />
        )}
      </div>
      <div className="actions flex h-[2.5rem] items-center justify-center gap-2">
        <SubmitButton
          isSubmitting={isLoading}
          isError={isError}
          isSuccess={isSuccess}
          variant="default"
          className="flex items-center justify-center gap-1  text-white disabled:!pointer-events-auto disabled:!cursor-not-allowed"
          // @ts-ignore
          error={error?.response?.data?.message}
        >
          UPLOAD
        </SubmitButton>
      </div>
    </form>
  );
}
