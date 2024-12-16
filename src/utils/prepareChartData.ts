import capitalizeFirstLetter from './capitalizeFirstLetter';

export const labelMappings: Record<string, any> = {
  rcc: 'RCC',
  cgi_sheet: 'CGI Sheet',
};

export default function prepareChartData(data: any) {
  return Object.entries(data).map(([key, val]) => ({
    id: key,
    name:
      key in labelMappings ? labelMappings[key] : capitalizeFirstLetter(key),
    value: val,
  }));
}
