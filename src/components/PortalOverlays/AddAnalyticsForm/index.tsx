/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { IDropDownData } from '@Components/RadixComponents/Dropdown';
import NewFormControl from '@Components/common/FormUI/NewFormControl';
import Icon from '@Components/common/Icon';
import SubmitButton from '@Components/common/SubmitButton';
import useForm from '@Hooks/useForm';
import {
  getAnalytics,
  getAnalyticsDetail,
  getMapLayer,
  patchAnalyticsDetail,
  postAnalytics,
  postPopulateAnalyticsData,
} from '@Services/adminDashboard';
import { convertJsonToFormData } from '@Utils/index';
import { addAnalyticsDataValidator } from '@Validators/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Layer from './Layer';
import SectionTrigger from '../AddLayerOverlay/SectionTrigger';
import { sections } from '../AddThresholdOverlay';
import WeatherSource from './WeatherSource';

function getSelectedPayloadValue(values: Record<string, any>) {
  const {
    layer,
    statistics,
    threshold_value,
    selectedTab,
    title,
    description,
    is_public,
    graph_type,
    municipality_codes,
    ...rest
  } = values || {};
  if (values.selectedTab === 'layer') {
    return {
      layer,
      title,
      description,
      statistics,
      threshold_value,
      graph_type,
      is_public,
      municipality_codes,
    };
  }
  return {
    layer: rest?.weather_layer,
    weather_source: rest?.weather_source,
    parameter: rest?.parameter,
    title: rest?.weather_title,
    description: rest?.weather_description,
    statistics: rest?.weather_statistics,
    threshold_value: rest?.weather_threshold_value,
    graph_type: rest?.weather_graph_type,
    is_public: rest?.weather_is_public,
  };
}

export default function AddAnalyticsForm({
  onCancel,
  id,
}: {
  onCancel: () => void;
  id: string | null;
}) {
  const [activeSection, setActiveSection] = useState('layer');

  const queryClient = useQueryClient();
  const { mutate, isSuccess, isError, error, isLoading } = useMutation({
    mutationKey: ['post-analytics'],
    mutationFn: postAnalytics,
    onSuccess: () => {
      toast.success('Analytics added successfully.');
      clearAndInitialiseForm();
      queryClient.invalidateQueries({ queryKey: ['analytics-data-list'] });
      onCancel();
    },
  });

  const { mutate: postPopulateAnalytics } = useMutation({
    mutationKey: ['post-populate-analytics'],
    mutationFn: postPopulateAnalyticsData,
  });

  // get user details if there is id
  const { data: analyticsDetail } = useQuery({
    queryKey: ['get-analytics-data', id],
    queryFn: () => getAnalyticsDetail(id),
    enabled: !!id,
    select: response => {
      const {
        layer,
        title,
        description,
        statistics,
        threshold_value,
        graph_type,
        is_public,
      } = response.data;

      return {
        layer,
        title,
        description,
        statistics,
        threshold_value,
        graph_type,
        is_public,
      };
    },
  });

  const {
    mutate: patchAnalytics,
    error: patchError,
    isLoading: patchLoading,
    isSuccess: patchIsSuccess,
    isError: patchIsError,
  } = useMutation({
    mutationKey: ['patch-analytics-data'],
    mutationFn: patchAnalyticsDetail,
    onSuccess: () => {
      clearAndInitialiseForm();
      queryClient.invalidateQueries({ queryKey: ['analytics-data-list'] });
      toast.success('Analytics updated Successfully.');
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
    initialValues: {
      is_public: true,
      weather_is_public: true,
      selectedTab: 'layer',
    },
    validationSchema: addAnalyticsDataValidator,
    postDataInterceptor: vals => {
      const payloadValue = getSelectedPayloadValue(vals);
      const formData = convertJsonToFormData(payloadValue);
      return { formData, id, dataset: 'Watershed AOI', layer: vals.layer };
    },
    postInterceptor: async props => {
      const { formData, id: postableId, dataset, layer } = props;
      if (id) {
        patchAnalytics({ formData, id: postableId });
      } else {
        mutate({ formData });
        postPopulateAnalytics(convertJsonToFormData({ dataset, layer }));
      }
    },
  });

  useEffect(() => {
    if (id && analyticsDetail) setBindValues(analyticsDetail);
  }, [analyticsDetail]);

  return (
    <div className="absolute left-1/2 top-1/2 h-[45.5rem] max-h-[90vh] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white ">
      <div className="body flex h-full flex-col ">
        <div className="head flex w-full items-center justify-center gap-2 p-6">
          <div className="content flex w-full flex-col gap-2">
            <h4>Analytics form</h4>
            <p className="text-body-md">
              Please fill up the details to {id ? 'update' : 'add'} analytics
              graph.
            </p>
          </div>
          <Icon name="close" onClick={() => onCancel()} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex h-full flex-col justify-between gap-8 px-6"
        >
          <div
            className="controls scrollbar flex  max-h-[55vh] w-full flex-col gap-4 overflow-y-auto pr-1"
            style={{ scrollbarGutter: 'stable' }}
          >
            <div className="triggers flex w-full items-center gap-x-3">
              {sections.map(item => (
                <SectionTrigger
                  key={item.id}
                  className="!max-w-full basis-1/2"
                  active={activeSection === item.value}
                  onClick={() => {
                    setActiveSection(item.value);
                    setBindValues(prev => ({
                      ...prev,
                      selectedTab: item.value,
                    }));
                  }}
                  name={item?.name}
                />
              ))}
            </div>
            {activeSection === 'layer' ? (
              <Layer register={register} />
            ) : (
              <WeatherSource register={register} />
            )}
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
