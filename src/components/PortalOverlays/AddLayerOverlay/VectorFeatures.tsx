/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { IDropDownData } from '@Components/RadixComponents/Dropdown';
import NewFormControl from '@Components/common/FormUI/NewFormControl';
import SubmitButton from '@Components/common/SubmitButton';
// import SubmitButton from '@Components/common/SubmitButton';
import useForm from '@Hooks/useForm';
import { scrollToComponent } from '@Hooks/useForm/useFormUtils';
import {
  getLayerCategory,
  getLayerSubCategory,
  postVectorLayer,
} from '@Services/layerUpload';
import { addVectorLayerFormValidation } from '@Validators/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFileExtension } from '@xmanscript/utils';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function VectorFeatures() {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isSuccess, isError } = useMutation({
    mutationKey: ['post-wms-layer'],
    mutationFn: postVectorLayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vector-layer-list'] });
      queryClient.invalidateQueries({ queryKey: ['layer-data-list'] });
      toast.success('Vector Layer uploaded Successfully.');
      clearAndInitialiseForm();
    },
  });

  const [csvAttributes, setCsvAttributes] = useState<IDropDownData[]>([]);

  const { handleSubmit, register, clearAndInitialiseForm, values } = useForm({
    initialValues: { csv: false },
    validationSchema: addVectorLayerFormValidation,
    onChangeDataInterceptor: props => {
      const { currentValues } = props;
      const { file_upload } = currentValues;
      if (file_upload) {
        const extension = getFileExtension(file_upload[0].name);
        if (extension === 'csv') {
          // const attributes = readCSVFile(file_upload[0]?.fileObject);
          const reader = new FileReader();

          // Read file as string
          reader.readAsText(file_upload[0]?.fileObject);
          let rowData: string[] = [];

          // Load event
          reader.onload = (event: any) => {
            const csvdata = event.target.result;

            rowData = csvdata.split('\n');

            const dropAttributes = rowData[0]
              .split(',')
              .reduce((acc: IDropDownData[], item) => {
                return [
                  ...acc,
                  { id: acc.length || 0, value: item, label: item },
                ];
              }, []);
            setCsvAttributes(dropAttributes);
          };
        }

        return { ...currentValues, csv: extension === 'csv' };
      }
      return { ...currentValues };
    },
    postDataInterceptor: (val: Record<string, any>) => {
      const {
        name_en,
        category,
        subcategory,
        detail,
        file_upload,
        lat_field,
        long_field,
      } = val;
      const formDate = new FormData();
      formDate.append('name_en', name_en);
      formDate.append('category', category);
      formDate.append('subcategory', subcategory);
      formDate.append('detail', detail);
      // //   layer_type pathauna parcha
      // formDate.append('layer_type', 'vector');
      formDate.append('file_upload', file_upload[0].fileObject);
      formDate.append('lat_field', lat_field);
      formDate.append('long_field', long_field);
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
        className="controls scrollbar  flex h-fit max-h-full w-full flex-col gap-4 overflow-y-auto pb-3 pr-1"
        style={{ scrollbarGutter: 'stable' }}
      >
        <NewFormControl
          controlType="input"
          label="Layer Name"
          placeholder="Input Layer Name"
          requiredControl
          {...register('name_en')}
        />
        <NewFormControl
          controlType="comboBox"
          label="Category"
          placeholder="Category"
          options={layerCategory as IDropDownData[]}
          requiredControl
          {...register('category')}
        />

        <NewFormControl
          controlType="comboBox"
          label="Sub-Category"
          placeholder="Sub-Category"
          options={layerSubCategory as IDropDownData[]}
          choose="value"
          requiredControl
          disabled={!values.category}
          {...register('subcategory')}
        />
        <NewFormControl
          controlType="input"
          label="Layer Detail"
          placeholder="Input Layer Details"
          requiredControl
          {...register('detail')}
        />
        <NewFormControl
          controlType="dragAndDrop"
          rows={5}
          label="Upload Data"
          accept=".csv, .zip, .geojson"
          placeholder="Please Upload your data (csv, shp (zipped), geojson file format, EPSG 4326 Projection System)"
          requiredControl
          {...register('file_upload', {
            setCustomValue: e => {
              if (e?.length) scrollToComponent('--form-field-long_field');
              return e;
            },
          })}
        />
        {values.csv && (
          <div className="row flex items-center justify-center gap-4">
            <NewFormControl
              controlType="dropDown"
              label="Latitude"
              options={
                values.long_field
                  ? csvAttributes.filter(
                      item => item.value !== values.long_field,
                    )
                  : csvAttributes
              }
              placeholder="Input layer latitude"
              requiredControl
              choose="value"
              className="w-full"
              {...register('lat_field')}
            />
            <NewFormControl
              controlType="dropDown"
              options={
                values.lat_field
                  ? csvAttributes.filter(
                      item => item.value !== values.lat_field,
                    )
                  : csvAttributes
              }
              label="Longitude"
              placeholder="Input layer longitude"
              choose="value"
              requiredControl
              className="w-full"
              {...register('long_field')}
            />
          </div>
        )}
      </div>
      <div className="actions flex h-[2.5rem] w-full items-center justify-center gap-2">
        <SubmitButton
          isSubmitting={isLoading}
          isError={isError}
          isSuccess={isSuccess}
          variant="default"
          className="flex items-center justify-center gap-1  text-white disabled:!pointer-events-auto disabled:!cursor-not-allowed"
          // error={error?.message}
        >
          UPLOAD
        </SubmitButton>
      </div>
    </form>
  );
}
