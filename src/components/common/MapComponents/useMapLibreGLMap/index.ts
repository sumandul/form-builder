import { useEffect, useState } from 'react';
import { Map } from 'maplibre-gl';
import { IMapOptionsProps, MapInstanceType } from '../Schemas';

export default function useMapLibreGLMap({
  mapOptions,
  enable3D = false,
  fullScreen = false,
  disableRotation = false,
}: IMapOptionsProps) {
  const [map, setMap] = useState<MapInstanceType | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  // setup map instance
  useEffect(() => {
    const mapInstance = new Map({
      container: 'maplibre-gl-map',
      style: {
        version: 8,
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
        sources: {
          hybrid: {
            type: 'raster',
            tiles: ['https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'],
            tileSize: 256,
            attribution: '',
          },
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '',
          },
          topo: {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            ],
          },
          satellite: {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            attribution: '',
          },
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            layout: {
              visibility: 'visible',
            },
          },
          {
            id: 'satellite',
            type: 'raster',
            source: 'satellite',
            layout: {
              visibility: 'none',
            },
          },
          {
            id: 'topo',
            type: 'raster',
            source: 'topo',
            layout: {
              visibility: 'none',
            },
          },
          {
            id: 'hybrid',
            type: 'raster',
            source: 'hybrid',
            layout: {
              visibility: 'none',
            },
          },
        ],
      },
      center: [84.57394902560065, 28.415681762024647],
      zoom: 1,
      attributionControl: false,
      ...mapOptions,
    });

    setMap(mapInstance);
    // return () => mapInstance.setTarget(undefined);
  }, []); // eslint-disable-line

  // add terrain source for 3D
  useEffect(() => {
    if (!map) return;
    map.on('load', () => {
      map.addSource('terrainSource', {
        type: 'raster-dem',
        tiles: ['https://vtc-cdn.maptoolkit.net/terrainrgb/{z}/{x}/{y}.webp'],
        encoding: 'mapbox',
        maxzoom: 14,
        minzoom: 4,
      });
      setIsMapLoaded(true);
    });
  }, [map]);

  // add 3D terrain
  useEffect(() => {
    if (!map || !isMapLoaded) return;
    if (enable3D) {
      map.setTerrain({ source: 'terrainSource', exaggeration: 0.6 });
    } else {
      // @ts-ignore
      map.setTerrain();
    }
  }, [map, isMapLoaded, enable3D]);

  // toggle fullscreen
  useEffect(() => {
    if (!map) return;
    if (fullScreen) {
      map.getContainer().requestFullscreen();
    } else if (
      !fullScreen ||
      (!window.screenTop && window.innerHeight === window.screen.height)
    ) {
      document?.exitFullscreen();
    }
  }, [map, fullScreen]);

  // disable map pane rotation
  useEffect(() => {
    if (!map || !disableRotation) return;
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
  }, [map, disableRotation]);

  return { map, isMapLoaded };
}
