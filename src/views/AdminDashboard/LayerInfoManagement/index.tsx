/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-nested-ternary */
import { Button } from '@Components/RadixComponents/Button';
import {
  getAvailablePopupFileds,
  getMapLayer,
  patchVectorLayerDetail,
  postMapLayerInfo,
  postPopulateLayerInfoData,
} from '@Services/adminDashboard';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import NewFormControl from '@Components/common/FormUI/NewFormControl';
import useForm from '@Hooks/useForm';
import { IDropDownData } from '@Components/RadixComponents/Dropdown';
import layerInfoOnChangeDI from '@Interceptors/layerInfoOnChangeDI';
import { convertJsonToFormData } from '@Utils/index';
import { layerInfoValidation } from '@Validators/index';
import Shifter from './Shifter';

export default function LayerInfoManagement() {
  const queryClient = useQueryClient();
  const { mutate: postLayerInfoData } = useMutation({
    mutationKey: ['post-map-layer-info'],
    mutationFn: postMapLayerInfo,
    onSuccess: () => {
      toast.success('Layer info added successfully!');
      clearAndInitialiseForm();
      queryClient.invalidateQueries({ queryKey: ['map-layers'] });
    },
  });
  const { mutate: postPoplateLayerInfoData } = useMutation({
    mutationKey: ['post-populate-map-layer'],
    mutationFn: postPopulateLayerInfoData,
    onSuccess: () => {
      toast.success('Layer info populated successfully!');
      clearAndInitialiseForm();
      queryClient.invalidateQueries({ queryKey: ['map-layers'] });
    },
  });
  const { mutate: patchVectorLayerInfoData } = useMutation({
    mutationKey: ['patch-map-layer-info'],
    mutationFn: patchVectorLayerDetail,
    onSuccess: () => {
      toast.success('Layer info added successfully!');
      clearAndInitialiseForm();
      queryClient.invalidateQueries({ queryKey: ['map-layers'] });
    },
  });

  const { data: mapLayerData } = useQuery({
    queryKey: ['map-layers', 'vector'],
    queryFn: () => getMapLayer({ layer_type: 'vector' }),
    select: response => {
      // eslint-disable-next-line prefer-destructuring
      const data: Record<string, any>[] = response.data;

      const dropDownOptions = data.reduce((acc, item) => {
        const { name_en, id, layer_id } = item;
        acc?.push({
          id,
          code: id,
          layer_id,
          label: name_en || 'No Name',
          value: name_en || 'No Name',
        });
        return acc;
      }, []);

      return dropDownOptions;
    },
  });

  const {
    register,
    values,
    setBindValues,
    handleSubmit,
    clearAndInitialiseForm,
  } = useForm({
    initialValues: {
      attribute_item: {
        value: [],
      },
      attribute_legend: {
        value: [],
      },
      external_attribute_item: {
        value: [],
      },
      external_attribute_legend: {
        value: [],
      },
    },
    onChangeDataInterceptor: layerInfoOnChangeDI,
    validationSchema: layerInfoValidation,
    postDataInterceptor: postDatas => {
      const { attribute_legend, external_attribute_legend, layer_id } =
        postDatas;
      const newPostData = {
        layer: layer_id,
        info_layer_ids: external_attribute_legend?.value?.reduce(
          (acc: string[], item: Record<string, any>) => [...acc, item.id],
          [],
        ),
        popup_fields: attribute_legend.value.reduce(
          (acc: string[], item: Record<string, any>) => [...acc, item.value],
          [],
        ),
      };
      return newPostData;
    },
    postInterceptor: async props => {
      const { layer, info_layer_ids, popup_fields } = props;
      const layerInfoFormData = convertJsonToFormData({
        layer,
        info_layer_ids,
      });
      const vectorFormData = convertJsonToFormData({
        popup_fields: JSON.stringify(popup_fields),
      });
      if (info_layer_ids.length) {
        postLayerInfoData(layerInfoFormData);

        // here we need to get the `layer_id` of the selected layer
        postPoplateLayerInfoData(
          convertJsonToFormData({
            layer: mapLayerData?.find(
              (item: Record<string, any>) => item.id === layer,
            )?.layer_id,
          }),
        );
      }
      if (popup_fields.length)
        patchVectorLayerInfoData({ formData: vectorFormData, id: layer });
    },
  });

  useQuery({
    queryKey: ['map-layers', values.layer_id],
    queryFn: () => getMapLayer({ id: values.layer_id }),
    select: response => {
      if (values.layer_id) {
        const {
          data,
          selected_data,
        }: {
          data: Record<string, any>[];
          selected_data: Record<string, any>[];
        } = response.data;
        const dropDownOptions = data?.map(({ name_en, id }, index) => {
          return {
            id,
            code: id,
            label: name_en,
            value: name_en,
          };
        }, []);
        const selectedDropDownOptions = selected_data?.map(
          ({ name_en, id }, index) => {
            return {
              id,
              code: id,
              label: name_en,
              value: name_en,
            };
          },
          [],
        );

        return {
          data: dropDownOptions,
          selected_data: selectedDropDownOptions,
        };
      }
      // eslint-disable-next-line prefer-destructuring
      const data: Record<string, any>[] = response.data;

      const dropDownOptions = data.reduce((acc, item) => {
        const { name_en, id } = item;
        acc?.push({
          id,
          code: id,
          label: name_en || 'No Name',
          value: name_en || 'No Name',
        });
        return acc;
      }, []);

      return { data: dropDownOptions, selected_data: [] };
    },
    onSuccess: ({ data, selected_data }) => {
      setBindValues(prev => ({
        ...prev,
        external_attribute_item: { value: data },
        external_attribute_legend: { value: selected_data },
      }));
    },
  });

  useQuery({
    queryKey: ['available-popup-fields', values.layer_id],
    queryFn: () => getAvailablePopupFileds({ layer_id: values.layer_id }),
    enabled: !!values.layer_id,
    select: response => {
      // eslint-disable-next-line prefer-destructuring
      const {
        data,
        selected_data,
      }: { data: string[]; selected_data: string[] } = response.data;
      const dropDownOptions = data?.map((item, index) => {
        return {
          id: index,
          code: index,
          label: item,
          value: item,
        };
      }, []);
      const selectedDropDownOptions = selected_data?.map((item, index) => {
        return {
          id: index,
          code: index,
          label: item,
          value: item,
        };
      }, []);

      return { data: dropDownOptions, selected_data: selectedDropDownOptions };
    },
    onSuccess: ({ data, selected_data }) => {
      setBindValues(prev => ({
        ...prev,
        attribute_item: { value: data },
        attribute_legend: { value: selected_data },
      }));
    },
  });

  return (
    <div className="flex h-full flex-col">
      <div className="top mb-4 flex items-start justify-between">
        <h5 className="">Layer Info Management</h5>
        <div className="left flex gap-2">
          {/* <Searchbar
              placeholder="Search"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <Button
              type="button"
              variant="icon-primary"
              className="flex !items-center justify-between gap-1 font-bold"
              onClick={() => setIsOpenAddUserPortal(true)}
            >
              ADD&nbsp;USER <Icon className="mt-1" name="add" />
            </Button> */}
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="content scrollbar flex flex-col gap-8 overflow-y-auto pr-2"
        style={{ scrollbarGutter: 'stable' }}
      >
        <div className="controls flex flex-col gap-9 ">
          <NewFormControl
            controlType="comboBox"
            label="Select Layer"
            requiredControl
            placeholder="Choose the Layer"
            options={mapLayerData as IDropDownData[]}
            {...register('layer_id')}
          />
          {/* <div className="inner-cover w-full"> */}
          <section className="flex flex-col gap-4 ">
            <h6>Own Attribute Management</h6>
            <div className="row flex w-full gap-3">
              <Shifter
                placeholder="Please select the layer above to see the list"
                right
                title="All Items"
                {...register('attribute_item')}
              />
              <Shifter
                left
                title="Info section items"
                {...register('attribute_legend')}
              />
            </div>
          </section>
          <section className="flex flex-col gap-4">
            <h6>External Attribute Management</h6>
            <div className="row flex w-full gap-3">
              <Shifter
                {...register('external_attribute_item')}
                right
                title="All Items"
              />
              <Shifter
                left
                title="Info section items"
                {...register('external_attribute_legend')}
              />
            </div>
          </section>
          <div className="actions mb-4 mt-6 flex items-center justify-center">
            <Button type="submit">Submit</Button>
          </div>
          {/* </div> */}
        </div>
      </form>
    </div>
  );
}
