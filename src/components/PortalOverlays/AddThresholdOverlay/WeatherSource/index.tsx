/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import NewFormControl from '@Components/common/FormUI/NewFormControl';
import {
  weatherSourceOptions,
  precipitationThresholdOptions,
} from '@Constants/index';
import { deletePrecipitationWeatherThresholds } from '@Services/adminDashboard';
import Input from '@Components/RadixComponents/Input';
import isEmpty from '@Utils/isEmpty';
import Icon from '@Components/common/Icon';
import DeleteConfirmationOverlay from '@Components/PortalOverlays/DeleteConfirmationOverlay';
import PortalTemplate from '@Components/common/PortalTemplate';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sortedArray } from '@Utils/index';
import { getMunicipality, getStationList } from '@Services/common';

interface IWeatherSourceProps {
  register: any;
  values: any;
  setBindValues: any;
}

const WeatherSource = ({
  register,
  values,
  setBindValues,
}: IWeatherSourceProps) => {
  const queryClient = useQueryClient();
  const [weatherSources, setWeatherSources] = useState<
    { id: number; label: string; value: string }[]
  >([]);
  const [deleteThresholdOverlay, setDeleteThresholdOverlay] = useState(false);
  const [selectedThreshold, setSelectedThreshold] = useState<Record<
    string,
    any
  > | null>(null);
  const {
    mutate: deleteThreshold,
    isLoading: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationKey: ['delete-threshold'],
    mutationFn: deletePrecipitationWeatherThresholds,
    onSuccess: () => {
      setSelectedThreshold(null);
      setDeleteThresholdOverlay(false);

      queryClient.invalidateQueries({
        queryKey: ['get-precipitation-threshold-data'],
      });
    },
  });
  const { data: municipalOptions } = useQuery({
    queryKey: ['get-municipality-list'],
    queryFn: getMunicipality,
    select: res =>
      res.data.map((municipal: Record<string, any>) => ({
        id: municipal.id,
        label: municipal.name,
        value: municipal.code,
      })),
  });
  const { data: stationOptions } = useQuery({
    queryKey: ['get-station-list'],
    queryFn: getStationList,
    select: res =>
      res.data.data.map((station: Record<string, any>) => ({
        id: station.station_series_id,
        label: station.title,
        value: station.station_series_id,
      })),
  });
  const handleChange = (e: any) => {
    const newThresholdValues = {
      ...values.weather_thresholds,
      [e.target.name]: e.target.value,
    };
    const selectedValue = values.thresholdsList.find(
      (threshold: Record<string, any>) => threshold.name === +e.target.name,
    );

    const newValue = { ...selectedValue, value: e.target.value };

    const newThresholds = values.thresholdsList.map(
      (list: Record<string, any>) => {
        if (list.id === newValue.id) return newValue;
        return list;
      },
    );
    setBindValues((prev: Record<string, any>) => ({
      ...prev,
      thresholdsList: newThresholds,
      weather_thresholds: newThresholdValues,
    }));
  };
  const weatherParameter = (value: string) => {
    const sourceOptions: { [key: string]: string[] } = {
      precipitation: [
        'windy',
        'weatherapi_forecast',
        'hydrology_rainfall',
        'hkh_weather_data',
      ],
      temperature: [
        'weatherapi_current',
        'weatherapi_forecast',
        'hkh_weather_data',
      ],
    };

    const filteredOptions = weatherSourceOptions.filter(
      option => sourceOptions[value]?.includes(option.value),
    );
    setWeatherSources(filteredOptions);
  };

  useEffect(() => {
    weatherParameter(values.parameter);
  }, [values.parameter]);
  return (
    <>
      <NewFormControl
        controlType="dropDown"
        options={[
          { id: 1, label: 'Precipitation', value: 'precipitation' },
          { id: 2, label: 'Temperature', value: 'temperature' },
        ]}
        label=" Weather Parameter"
        requiredControl
        choose="value"
        placeholder="Choose Parameter"
        {...register('parameter')}
      />
      <NewFormControl
        controlType="dropDown"
        options={weatherSources}
        label="Weather Source"
        placeholder="Weather Source"
        choose="value"
        requiredControl
        {...register('weather_source')}
      />

      {values.weather_source === 'hydrology_rainfall' ? (
        <NewFormControl
          label="Stations"
          requiredControl
          controlType="comboBox"
          options={[
            { id: 201, label: 'All' },
            ...(Array.isArray(stationOptions) ? stationOptions : []),
          ]}
          choose="id"
          value={stationOptions || ''}
          placeholder="Stations"
          multiple
          {...register('stations')}
        />
      ) : (
        <NewFormControl
          label="Municipalities"
          requiredControl
          controlType="comboBox"
          options={[
            { id: 201, label: 'All' },
            ...(Array.isArray(municipalOptions) ? municipalOptions : []),
          ]}
          value={municipalOptions || ''}
          placeholder="Municipality"
          multiple
          {...register('weather_municipality_codes')}
        />
      )}

      {values?.parameter === 'precipitation' && (
        <>
          <NewFormControl
            label="Threshold"
            requiredControl
            controlType="dropDown"
            choose="value"
            options={precipitationThresholdOptions?.filter(
              option =>
                !values?.thresholdsList?.some(
                  (threshold: Record<string, any>) =>
                    threshold.name === option.value,
                ),
            )}
            {...register('precipitation_threshold_value')}
            value={values.precipitation_threshold_value}
            onChange={data => {
              setBindValues((prev: Record<string, any>) => ({
                ...prev,
                // weather_threshold_value: data,
                thresholdsList: [
                  ...prev.thresholdsList,
                  {
                    id: `new-${data}`,
                    name: data,
                    value: '',
                  },
                ],
              }));
            }}
          />

          {values.thresholdsList && !isEmpty(values.thresholdsList) && (
            <div className="flex flex-wrap gap-3 rounded border border-gray-400 p-3">
              {sortedArray(values?.thresholdsList, 'name').map(
                (list: Record<string, any>) => (
                  <div key={list.id} className="flex items-center gap-x-3">
                    <span className="!w-[5rem]">{list.name} hour</span>
                    <Input
                      type="number"
                      className="w-[5rem]"
                      name={list.name}
                      value={list.value}
                      onChange={handleChange}
                    />
                    <Icon
                      name="delete"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => {
                        setSelectedThreshold(list);
                        setDeleteThresholdOverlay(true);
                      }}
                    />
                  </div>
                ),
              )}
            </div>
          )}
        </>
      )}

      {values?.parameter === 'temperature' && (
        <NewFormControl
          controlType="input"
          label="Threshold Value"
          requiredControl
          placeholder="Enter Value"
          type="number"
          {...register('weather_threshold_value')}
        />
      )}

      <NewFormControl
        label="Range"
        requiredControl
        controlType="radio"
        choose="value"
        options={[
          { id: 1, label: 'BELOW THRESHOLD', value: 'below' },
          { id: 2, label: 'ABOVE THRESHOLD', value: 'above' },
          //   { id: 3, label: 'EQUALS', value: 'equals' },
        ]}
        {...register('weather_threshold_operator')}
      />
      <NewFormControl
        label="Alert Type"
        requiredControl
        controlType="radio"
        choose="value"
        options={[
          //   { id: 1, label: 'CRITICAL', value: 'critical' },
          { id: 2, label: 'WARNING', value: 'warning' },
          { id: 3, label: 'ALERT', value: 'alert' },
        ]}
        {...register('weather_alert_type')}
      />
      <NewFormControl
        label="Message Title"
        requiredControl
        controlType="input"
        placeholder="Enter Title"
        className="w-full "
        {...register('weather_title')}
      />
      <NewFormControl
        label="Description"
        requiredControl
        controlType="textArea"
        placeholder="Enter Description"
        className="w-full"
        {...register('weather_description')}
      />
      <NewFormControl
        label="Status"
        requiredControl
        controlType="radio"
        {...register('weather_is_active')}
        choose="value"
        options={[
          {
            id: 1,
            label: 'ACTIVE',
            value: 'true',
          },
          { id: 2, label: 'DEACTIVE', value: 'false' },
        ]}
        className="w-full"
      />
      {deleteThresholdOverlay && (
        <PortalTemplate style={{ zIndex: 60 }}>
          <DeleteConfirmationOverlay
            onCancel={() => setDeleteThresholdOverlay(false)}
            onConfirm={() => {
              const { id } = selectedThreshold || {};
              if (id?.toString().includes('new')) {
                const newThresholdValues = values.thresholdsList.filter(
                  (threshold: Record<string, any>) => threshold.id !== id,
                );
                setBindValues((prev: Record<string, any>) => ({
                  ...prev,
                  thresholdsList: newThresholdValues,
                }));
                setDeleteThresholdOverlay(false);
              } else {
                deleteThreshold(id);
              }
            }}
            error={
              deleteError
                ? // @ts-ignore
                  deleteError?.response?.data?.message || 'Error Occurred'
                : null
            }
            isLoading={isDeleting}
          />
        </PortalTemplate>
      )}
    </>
  );
};

export default WeatherSource;
