/* eslint-disable camelcase */
import React from 'react';
import NewFormControl from '@Components/common/FormUI/NewFormControl';

import { weatherSourceOptions } from '@Constants/index';

interface ILayerProps {
  register: any;
}

const WeatherSource = ({ register }: ILayerProps) => {
  return (
    <>
      <NewFormControl
        controlType="dropDown"
        label="Weather Source"
        placeholder="Weather Source"
        options={weatherSourceOptions}
        requiredControl
        choose="value"
        {...register('weather_source')}
      />
      <NewFormControl
        controlType="dropDown"
        label="Parameter"
        placeholder="Parameter"
        options={[
          { id: 1, label: 'Precipitation', value: 'precipitation' },
          { id: 2, label: 'Temperature', value: 'temperature' },
        ]}
        requiredControl
        choose="value"
        {...register('parameter')}
      />
      {/* <NewFormControl
        controlType="comboBox"
        options={
          [
            ...(rasterAnalyticsData || []),
            ...(wmsAnalyticsData || []),
          ] as IDropDownData[]
        }
        label="Analytics Parameter"
        placeholder="Analytics Parameter"
        requiredControl
        choose="code"
        {...register('weather_layer')}
      /> */}
      <NewFormControl
        controlType="input"
        label="Title for Chart"
        placeholder="Title for Chart"
        requiredControl
        {...register('weather_title')}
      />
      <NewFormControl
        controlType="textArea"
        label="Description for Chart"
        placeholder="Description for Chart"
        requiredControl
        {...register('weather_description')}
      />

      <NewFormControl
        controlType="dropDown"
        label="Statistics for Analytics Chart"
        placeholder="Statistics for Analytics Chart"
        options={[
          { id: 1, label: 'Min', value: 'min' },
          { id: 2, label: 'Max', value: 'max' },
          { id: 3, label: 'Mean', value: 'mean' },
        ]}
        requiredControl
        multiple
        choose="value"
        {...register('weather_statistics')}
      />
      <NewFormControl
        controlType="input"
        label="Threshold Value for Chart"
        placeholder="Threshold Value for Chart"
        requiredControl
        type="number"
        {...register('weather_threshold_value')}
      />
      <NewFormControl
        controlType="dropDown"
        options={[
          { id: 1, label: 'Bar', value: 'bar' },
          { id: 2, label: 'Line', value: 'line' },
        ]}
        label="Type of Chart"
        choose="value"
        placeholder="Type of Chart"
        requiredControl
        {...register('weather_graph_type')}
      />
      <NewFormControl
        controlType="toggle"
        label="Display on public"
        {...register('weather_is_public')}
      />
    </>
  );
};

export default WeatherSource;
