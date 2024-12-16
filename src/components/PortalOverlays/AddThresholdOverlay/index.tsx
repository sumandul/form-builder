/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */

import Icon from '@Components/common/Icon';
import SubmitButton from '@Components/common/SubmitButton';
import useForm from '@Hooks/useForm';
import {
  getThresholdDetail,
  getWeatherThresholdDetail,
  patchThresholdDetail,
  postAlertThreshold,
  postWeatherAlertThreshold,
  patchWeatherThresholdDetail,
  postPopulateAlertLogs,
  postWeatherThresholds,
  getWeatherThresholds,
  patchPrecipitationThresholds,
} from '@Services/adminDashboard';
import { convertJsonToFormData } from '@Utils/index';
import { alertThresholdValidation } from '@Validators/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import isEmpty from '@Utils/isEmpty';
import WeatherSource from './WeatherSource';

export const sections: Record<string, any>[] = [
  { id: 1, name: 'Layer', value: 'layer' },
  { id: 2, name: 'Weather Source', value: 'weather_source' },
];

function getSelectedPayloadValue(values: Record<string, any>) {
  const {
    layer,
    statistics,
    threshold_value,
    selectedTab,
    alert_type,
    threshold_operator,
    title,
    description,
    is_active,
    municipality_codes,
    ...rest
  } = values || {};
  if (values.selectedTab === 'layer') {
    return {
      layer,
      statistics,
      threshold_value,
      selectedTab,
      alert_type,
      threshold_operator,
      title,
      description,
      is_active,
      municipality_codes: municipality_codes?.join(', '),
    };
  }
  return {
    weather_source: rest?.weather_source,
    parameter: rest?.parameter,
    layer: 'weather',
    // statistics: rest?.weather_statistics,
    threshold_value: rest?.weather_threshold_value,
    alert_type: rest?.weather_alert_type,
    threshold_operator: rest?.weather_threshold_operator,
    title: rest?.weather_title,
    description: rest?.weather_description,
    is_active: rest?.weather_is_active,
    station_ids: rest?.stations ? JSON.stringify(rest?.stations) : null,
    municipality_codes: rest?.weather_municipality_codes
      ? JSON.stringify(rest?.weather_municipality_codes)
      : null,
  };
}

