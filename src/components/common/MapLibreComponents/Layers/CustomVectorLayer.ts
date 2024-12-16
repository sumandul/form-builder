import { useEffect, useMemo } from 'react';
import { ICustomVectorLayer } from '../types';

export default function CustomVectorLayer({
  map,
  id,
  geojson,
  isMapLoaded,
  layerOptions,
  textField,
  visibleOnMap = true,
}: ICustomVectorLayer) {
  const sourceId = useMemo(() => id.toString(), [id]);
  const textId = useMemo(() => `${id.toString()}-text`, [id]);
  // console.log(map.getSource(sourceId), 'id');
  useEffect(() => {
    if (!map || !isMapLoaded) return;

    if (map.getSource(sourceId)) {
      if (map.getLayer(sourceId)) {
        map?.removeLayer(sourceId);
      }

      if (map?.getLayer(textId)) {
        map?.removeLayer(textId);
      }

      map?.removeSource(sourceId);
    }

    map.addSource(sourceId, {
      type: 'geojson',
      data: geojson,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceId, isMapLoaded, map, textId, geojson]);

  useEffect(() => {
    if (!map || !isMapLoaded) return;

    if (visibleOnMap) {
      map.addLayer({
        id: sourceId,
        type: 'line',
        source: sourceId,
        layout: {},
        ...layerOptions,
      });

      if (textField && !map.getLayer(textId)) {
        map.addLayer({
          id: textId,
          type: 'symbol',
          source: sourceId,
          layout: {
            'text-field': ['get', `${textField}`], // Use the 'title' property for text
            'text-size': 10,
            'text-offset': [0, -0.5],
            'text-anchor': 'top',
          },
          paint: {
            'text-color': '#ffffff',
          },
        });
      }
    } else if (map.getLayer(sourceId)) {
      map.removeLayer(sourceId);
      if (map?.getLayer(textId)) {
        map?.removeLayer(textId);
      }
    }
  }, [map, isMapLoaded, visibleOnMap, sourceId, geojson]); // eslint-disable-line

  useEffect(
    () => () => {
      if (map?.getLayer(textId)) {
        map?.removeLayer(textId);
      }

      if (map?.getLayer(sourceId)) {
        map?.removeLayer(sourceId);
      }

      if (map?.getSource(sourceId)) {
        map?.removeSource(sourceId);
      }
    },
    [map, sourceId, textId],
  );

  return null;
}
