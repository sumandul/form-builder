/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import Icon from '@Components/common/Icon';
import useForm from '@Hooks/useForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { patchVectorStyle } from '@Services/edit';
import { convertJsonToFormData } from '@Utils/index';
import SubmitButton from '@Components/common/SubmitButton';
import { useEffect, useMemo } from 'react';
import { useMap } from '@Components/Dashboard/MapSection';
import { useDispatch } from 'react-redux';
import { setFeatureColor } from '@Store/actions/mapActions';

export default function EditOverlay({
  onCancel,
  data,
}: {
  onCancel: () => void;
  data: any;
  isLoading?: boolean;
}) {
  const { id, layer, layerType, style, geometryType } = data;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { map } = useMap();

  const {
    mutate: patchStyle,
    error: patchError,
    isLoading: patchLoading,
    isSuccess: patchIsSuccess,
    isError: patchIsError,
  } = useMutation({
    mutationKey: ['patch-vector-style'],
    mutationFn: patchVectorStyle,
    onSuccess: res => {
      queryClient.invalidateQueries({
        queryKey: ['vector-layer-list'],
      });
      toast.success('Vector Style Updated Successfully.');

      dispatch(setFeatureColor({ ...res.data.style_json, id }));
      onCancel();
    },
  });

  const floatFields = useMemo(
    () => [
      'fill-opacity',
      'circle-radius',
      'line-opacity',
      'line-width',
      'raster-opacity',
    ],
    [],
  );

  const { register, handleSubmit, values } = useForm({
    initialValues: { ...style },
    postDataInterceptor: vals => {
      const vectorStyle = { style_json: JSON.stringify(vals) };
      const formData = convertJsonToFormData(vectorStyle);
      return { formData, id };
    },
    onChangeDataInterceptor: ({ currentValues }) => {
      return currentValues;
    },
    service: patchStyle,
  });

  useEffect(() => {
    if (!values) return;
    const convertToFloat = (vals: Record<string, any>) => {
      Object.keys(vals).forEach(key => {
        if (floatFields.includes(key)) {
          vals[key] = parseFloat(vals[key]);
        }
      });
      return vals;
    };
    convertToFloat(values);
    if (layerType === 'raster' || layerType === 'wms') {
      for (const [key, value] of Object.entries(values)) {
        map?.setPaintProperty(`layer-${id}-${layer}-imagery`, key, value);
      }
    }
    if (geometryType === 'Point') {
      for (const [key, value] of Object.entries(values)) {
        map?.setPaintProperty(`layer-${layer}-point`, key, value);
      }
    }
    if (geometryType === 'Polygon') {
      for (const [key, value] of Object.entries(values)) {
        map?.setPaintProperty(`layer-${layer}-polygon`, key, value);
      }
    }
    if (geometryType === 'LineString') {
      for (const [key, value] of Object.entries(values)) {
        map?.setPaintProperty(`layer-${layer}-line`, key, value);
      }
    }
  }, [floatFields, geometryType, id, layer, layerType, map, values]);

  return (
    <div className="absolute left-1/2 top-1/2 h-screen w-[21.25rem] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-grey-100">
      <div className="body flex h-full flex-col  gap-2 p-6">
        <div className="head flex w-full gap-3">
          <Icon
            name="arrow_back_ios"
            onClick={() => onCancel()}
            className="mt-1.5 text-[1.2rem]"
          />
          <h5 className="mb-6 select-none">Edit Feature</h5>
        </div>
        <form onSubmit={handleSubmit} className="controls flex flex-col gap-8">
          {layerType === 'raster' && (
            <div className="content flex w-full flex-col  gap-2">
              <div className="flex justify-between">
                <div className="flex w-[60%] flex-col gap-4">
                  <label className="select-none font-primary text-tooltip text-gray-800">
                    Opacity
                  </label>
                  <input
                    type="range"
                    className="cursor-pointer rounded-lg outline-none"
                    min={0}
                    max={1}
                    step={0.01}
                    {...register('raster-opacity')}
                  />
                </div>
              </div>
            </div>
          )}
          {geometryType === 'Polygon' && (
            <div className="content flex w-full flex-col  gap-2">
              <div className="flex justify-between">
                <div>
                  <p className="mb-2 select-none font-primary text-tooltip text-gray-800">
                    Fill Color
                  </p>

                  <input
                    type="color"
                    className="h-[2rem] w-[2rem] cursor-pointer rounded-lg outline-none"
                    defaultValue={style['fill-color']}
                    {...register('fill-color')}
                  />
                </div>
                <div className="flex w-[60%] flex-col gap-4">
                  <label className="select-none font-primary text-tooltip text-gray-800">
                    Opacity
                  </label>
                  <input
                    type="range"
                    className="cursor-pointer rounded-lg outline-none"
                    min={0}
                    max={1}
                    step={0.01}
                    {...register('fill-opacity')}
                  />
                </div>
              </div>

              <p className="select-none font-primary text-tooltip text-gray-800">
                Outline Color
              </p>

              <input
                type="color"
                className="h-[2rem] w-[2rem] cursor-pointer rounded-lg outline-none"
                {...register('fill-outline-color')}
              />
            </div>
          )}
          {geometryType === 'Point' && (
            <div className="content flex w-full justify-between gap-2">
              <div className="flex flex-col gap-2">
                <p className="select-none text-tooltip text-gray-800">
                  Fill Color
                </p>

                <input
                  type="color"
                  className="h-[2rem] w-[2rem] cursor-pointer rounded-lg outline-none"
                  {...register('circle-color')}
                />
              </div>
              <div className="flex w-[60%] flex-col gap-4">
                <label className="select-none font-primary text-tooltip text-gray-800">
                  Radius
                </label>
                <input
                  type="range"
                  className="cursor-pointer rounded-lg outline-none"
                  min={0}
                  max={20}
                  step={1}
                  {...register('circle-radius')}
                />
              </div>
            </div>
          )}
          {geometryType === 'LineString' && (
            <div className="content flex w-full flex-col  gap-4">
              <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                  <p className="select-none text-tooltip text-gray-800">
                    Line Color
                  </p>
                  <input
                    type="color"
                    className="h-[2rem] w-[2rem] cursor-pointer rounded-lg outline-none"
                    {...register('line-color')}
                  />
                </div>
                <div className="flex w-[60%] flex-col gap-4">
                  <label className="select-none font-primary text-tooltip text-gray-800">
                    Line Opacity
                  </label>
                  <input
                    type="range"
                    className="cursor-pointer rounded-lg outline-none"
                    min={0}
                    max={1}
                    step={0.01}
                    {...register('line-opacity')}
                  />
                </div>
              </div>
              <label className="select-none font-primary text-tooltip text-gray-800">
                Line Width
              </label>
              <input
                type="range"
                className="cursor-pointer rounded-lg outline-none"
                min={0}
                max={10}
                step={1}
                {...register('line-width')}
              />
            </div>
          )}

          <div className="actions flex items-center justify-center gap-2">
            <SubmitButton
              isSubmitting={patchLoading}
              isError={patchIsError}
              isSuccess={patchIsSuccess}
              variant="default"
              className="flex items-center justify-center gap-1  text-white disabled:!pointer-events-auto disabled:!cursor-not-allowed"
              error={
                // @ts-ignore
                patchError?.response?.data?.message
              }
            >
              SAVE
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