export default function AddThresholdOverlay({
  onCancel,
  id,
  selectedDataTab,
}: {
  onCancel: () => void;
  id: string | null;
  selectedDataTab?: string;
}) {
  const queryClient = useQueryClient();
  // const [activeSection, setActiveSection] = useState(selectedDataTab);

  // cleanup function to reset active section
  // useEffect(() => {
  //   return () => {
  //     setActiveSection('layer');
  //   };
  // }, []);

  // get user details if there is id
  const { data: thresholdDetails } = useQuery({
    queryKey: ['get-threshold-data', id],
    queryFn: () => getThresholdDetail(id),
    enabled: !!id && selectedDataTab === 'layer',
    select: response => {
      const {
        // layer,
        threshold_value,
        threshold_operator,
        alert_type,
        title,
        description,
        is_active,
        statistics,
        layer_id,
      } = response.data;
      return {
        layer: layer_id,
        threshold_value,
        threshold_operator,
        alert_type,
        title,
        description,
        statistics,
        is_active: is_active ? 'true' : 'false',
      };
    },
  });

  // get  details for weather source if there is id
  const { data: weatherThresholdDetails } = useQuery({
    queryKey: ['get-weather-threshold-data', id],
    queryFn: () => getWeatherThresholdDetail(id),
    // enabled: !!id && selectedDataTab === 'weather_source',
    select: response => {
      const {
        weather_source,
        parameter,
        threshold_value,
        threshold_operator,
        alert_type,
        title,
        description,
        is_active,
        station_ids,
        municipality_codes,
      } = response.data;
      return {
        weather_source,
        parameter,
        weather_threshold_value: threshold_value,
        weather_threshold_operator: threshold_operator,
        weather_alert_type: alert_type,
        weather_title: title,
        weather_description: description,
        weather_is_active: is_active ? 'true' : 'false',
        stations: station_ids,
        weather_municipality_codes: municipality_codes,
      };
    },
  });
  const { data: precipitationThresholds } = useQuery({
    queryKey: ['get-precipitation-threshold-data', id],
    queryFn: () => getWeatherThresholds({ weather_alert: id }),
    enabled: !!id,
    select: (response: any) => {
      return response.data.map((threshold: Record<string, any>) => ({
        id: threshold.id,
        name: threshold.duration_in_hr,
        value: threshold.value,
      }));
    },
  });

  const { error, isLoading, isSuccess, isError } = useMutation({
    mutationKey: ['post-threshold-data'],
    mutationFn: postAlertThreshold,
    onSuccess: () => {
      clearAndInitialiseForm();
      queryClient.invalidateQueries({ queryKey: ['threshold-data-list'] });

      toast.success('Threshold added successfully.');
      onCancel();
    },
  });

  const { mutate: postWeatherThreshold } = useMutation({
    mutationKey: ['post-weather-threshold'],
    mutationFn: async (dataArray: Record<string, any>[]) => {
      const promises = dataArray.map(data => postWeatherThresholds(data));
      return Promise.all(promises);
    },
    onSuccess: () => {
      onCancel();
    },
  });
  const { mutate: updateWeatherPrecipitationThreshold } = useMutation({
    mutationKey: ['update-weather-precipitation-threshold'],
    mutationFn: async (dataArray: Record<string, any>[]) => {
      const promises = dataArray.map(data =>
        patchPrecipitationThresholds({ value: data?.value }, data.id),
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      onCancel();
    },
  });

  const {
    mutate: postWeather,
    error: weatherAlertError,
    isLoading: weatherAlertLoading,
    isSuccess: weatherAlertSuccess,
    isError: isWeatherAlertError,
  } = useMutation({
    mutationKey: ['post-weather-threshold-data'],
    mutationFn: postWeatherAlertThreshold,
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({
        queryKey: ['weather-threshold-data-list'],
      });
      if (
        !isEmpty(values?.thresholdsList) &&
        values.parameter === 'precipitation'
      ) {
        const thresholdPayload = values?.thresholdsList.map(
          (threshold: Record<string, any>) => ({
            value: threshold?.value,
            duration_in_hr: threshold.name,
            weather_alert: response.data.data.id,
          }),
        );
        postWeatherThreshold(thresholdPayload);
      } else {
        onCancel();
      }
      clearAndInitialiseForm();

      toast.success('Threshold added successfully.');
    },
  });

  const {
    mutate: patchWeatherThreshold,
    error: patchWeatherError,
    isLoading: patchWeatherLoading,
    isSuccess: patchWeatherIsSuccess,
    isError: patchWeatherIsError,
  } = useMutation({
    mutationKey: ['patch-weather-threshold-data'],
    mutationFn: patchWeatherThresholdDetail,
    onSuccess: () => {
      clearAndInitialiseForm();
      queryClient.invalidateQueries({
        queryKey: ['weather-threshold-data-list'],
      });
      if (
        !isEmpty(values?.thresholdsList) &&
        values?.parameter === 'precipitation'
      ) {
        const newThresholdData = values?.thresholdsList.filter(
          (threshold: Record<string, any>) =>
            threshold?.id?.toString().includes('new'),
        );
        const patchThresholdData = values?.thresholdsList.filter(
          (threshold: Record<string, any>) =>
            !threshold?.id?.toString().includes('new'),
        );

        if (!isEmpty(newThresholdData)) {
          const thresholdPayload = newThresholdData.map(
            (threshold: Record<string, any>) => ({
              value: threshold?.value,
              duration_in_hr: threshold.name,
              weather_alert: id,
            }),
          );
          postWeatherThreshold(thresholdPayload);
        }

        if (!isEmpty(patchThresholdData)) {
          const thresholdPayload = patchThresholdData.map(
            (threshold: Record<string, any>) => ({
              value: threshold?.value,
              duration_in_hr: threshold.name,
              weather_alert: id,
              id: threshold?.id,
            }),
          );
          updateWeatherPrecipitationThreshold(thresholdPayload);
        }
      }
      toast.success('Threshold updated Successfully.');
      onCancel();
      clearAndInitialiseForm();
    },
  });

  const {
    // mutate: postPopulateAlert,
    error: populateError,
    isLoading: isPolulateLoading,
    isSuccess: isPupulateSuccess,
    isError: isPopulateError,
  } = useMutation({
    mutationKey: ['post-populate-alert-logs-data'],
    mutationFn: postPopulateAlertLogs,
    onSuccess: () => {
      clearAndInitialiseForm();
      queryClient.invalidateQueries({ queryKey: ['threshold-data-list'] });
      onCancel();
    },
  });

  const {
    // mutate: patchThreshold,
    error: patchError,
    isLoading: patchLoading,
    isSuccess: patchIsSuccess,
    isError: patchIsError,
  } = useMutation({
    mutationKey: ['patch-threshold-data'],
    mutationFn: patchThresholdDetail,
    onSuccess: () => {
      clearAndInitialiseForm();
      queryClient.invalidateQueries({ queryKey: ['threshold-data-list'] });
      toast.success('Threshold updated Successfully.');
      onCancel();
    },
  });
  // console.log()
  const {
    handleSubmit,
    register,
    clearAndInitialiseForm,
    setBindValues,
    values,
  } = useForm({
    initialValues: {
      layer: 'weather',
      threshold_value: '',
      threshold_operator: '',
      alert_type: '',
      title: '',
      description: '',
      stations: '',
      is_active: '',
      weather_source: 'hydrology_rainfall',
      parameter: 'precipitation',
      selectedTab: 'weather_source',
      thresholdsList: [],
      weather_municipality_codes: [],
    },

    postDataInterceptor: vals => {
      const payloadValue = getSelectedPayloadValue(vals);

      if (
        vals.parameter === 'precipitation' &&
        vals.selectedTab === 'weather_source'
      ) {
        delete payloadValue?.threshold_value;
      }

      return {
        formData: convertJsonToFormData(payloadValue),
        id,
        layer: 'weather',
        selectedTab: vals.selectedTab,
        parameter: vals.parameter,
      };
    },

    validationSchema: alertThresholdValidation,
    postInterceptor: async props => {
      const { parameter, ...rest } = props;

      if (id) {
        patchWeatherThreshold(rest);
      } else {
        postWeather(rest);
      }
    },
    // service: id ? patchThreshold : mutate,
  });

  useEffect(() => {
    if ((!thresholdDetails && !weatherThresholdDetails) || !id) return;

    if (thresholdDetails) setBindValues({ ...thresholdDetails });

    if (weatherThresholdDetails)
      setBindValues(prev => ({
        ...prev,
        ...weatherThresholdDetails,
      }));
  }, [thresholdDetails, weatherThresholdDetails]);
  useEffect(() => {
    if (!precipitationThresholds) return;
    // if (!id) {
    setBindValues(prev => ({
      ...prev,
      thresholdsList: precipitationThresholds,
    }));
    // }
  }, [precipitationThresholds]);

  return (
    <div className="absolute left-1/2 top-1/2    w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white ">
      <div className="body mb-9 flex h-full  flex-col ">
        <div className="head flex w-full items-center justify-center gap-2 p-6">
          <div className="content flex w-full flex-col gap-2">
            <h4>
              {id
                ? 'Edit Hydrometeorological Alert'
                : 'Add Hydrometeorological  Alert'}
            </h4>
            <p className="text-body-md">
              Please fill up the details to {id ? 'update' : 'add'}{' '}
              Hydrometeorological.
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
            <WeatherSource
              register={register}
              values={values}
              setBindValues={setBindValues}
            />
          </div>
          <div className="actions mb-2 flex items-center justify-center gap-2">
            <SubmitButton
              isSubmitting={
                isLoading ||
                patchLoading ||
                isPolulateLoading ||
                weatherAlertLoading ||
                patchWeatherLoading
              }
              isError={
                isError ||
                patchIsError ||
                isPopulateError ||
                isWeatherAlertError ||
                patchWeatherIsError
              }
              isSuccess={
                isSuccess ||
                patchIsSuccess ||
                isPupulateSuccess ||
                weatherAlertSuccess ||
                patchWeatherIsSuccess
              }
              variant="default"
              className="flex items-center justify-center gap-1  text-white disabled:!pointer-events-auto disabled:!cursor-not-allowed"
              error={
                // @ts-ignore
                error?.response?.data?.message ||
                // @ts-ignore
                patchError?.response?.data?.message ||
                // @ts-ignore
                populateError?.response?.data?.message ||
                // @ts-ignore
                weatherAlertError?.response?.data?.message ||
                // @ts-ignore
                patchWeatherError?.response?.data?.message
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
