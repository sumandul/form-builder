/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
import { IVectorLayer } from '../types';

export default function VectorLayer({
  map,
  id,
  geojson,
  isMapLoaded,
  visibleOnMap = true,
  iconList = [],
}: IVectorLayer) {
  const sourceId = useMemo(() => id.toString(), [id]);
  const [iconLoaded, setIconLoaded] = useState(false);

  // Hover effect
  useEffect(() => {
    if (!map) return () => {};
    map.on('mouseenter', `${sourceId}-layer`, () => {
      // eslint-disable-next-line no-param-reassign
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', `${sourceId}-layer`, () => {
      // eslint-disable-next-line no-param-reassign
      map.getCanvas().style.cursor = '';
    });

    return () => {};
  }, [map]);

  // Load icons
  useEffect(() => {
    if (!map || !visibleOnMap || !iconList.length) return () => {};

    iconList.forEach(({ name, url }) => {
      map.loadImage(url, (error, image) => {
        // if (error) Promise.reject(error);
        if (error) throw new Error('Error Loading icon', error);

        // Add only if the icon is already not added
        if (!map.getImage(name) && image) {
          map.addImage(name, image);
        }
      });
    });

    setIconLoaded(true);

    return () => {};
  }, [map, visibleOnMap, iconList]);

  useEffect(() => {
    if (!map || !visibleOnMap || !isMapLoaded || !iconLoaded) return () => {};
    // Remove source and layer if already exists
    if (map.getLayer(`${sourceId}-layer`)) {
      map.removeLayer(`${sourceId}-layer`);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }

    map.addSource(sourceId, {
      type: 'geojson',
      data: geojson,
    });
    map.addLayer({
      id: `${sourceId}-layer`,
      type: 'symbol',
      source: id.toString(),
      layout: {
        'icon-image': ['get', 'weathericon'],
        'icon-size': 0.4,
      },
    });

    // Remove source and layer if already exists
    return () => {
      if (map.getLayer(`${sourceId}-layer`)) {
        map.removeLayer(`${sourceId}-layer`);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [map, visibleOnMap, sourceId, iconLoaded]);

  return null;
}
