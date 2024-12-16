/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { IDropDownData } from '@Components/RadixComponents/Dropdown';
import NewFormControl from '@Components/common/FormUI/NewFormControl';
import SubmitButton from '@Components/common/SubmitButton';
import useForm from '@Hooks/useForm';
import { scrollToComponent } from '@Hooks/useForm/useFormUtils';
import { getMapLayer } from '@Services/adminDashboard';
import {
  getLayerCategory,
  getLayerSubCategory,
  postRasterLayer,
} from '@Services/layerUpload';
import { convertJsonToFormData } from '@Utils/index';
import { addRasterLayerFormValidation } from '@Validators/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export default function Raster() {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isSuccess, isError, error } = useMutation({
    mutationKey: ['post-wms-layer'],
    mutationFn: postRasterLayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['raster-layer-list'] });
      queryClient.invalidateQueries({ queryKey: ['layer-data-list'] });
      toast.success('Raster Layer uploaded Successfully.');
      clearAndInitialiseForm();
    },
  });

  const { data: mapLayerData } = useQuery({
    queryKey: ['map-layers', 'raster'],
    queryFn: () => getMapLayer({ layer_type: 'raster' }),
    select: response => {
      // eslint-disable-next-line prefer-destructuring
      const data: Record<string, any>[] = response.data;

      const dropDownOptions = data.reduce((acc, item) => {
        const { name_en, id, category, subcategory, category_id, layer_id } =
          item;
        acc?.push({
          id,
          code: id,
          label: name_en || 'No Name',
          value: name_en || 'No Name',
          category,
          subcategory,
          category_id,
          layer_id,
        });
        return acc;
      }, []);

      return dropDownOptions;
    },
  });

  const { handleSubmit, register, values, clearAndInitialiseForm } = useForm({
    initialValues: { select_existing_layer: false },
    validationSchema: addRasterLayerFormValidation,
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
        name_en,
        category,
        subcategory,
        raster_file,
        detail,
        published_date,
        select_existing_layer,
        sld_file,
      } = val;

      const layer_id = mapLayerData?.find(
        (obj: Record<string, any>) => obj.value === name_en,
      )?.id;

      const formDate = convertJsonToFormData(
        select_existing_layer
          ? {
              layer_id,
              category,
              subcategory,
              published_date,
              raster_file: raster_file[0]?.fileObject,
              sld_file: sld_file[0]?.fileObject,
            }
          : {
              name_en,
              category,
              subcategory,
              detail,
              raster_file: raster_file[0]?.fileObject,
              published_date,
              sld_file: sld_file[0]?.fileObject,
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
        <NewFormControl
          controlType={values.select_existing_layer ? 'comboBox' : 'input'}
          label="Layer Name"
          placeholder={
            values.select_existing_layer
              ? 'Select Layer Name'
              : 'Enter layer name.'
          }
          requiredControl
          {...register('name_en')}
          options={mapLayerData as IDropDownData[]}
          choose="value"
        />
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
          choose="value"
          disabled={!values.category || values.select_existing_layer}
          options={layerSubCategory as IDropDownData[]}
          {...register('subcategory')}
        />
        {!values.select_existing_layer && (
          <NewFormControl
            controlType="input"
            label="Detail"
            placeholder="Layer Details"
            requiredControl
            {...register('detail')}
          />
        )}
        {/* no published_date in api */}
        <NewFormControl
          controlType="datePicker"
          label="Published Date"
          placeholder="Pick a Date"
          requiredControl
          {...register('published_date')}
        />

        <NewFormControl
          controlType="dragAndDrop"
          rows={5}
          label="Upload Data"
          placeholder="Please Upload your data (.tif file format, EPSG 3857 Projection System)"
          requiredControl
          accept="image/tiff"
          {...register('raster_file', {
            setCustomValue: e => {
              if (e?.length) scrollToComponent('--form-field-raster_file');
              return e;
            },
          })}
        />
        <NewFormControl
          controlType="dragAndDrop"
          rows={5}
          label="Upload .sld File"
          requiredControl
          placeholder="Please Upload your data (.sld file format)"
          accept=".sld"
          {...register('sld_file', {
            setCustomValue: e => {
              if (e?.length) scrollToComponent('--form-field-sld_file');
              return e;
            },
          })}
        />
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
