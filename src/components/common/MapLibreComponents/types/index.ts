/* eslint-disable no-unused-vars */
import type { ReactElement } from 'react';
import type { Map, MapOptions } from 'maplibre-gl';
import type { Feature, FeatureCollection, GeoJsonTypes } from 'geojson';
import type { DrawMode } from '@mapbox/mapbox-gl-draw';

export type MapInstanceType = Map;

export type MapOptionsType = {
  mapOptions?: Partial<MapOptions>;
  enable3D?: boolean;
  disableRotation?: boolean;
};

export interface IMapOptionsProps extends Partial<MapOptionsType> {}

export interface IMapContainer {
  // children?: ReactNode;
  children?: ReactElement<any> | ReactElement<any>[] | any;
  map: MapInstanceType | null;
  isMapLoaded: Boolean;
  style?: Object;
}

export interface IBaseLayerSwitcher {
  map?: MapInstanceType;
  baseLayers?: object;
  activeLayer?: string;
}

export interface ILayer {
  map?: MapInstanceType;
  isMapLoaded?: Boolean;
  id: Number | String;
  style?: Object;
  layerOptions?: Object;
  visibleOnMap?: Boolean;
}

export type GeojsonType = GeoJsonTypes | FeatureCollection | Feature;

export type MapIconType = { name: string; url: string };
export interface IVectorLayer extends ILayer {
  geojson: GeojsonType;
  iconList: MapIconType[];
}

export interface ICustomVectorLayer extends ILayer {
  geojson: GeojsonType;
  textField?: string;
  // iconList: MapIconType[];
}

type InteractionsType = 'hover' | 'select';

export interface IVectorTileLayer extends ILayer {
  url: string;
  interactions?: InteractionsType[];
  onFeatureSelect?: (properties: Record<string, any>) => void;
}

export interface IAsyncPopup {
  map?: MapInstanceType;
  isMapLoaded?: Boolean;
  fetchPopupData?: (properties: Record<string, any>) => void;
  getProperties?: (properties: Record<string, any> | null) => void;
  popupUI?: (properties: Record<string, any>) => ReactElement;
  title?: string;
  handleBtnClick?: (properties: Record<string, any>) => void;
  isLoading?: boolean;
  onClose?: () => void;
  layer?: string;
  forFill?: boolean;
  hasMoreData?: boolean;
  onSeeMoreClick?: any;
}

export interface IMunicipalWeather {
  onClose?: () => void;
}

export type DrawModeTypes = DrawMode | null | undefined;

export interface IUseDrawToolProps {
  map?: MapInstanceType | null;
  enable: boolean;
  drawMode: DrawModeTypes;
  geojson?: GeojsonType | null;
  styles: Record<string, any>[];
  onDrawEnd: (geojson: GeojsonType | null) => void;
}
