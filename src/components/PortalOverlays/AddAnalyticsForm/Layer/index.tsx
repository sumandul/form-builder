/* eslint-disable camelcase */
import React from 'react';
import { IDropDownData } from '@Components/RadixComponents/Dropdown';
import NewFormControl from '@Components/common/FormUI/NewFormControl';

import { getMapLayer } from '@Services/adminDashboard';
import { useQuery } from '@tanstack/react-query';

interface ILayerProps {
  register: any;
}

const Layer = ({ register }: ILayerProps) => {
  const { data: rasterAnalyticsData } = useQuery({
    queryKey: ['get-analytics-data', 'raster'],
    queryFn: () => getMapLayer({ layer_type: 'raster' }),
    select: (response): IDropDownData[] => {
      // eslint-disable-next-line prefer-destructuring
      const data = response.data;

      const dropDownOptions = data?.reduce(
        (acc: Record<string, any>[], item: Record<string, any>) => {
          const { name_en, id: analyticsId } = item;
          acc?.push({
            id: analyticsId,
            code: analyticsId,
            label: name_en || 'No Name',
            value: name_en || 'No Name',
          });
          return acc;
        },
        [],
      );
      return dropDownOptions;
    },
  });

  const { data: wmsAnalyticsData } = useQuery({
    queryKey: ['get-analytics-data', 'wms'],
    queryFn: () => getMapLayer({ layer_type: 'wms' }),
    select: (response): IDropDownData[] => {
      // eslint-disable-next-line prefer-destructuring
      const data = response.data;

      const dropDownOptions = data.reduce(
        (acc: Record<string, any>[], item: Record<string, any>) => {
          const { name_en, id: analyticsId } = item;
          acc?.push({
            id: analyticsId,
            code: analyticsId,
            label: name_en || 'No Name',
            value: name_en || 'No Name',
          });
          return acc;
        },
        [],
      );
      return dropDownOptions;
    },
  });
  return (
    <>
      <NewFormControl
        controlType="comboBox"
        options={
          [
            ...(rasterAnalyticsData || []),
            ...(wmsAnalyticsData || []),
          ] as IDropDownData[]
        }
        label="Analytics Layer"
        placeholder="Analytics Layer"
        requiredControl
        choose="code"
        {...register('layer')}
      />
      <NewFormControl
        controlType="input"
        label="Title for Chart"
        placeholder="Title for Chart"
        requiredControl
        {...register('title')}
      />
      <NewFormControl
        controlType="textArea"
        label="Description for Chart"
        placeholder="Description for Chart"
        requiredControl
        {...register('description')}
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
        {...register('statistics')}
      />
      <NewFormControl
        controlType="input"
        label="Threshold Value for Chart"
        placeholder="Threshold Value for Chart"
        requiredControl
        type="number"
        {...register('threshold_value')}
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
        {...register('graph_type')}
      />
      <NewFormControl
        controlType="toggle"
        label="Display on public"
        {...register('is_public')}
      />
    </>
  );
};

export default Layer;
