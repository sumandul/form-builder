/* eslint-disable no-unused-vars */
import type { ReactElement } from 'react';
import type { Map, MapOptions } from 'maplibre-gl';
import type { Feature, FeatureCollection, GeoJsonTypes } from 'geojson';
import type { DrawMode } from '@mapbox/mapbox-gl-draw';

export type MapInstanceType = Map;

interface Controls {
  navigation?: boolean;
  geoLocate?: boolean;
  scale?: boolean;
  fullScreen?: boolean;
  terrain?: boolean;
}

export type MapControlLocation =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

export type MapOptionsType = {
  mapOptions?: Partial<MapOptions>;
  enable3D?: boolean;
  fullScreen?: boolean;
  disableRotation?: boolean;
  controls: Controls;
  controlLocation: MapControlLocation;
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

export interface IVectorLayer extends ILayer {
  geojson: GeojsonType;
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
  popupUI?: (properties: Record<string, any>) => ReactElement;
  title?: string;
  handleBtnClick?: (properties: Record<string, any>) => void;
  isLoading?: boolean;
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

export interface IRegisterProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'onFocus' | 'onAbort'
  > {
  bindvalue: any;
  onFocus: (e?: any) => void;
  onChange: (e: any) => void;
  touched: boolean;
  error: string;
  pretoucherror: any;
  controlleddisabled: boolean | undefined;
  uniquename: string;
}

export interface IFileDataObject {
  id: string | number;
  name: string;
  uploadedAt?: string;
  fileObject?: File;
  document?: string;
  date_created?: Date;
  rich_file?: string;
}
