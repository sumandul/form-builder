/* eslint-disable no-new */
/* eslint-disable consistent-return */
/* eslint-disable no-useless-return */
/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { Map } from 'maplibre-gl';

interface IWMSLayerProps {
  map: Map | null;
  visibleOnMap: boolean;
  ismapLoaded: Boolean;
  sourceId: string;
  wmsUrl: string;
}

export default function WMSLayer({
  map,
  visibleOnMap,
  ismapLoaded,
  sourceId,
  wmsUrl,
}: IWMSLayerProps) {
  useEffect(() => {
    if (!ismapLoaded || !visibleOnMap) return () => {};

    if (!ismapLoaded) return;

    map?.addSource(sourceId, {
      type: 'raster',
      minzoom: 1,
      maxzoom: 20,
      tiles: [wmsUrl],
      tileSize: 256,
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
