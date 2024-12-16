/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { useQueries, useQuery } from '@tanstack/react-query';
import {
  getLayerCategoryList,
  getLayerSubcategoryList,
  getVectorLayerList,
  getWMSLayerList,
  getRasterLayerList,
  getRasterSliderData,
  getAllLayerList,
} from '@Services/unAuthenticatedAPIs';
import { useEffect } from 'react';
import { useTypedDispatch, useTypedSelector } from '@Store/hooks';
import {
  setLayerCategoryList,
  setLayerSubCategoryList,
  setMapState,
  setVectorLayerList,
  setWMSLayerList,
  setRasterLayerList,
  setSubLayerList,
} from '@Store/actions/mapActions';
import { getMapLayer } from '@Services/adminDashboard';
import { defaultLayersList } from '@Constants/map';
import MapSection from './MapSection';

export default function DashboardComponent() {
  const dispatch = useTypedDispatch();
  const { data: layerCategory } = useQuery({
    queryKey: ['layer-category'],
    queryFn: getLayerCategoryList,
    select: (res: Record<string, any>) => res.data,
    onSuccess: res => {
      dispatch(setLayerCategoryList(res));
    },
  });

  const { data } = useQuery({
    queryKey: ['get-raster-slider-data'],
    queryFn: () => getRasterSliderData({ layer_id: 109 }),
    select: res => res.data,
    onSuccess: res => {
      dispatch(setMapState({ sliderList: res }));

      // Ensure res.length has a default value of 0 if it's undefined
      dispatch(setMapState({ sliderIndex: (res?.length ?? 0) + 1 }));
    },
  });

  useQuery({
    queryKey: ['layer-subcategory'],
    queryFn: getLayerSubcategoryList,
    select: (res: Record<string, any>) => [...res.data],
    onSuccess: res => {
      dispatch(setLayerSubCategoryList(res));
    },
  });

  const { data: layerList } = useQuery({
    queryKey: ['layers'],
    queryFn: getAllLayerList,
    select: (res: Record<string, any>) => [...res.data],
  });
  // Get sublayer list of the subcategories
  const layerQueries = useQueries({
    queries: (layerList || [])?.map(layers => {
      return {
        queryKey: ['subcat', layers.id],
        queryFn: () => getMapLayer({ id: layers.id }),
      };
    }),
  });

  // For layers of subcategories
  useEffect(() => {
    if (layerQueries.filter(query => query.status === 'success')?.length) {
      const successSubLayerList = layerQueries.filter(
        query => query.status === 'success',
      );
      const subLayerListData: Record<string, any>[] = successSubLayerList?.map(
        itm => itm.data || [],
      );

      const dispatchableData = subLayerListData.reduce<Record<string, any>[]>(
        (acc, item) => {
          const layerId = item?.config.params.id;
          const selected_data: Record<string, any>[] = item?.data.selected_data;
          const finalData = selected_data?.map(itm => ({
            ...itm,
            _layer_id: layerId,
            checked: false,
          }));

          return [...acc, ...finalData];
        },
        [],
      );

      const subLayerList = defaultLayersList?.filter(
        // @ts-ignore
        item => item.hasSubLayerList,
      );
      const subLayersArray = subLayerList
        // @ts-ignore
        ?.map(item => item.subLayerList)
        .flat();
      const newDispatchableData = [...dispatchableData, ...subLayersArray];

      dispatch(setSubLayerList(newDispatchableData || []));
    }
  }, [layerQueries]);

  const { data: vectorLayerList } = useQuery({
    queryKey: ['vector-layer-list'],
    queryFn: getVectorLayerList,
    select: (res: Record<string, any>) => [...res.data],
    onSuccess: res => {
      const updatedData = res?.map((layer: Record<string, any>) => ({
        ...layer,
        checked: layer.display_on_map,
      }));
      dispatch(setVectorLayerList(updatedData));
    },
  });

  const { data: wmsLayerList } = useQuery({
    queryKey: ['wms-layer-list'],
    queryFn: getWMSLayerList,
    select: (res: Record<string, any>) => res.data,
    onSuccess: res => {
      const updatedData = res?.map((layer: Record<string, any>) => ({
        ...layer,
        checked: false,
      }));
      dispatch(setWMSLayerList(updatedData));
    },
  });

  const { data: rasterLayerList } = useQuery({
    queryKey: ['raster-layer-list'],
    queryFn: getRasterLayerList,
    select: (res: Record<string, any>) => res.data,
    onSuccess: res => {
      const updatedData = res?.map((layer: Record<string, any>) => ({
        ...layer,
        checked: false,
      }));
      dispatch(setRasterLayerList(updatedData));
    },
  });

  const { data: sliderData } = useQuery({
    queryKey: ['get-raster-slider-data'],
    queryFn: () => getRasterSliderData({ layer_id: 109 }),
    select: res => res.data,
    onSuccess: res => {
      dispatch(setMapState({ sliderList: res }));
      dispatch(setMapState({ sliderIndex: res.length + 1 }));
    },
  });

  return (
    <div
      style={{ height: `calc(100vh - 68px)` }}
      className="w-ful  h-full
      rounded-xl border bg-grey-50"
    >
      <MapSection />
    </div>
  );
}
