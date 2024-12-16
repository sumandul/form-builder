import logo from '@Assets/images/AlertMeter.svg';
// import logo1 from '@Assets/images/Alert.svg';

export const sidebarWidth = '80px';

export const nothing = '';

interface IDropDownData {
  label: string;
  value: string | boolean;
  id?: string | number;
  code?: string;
}

export const sortOptionsList: IDropDownData[] = [
  {
    id: 1,
    label: 'Latest Published',
    value: '-published_date',
  },
  {
    id: 2,
    label: 'Oldest Published',
    value: 'published_date',
  },
  {
    id: 3,
    label: 'Latest Uploaded',
    value: '-created_date',
  },
  {
    id: 4,
    label: 'Oldest Uploaded',
    value: 'created_date',
  },
];

export const featureData = [
  {
    id: 1,
    icon: logo,
    title: 'Lorem, ipsum dolor.',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi atque hic magni quidem iusto perferendis nostrum, ut modi quaerat! Similique, eligendi? Esse repellat dicta et!',
  },
  {
    id: 2,
    icon: logo,
    title: 'Lorem, ipsum dolor.',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi atque hic magni quidem iusto perferendis nostrum, ut modi quaerat! Similique, eligendi? Esse repellat dicta et!',
  },
  {
    id: 3,
    icon: logo,
    title: 'Lorem, ipsum dolor.',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi atque hic magni quidem iusto perferendis nostrum, ut modi quaerat! Similique, eligendi? Esse repellat dicta et!',
  },
  {
    id: 4,
    icon: logo,
    title: 'Lorem, ipsum dolor.',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi atque hic magni quidem iusto perferendis nostrum, ut modi quaerat! Similique, eligendi? Esse repellat dicta et!',
  },
];

export const layerList: IDropDownData[] = [
  {
    id: 1,
    label: 'Vector features',
    value: 'vector_features',
  },
  { id: 2, label: 'Raster', value: 'raster' },
  {
    id: 3,
    label: 'Add WMS layer',
    value: 'add_wms_layer',
  },
];
export const statsList: IDropDownData[] = [
  {
    id: 1,
    label: 'MIN',
    value: 'min',
  },
  { id: 2, label: 'MAX', value: 'max' },
  {
    id: 3,
    label: 'MEAN',
    value: 'mean',
  },
];

export const statisticsList: IDropDownData[] = [
  {
    id: 1,
    label: 'Max',
    value: 'max',
  },
  {
    id: 2,
    label: 'Mean',
    value: 'mean',
  },
  {
    id: 1,
    label: 'Min',
    value: 'min',
  },
];

export const weatherSourceOptions = [
  {
    id: 1,
    label: 'Openweather Current',
    value: 'openweather_current',
  },
  {
    id: 2,
    label: 'Openweather Forecast',
    value: 'openweather_forecast',
  },
  {
    id: 4,
    label: 'Weatherapi Current',
    value: 'weatherapi_current',
  },

  {
    id: 5,
    label: 'Weatherapi Forecast',
    value: 'weatherapi_forecast',
  },
  {
    id: 6,
    label: 'Windy',
    value: 'windy',
  },
  {
    id: 7,
    label: 'DHM',
    value: 'hydrology_rainfall',
  },
  {
    id: 8,
    label: 'HIWAT',
    value: 'hkh_weather_data',
  },
];

export const precipitationThresholdOptions = [
  { id: 1, label: '1hr', value: 1 },
  { id: 2, label: '3hrs', value: 3 },
  { id: 3, label: '12hrs', value: 12 },
];
