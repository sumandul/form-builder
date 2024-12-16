/* eslint-disable no-new */
/* eslint-disable consistent-return */
/* eslint-disable no-useless-return */
/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { Map } from 'maplibre-gl';
import { ImageService } from 'mapbox-gl-esri-sources';

interface IWMSLayerProps {
  wmsUrl: string;
  map: Map | null;
  visibleOnMap: boolean;
  ismapLoaded: Boolean;
  sourceId: string;
}

export default function WMSImageServerLayer({
  wmsUrl,
  map,
  visibleOnMap,
  ismapLoaded,
  sourceId,
}: IWMSLayerProps) {
  useEffect(() => {
    if (!ismapLoaded || !visibleOnMap) return () => {};

    if (!ismapLoaded) return;

    new ImageService(sourceId, map, {
      url: wmsUrl,
    });

    map?.addLayer({
      id: `${sourceId}-imagery`,
      type: 'raster',
      source: sourceId,
    });

    return () => {
      if (map?.getLayer(`${sourceId}-imagery`)) {
        map.removeLayer(`${sourceId}-imagery`);
      }
      if (map?.getSource(sourceId)) {
        map?.removeSource(sourceId);
      }
    };
  }, [map, ismapLoaded, visibleOnMap, sourceId, wmsUrl]);
  return null;
}
