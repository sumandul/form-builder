/* eslint-disable no-bitwise */
/* eslint-disable dot-notation */

import { temperatureMapping } from '@Constants/map';

type ColorRange = {
  min: number;
  max: number;
  color: string;
};

export const colorRanges: ColorRange[] = [
  { min: -Infinity, max: 0, color: '#6FA7BF' },
  { min: 0, max: 0.5, color: '#808080' }, // gray
  { min: 0.5, max: 10, color: '#15a4e4' }, // blue
  { min: 10, max: 20, color: '#43a047' }, // green
  { min: 20, max: 40, color: '#ffce31' }, // yellow
  { min: 40, max: 60, color: '#ffa100' }, // orange
  { min: 60, max: Infinity, color: '#bc0000' }, // red
];

export const tempColorRanges: ColorRange[] = [
  { min: -Infinity, max: 0, color: '#6FA7BF' },
  { min: -10, max: 0, color: '#314755' },
  { min: 0, max: 10, color: '#2b789f' },
  { min: 10, max: 20, color: '#26a0da' },
  { min: 20, max: 30, color: '#ec840c' },
  { min: 30, max: 40, color: '#e86904' },
  { min: 40, max: Infinity, color: '#940101' },
];

export const prepirationColorRanges: ColorRange[] = [
  { min: -Infinity, max: 0, color: '#6FA7BF' }, // light gray for values less than zero
  { min: 0, max: 0.5, color: '#b3e5fc' }, // light blue (not too light)
  { min: 0.5, max: 10, color: '#81d4fa' }, // light blue
  { min: 10, max: 20, color: '#4fc3f7' }, // sky blue
  { min: 20, max: 40, color: '#29b6f6' }, // dodger blue
  { min: 40, max: 60, color: '#039be5' }, // medium blue
  { min: 60, max: Infinity, color: '#01579b' }, // dark blue
];

// function interpolateColor(
//   color1: string,
//   color2: string,
//   factor: number,
// ): string {
//   const hexToRgb = (hex: string) => {
//     const bigint = parseInt(hex.slice(1), 16);
//     return {
//       r: (bigint >> 16) & 255,
//       g: (bigint >> 8) & 255,
//       b: bigint & 255,
//     };
//   };

//   const rgbToHexx = (r: number, g: number, b: number) => {
//     return `#${[r, g, b]
//       .map(x => x.toString(16).padStart(2, '0'))
//       .join('')
//       .toUpperCase()}`;
//   };

//   const c1 = hexToRgb(color1);
//   const c2 = hexToRgb(color2);

//   const r = Math.round(c1.r + factor * (c2.r - c1.r));
//   const g = Math.round(c1.g + factor * (c2.g - c1.g));
//   const b = Math.round(c1.b + factor * (c2.b - c1.b));

//   return rgbToHexx(r, g, b);
// }

export function getColorForValue(value: number): string {
  const colorObj = colorRanges.find(
    clr => Number(value) >= clr.min && Number(value) < clr.max,
  );

  return colorObj?.color || '#d4d4d4';
}

export function getPrecipitationColorForValue(value: number): string {
  const colorObj = prepirationColorRanges.find(
    clr => Number(value) >= clr.min && Number(value) < clr.max,
  );

  return colorObj?.color || '#d4d4d4';
  // if (Number(value) <= 0) {
  //   return colorRanges[0].color;
  // }

  // for (let i = 0; i < prepirationColorRanges.length - 1; i++) {
  //   const range = prepirationColorRanges[i];
  //   const nextRange = prepirationColorRanges[i + 1];

  //   if (value >= range.min && value < nextRange.min) {
  //     const factor = (value - range.min) / (nextRange.min - range.min);
  //     const interpolatedColor = interpolateColor(
  //       range.color,
  //       nextRange.color,
  //       factor,
  //     );
  //     return interpolatedColor;
  //   }
  // }
  // // Return the last range color if value exceeds all ranges
  // return prepirationColorRanges[prepirationColorRanges.length - 1].color;
}

/* eslint-disable import/prefer-default-export */
export function selectFillPaint(
  somefillPaints: Record<string, any>,
  layerName: string,
) {
  if (layerName === 'Glaciers') {
    return somefillPaints[layerName];
  }
  if (layerName === 'Debri Deposits') {
    return somefillPaints[layerName];
  }
  if (layerName === 'Natural Dams') {
    return somefillPaints[layerName];
  }
  if (layerName === 'Watershed AOI') {
    return somefillPaints[layerName];
  }
  if (layerName === 'Hydropower Dams') {
    return somefillPaints[layerName];
  }
  if (layerName === 'Event Data') {
    return somefillPaints[layerName];
  }
  return somefillPaints['Default'];
}

export function selectFillColor(layerName: string) {
  if (layerName === 'Glaciers') {
    return '#2D7C9A';
  }
  if (layerName === 'Debris Deposits') {
    return '#9ACD32';
  }
  if (layerName === 'Glacial Lakes') {
    return '#800080';
  }
  if (layerName === 'Natural Dams') {
    return '#FFFF00';
  }
  if (layerName === 'Watershed AOI') {
    return '#3B82F6';
  }
  if (layerName === 'Hydropower Dams') {
    return '#554534';
  }
  if (layerName === 'Event Data') {
    return '#FF7900';
  }
  return '#3B82F6';
}

// Function to generate choropeth map
export function getChoropethForForecastTemperatureOpenweather(
  data: Record<string, any>[] | string,
) {
  if (!data?.length || !Array.isArray(data)) return '#ffffff';

  const choroPethFillColor = ['match', ['get', 'municipality_code']];
  if (Array.isArray(data)) {
    data?.forEach((forecast: Record<string, any>) => {
      choroPethFillColor.push(forecast.fields.municipality_code[0]);
      let fillColor = null;
      temperatureMapping.forEach(temperatureRange => {
        const { fields } = forecast;
        const temp = fields['main.temp_max'];
        const { min, max, color } = temperatureRange;
        if (temp > min && temp <= max) {
          fillColor = color;
        }
      });
      if (fillColor) choroPethFillColor.push(fillColor);
      else choroPethFillColor.push('#ffffff');
    });
  }
  choroPethFillColor.push('#ffffff');

  return choroPethFillColor;
}

export function getChoropethForForecastPrecipitationWeatherApi(
  data: Record<string, any>[] | string,
) {
  if (!data?.length || !Array.isArray(data)) return '#ffffff';

  const choroPethFillColor = ['match', ['get', 'municipality_code']];

  if (Array.isArray(data)) {
    data?.forEach((forecast: Record<string, any>) => {
      if (!choroPethFillColor.includes(forecast.municipality_code)) {
        choroPethFillColor.push(forecast.municipality_code);
        const fillColor = getPrecipitationColorForValue(
          forecast['current.precip_mm'],
        );
        // let fillColor = null;
        // precipitationMapping.forEach(precipitationRange => {
        //   const currentPrecipitation = forecast['current.precip_mm'];

        //   const { min, max, color } = precipitationRange;
        //   if (currentPrecipitation > min && currentPrecipitation <= max) {
        //     fillColor = color;
        //   }
        // });
        if (fillColor) choroPethFillColor.push(fillColor);
        else choroPethFillColor.push('#ffffff');
      }
    });
  }

  choroPethFillColor.push('#ffffff');

  return choroPethFillColor;
}

export function getChoropethForForecastTemperatureWeatherApi(
  data: Record<string, any>[] | string,
) {
  if (!data?.length || !Array.isArray(data)) return '#ffffff';

  const choroPethFillColor = ['match', ['get', 'municipality_code']];

  if (Array.isArray(data)) {
    data?.forEach((forecast: Record<string, any>) => {
      if (!choroPethFillColor.includes(forecast.municipality_code)) {
        choroPethFillColor.push(forecast.municipality_code);
        const fillColor = getColorForValue(forecast['current.temp_c']);

        // let fillColor = null;
        // temperatureMapping.forEach(temperatureRange => {
        //   const currentTemperature = forecast['current.temp_c'];

        //   const { min, max, color } = temperatureRange;
        //   if (currentTemperature > min && currentTemperature <= max) {
        //     fillColor = color;
        //   }
        // });
        if (fillColor) choroPethFillColor.push(fillColor);
        else choroPethFillColor.push('#ffffff');
      }
    });
  }

  choroPethFillColor.push('#ffffff');

  return choroPethFillColor;
}

export function getChoropethForForecastPrecipitationWindy(
  data: Record<string, any>[] | string,
) {
  if (!data?.length || !Array.isArray(data)) return '#ffffff';

  const choroPethFillColor = ['match', ['get', 'municipality_code']];

  if (Array.isArray(data)) {
    data?.forEach((forecast: Record<string, any>) => {
      if (!choroPethFillColor.includes(forecast.municipality_code)) {
        choroPethFillColor.push(forecast.municipality_code);
        const fillColor = getPrecipitationColorForValue(forecast['precip']);
        // precipitationMapping.forEach(precipitationRange => {
        //   // const currentTemperature = forecast['current.temp_c'];
        //   const currentTemperature = forecast['current.precip_mm'];

        //   const { min, max, color } = precipitationRange;
        //   if (currentTemperature > min && currentTemperature <= max) {
        //     fillColor = color;
        //   }
        // });
        if (fillColor) choroPethFillColor.push(fillColor);
        else choroPethFillColor.push('#ffffff');
      }
    });
  }

  choroPethFillColor.push('#ffffff');

  return choroPethFillColor;
}

export function getChoropethForForecastTemperatureWindy(
  data: Record<string, any>[] | string,
) {
  if (!data?.length || !Array.isArray(data)) return '#ffffff';

  const choroPethFillColor = ['match', ['get', 'municipality_code']];

  if (Array.isArray(data)) {
    data?.forEach((forecast: Record<string, any>) => {
      if (!choroPethFillColor.includes(forecast.municipality_code)) {
        choroPethFillColor.push(forecast.municipality_code);
        const fillColor = getColorForValue(forecast['temp']);
        // let fillColor = null;
        // temperatureMapping.forEach(precipitationRange => {
        //   const current = forecast['current.temp_c'];
        //   // const current = forecast['current.precip_mm'];

        //   const { min, max, color } = precipitationRange;
        //   if (current > min && current <= max) {
        //     fillColor = color;
        //   }
        // });
        if (fillColor) choroPethFillColor.push(fillColor);
        else choroPethFillColor.push('#ffffff');
      }
    });
  }

  choroPethFillColor.push('#ffffff');

  return choroPethFillColor;
}

export function getChoropethForForecastTemperatureHiwat(
  data: Record<string, any>[] | string,
) {
  if (!data?.length || !Array.isArray(data)) return '#ffffff';

  const choroPethFillColor = ['match', ['get', 'municipality_code']];

  if (Array.isArray(data)) {
    data?.forEach((forecast: Record<string, any>) => {
      if (!choroPethFillColor.includes(forecast.properties.municipality_code)) {
        choroPethFillColor.push(forecast.properties.municipality_code);
        const fillColor = getColorForValue(forecast.properties.temperature);
        // let fillColor = null;
        // temperatureMapping.forEach(temperatureRange => {
        //   const current = forecast['current.temp_c'];
        //   // const current = forecast['current.precip_mm'];

        //   const { min, max, color } = temperatureRange;
        //   if (current > min && current <= max) {
        //     fillColor = color;
        //   }
        // });
        if (fillColor) choroPethFillColor.push(fillColor);
        else choroPethFillColor.push('#ffffff');
      }
    });
  }

  choroPethFillColor.push('#d4d4d4');

  return choroPethFillColor;
}

export function getChoropethForForecastPrecipitationHiwat(
  data: Record<string, any>[] | string,
) {
  if (!data?.length || !Array.isArray(data)) return '#ffffff';

  const choroPethFillColor = ['match', ['get', 'municipality_code']];

  if (Array.isArray(data)) {
    data?.forEach((forecast: Record<string, any>) => {
      if (!choroPethFillColor.includes(forecast.properties.municipality_code)) {
        choroPethFillColor.push(forecast.properties.municipality_code);
        const fillColor = getPrecipitationColorForValue(
          forecast.properties.precipitation,
        );

        // let fillColor = null;
        // precipitationMapping.forEach(precipitationRange => {
        //   // const current = forecast['current.temp_c'];
        //   const current = forecast['current.precip_mm'];

        //   const { min, max, color } = precipitationRange;
        //   if (current > min && current <= max) {
        //     fillColor = color;
        //   }
        // });

        if (fillColor) choroPethFillColor.push(fillColor);
        else choroPethFillColor.push('#ffffff');
      }
    });
  }

  choroPethFillColor.push('#d4d4d4');

  return choroPethFillColor;
}

export function getChoropethForForecastPrecipitationDHM(
  data: Record<string, any>[] | string,
) {
  if (!data?.length || !Array.isArray(data)) return '#ffffff';

  const choroPethFillColor = ['match', ['get', 'municipality_code']];

  if (Array.isArray(data)) {
    data?.forEach((forecast: Record<string, any>) => {
      if (!choroPethFillColor.includes(forecast.municipality_code)) {
        choroPethFillColor.push(forecast.municipality_code);
        const fillColor = getColorForValue(forecast['current.precip_mm']);
        // let fillColor = null;
        // precipitationMapping.forEach(precipitationRange => {
        //   // const current = forecast['current.temp_c'];
        //   const current = forecast['current.precip_mm'];

        //   const { min, max, color } = precipitationRange;
        //   if (current > min && current <= max) {
        //     fillColor = color;
        //   }
        // });
        if (fillColor) choroPethFillColor.push(fillColor);
        else choroPethFillColor.push('#ffffff');
      }
    });
  }

  choroPethFillColor.push('#ffffff');

  return choroPethFillColor;
}

export function getChoropethForForecastTemperatureDHM(
  data: Record<string, any>[] | string,
) {
  if (!data?.length || !Array.isArray(data)) return '#ffffff';

  const choroPethFillColor = ['match', ['get', 'municipality_code']];

  if (Array.isArray(data)) {
    data?.forEach((forecast: Record<string, any>) => {
      if (!choroPethFillColor.includes(forecast.municipality_code)) {
        choroPethFillColor.push(forecast.municipality_code);
        const fillColor = getColorForValue(forecast['current.precip_mm']);
        // let fillColor = null;
        // temperatureMapping.forEach(precipitationRange => {
        //   const current = forecast['current.temp_c'];
        //   // const current = forecast['current.precip_mm'];

        //   const { min, max, color } = precipitationRange;
        //   if (current > min && current <= max) {
        //     fillColor = color;
        //   }
        // });
        if (fillColor) choroPethFillColor.push(fillColor);
        else choroPethFillColor.push('#ffffff');
      }
    });
  }

  choroPethFillColor.push('#ffffff');

  return choroPethFillColor;
}

export function getChoropethForForecastPrecipitationOpenweather(
  data: Record<string, any>[] | string,
) {
  if (!data?.length || !Array.isArray(data)) return '#ffffff';

  const choroPethFillColor = ['match', ['get', 'municipality_code']];

  if (Array.isArray(data)) {
    data?.forEach((forecast: Record<string, any>) => {
      if (!choroPethFillColor.includes(forecast.municipality_code)) {
        choroPethFillColor.push(forecast.municipality_code);
        const fillColor = getPrecipitationColorForValue(forecast['rain.3h']);
        // let fillColor = null;
        // precipitationMapping.forEach(precipitationRange => {
        //   // const current = forecast['current.temp_c'];
        //   const current = forecast['current.precip_mm'];

        //   const { min, max, color } = precipitationRange;
        //   if (current > min && current <= max) {
        //     fillColor = color;
        //   }
        // });
        if (fillColor) choroPethFillColor.push(fillColor);
        else choroPethFillColor.push('#ffffff');
      }
    });
  }

  choroPethFillColor.push('#ffffff');

  return choroPethFillColor;
}

// Function to generate choropeth map
export function getChoropethForTemperature(
  data: Record<string, any>[] | string,
) {
  if (!data?.length || !Array.isArray(data)) return '#ffffff';

  const choroPethFillColor = ['match', ['get', 'municipality_code']];

  if (Array.isArray(data)) {
    data?.forEach((forecast: Record<string, any>) => {
      choroPethFillColor.push(forecast.fields.municipality_code[0]);
      let fillColor = null;
      temperatureMapping.forEach(temperatureRange => {
        const { fields } = forecast;
        const temp = fields['main.temp_max'];
        const { min, max, color } = temperatureRange;

        if (temp > min && temp <= max) {
          fillColor = color;
        }
      });

      if (fillColor) choroPethFillColor.push(fillColor);
      else choroPethFillColor.push('#ffffff');
    });
  }
  choroPethFillColor.push('#ffffff');

  return choroPethFillColor;
}

// Function to generate range choropeth colors
// export function getChoroPlethRange(
//   data: Record<string, any>,
//   initialColor: { r: number; g: number; b: number },
// ) {
//   console.log('🚦 ~ file: map.ts:86 ~ data:', data);
//   if (!Object.keys(data) || !data.max) return '#ffffff';

//   const { max } = data;

//   // initial array to match
//   let choroPethFillColor = ['match', ['get', 'value']];

//   const colorInterval = 5;
//   const numberOfColors = max / colorInterval;
//   const colors: string[] = [];

//   let r = initialColor.r || 0;
//   let g = initialColor.g || 0;
//   let b = initialColor.b || 0;

//   // To generate intermediate values of the array
//   for (let i = 0; i <= max; i += numberOfColors) {
//     colors.push((i + colorInterval).toString());

//     // Set b
//     if (b + colorInterval > 255) b = 255;
//     else b += colorInterval;

//     // Set g
//     if (b + colorInterval > 255) g += colorInterval;

//     // Set r
//     if (g + colorInterval > 255) {
//       // make sure the value of r is not greater that 255
//       if (r + colorInterval > 255) r = 255;
//       else r += colorInterval;
//     }

//     colors.push(`rgb(${r}, ${g}, ${b})`);
//   }

//   if (colors.length) choroPethFillColor = [...choroPethFillColor, ...colors];
//   else {
//     choroPethFillColor.push('0');
//     choroPethFillColor.push('#ffffff');
//   }
//   console.log(
//     '🚦 ~ file: map.ts:131 ~ choroPethFillColor:',
//     choroPethFillColor,
//   );

//   // default color
//   choroPethFillColor.push('#ffffff');
//   return choroPethFillColor;
// }

// Function to convert RGB to hexadecimal
function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

// Function to generate range choropleth colors
export function getChoroPlethRange(
  data: Record<string, any>,
  initialColor: { r: number; g: number; b: number },
) {
  if (!Object.keys(data) || (!data.max && !data.min)) return '#ffffff';

  const { min, max } = data;

  // initial array to match
  const choroPethFillColor = [
    'interpolate',
    ['linear'],
    ['to-number', ['get', 'value']],
    -Infinity,
    '#ff0000',
  ];

  const colorInterval = 5;
  const colors: any[] = [];

  let r = initialColor.r || 0;
  let g = initialColor.g || 0;
  let b = initialColor.b || 0;

  // To generate intermediate values of the array
  for (let i = min; i <= max; i += colorInterval) {
    colors.push(i);

    // Convert RGB values to hexadecimal
    const hexColor = rgbToHex(r, g, b);
    colors.push(hexColor);

    // Increment RGB values (Modify these calculations for desired colors)
    r = Math.floor(((i - min) / (max - min)) * 255);
    g = 50; // Adjust this value accordingly for green
    b = 200; // Adjust this value accordingly for blue
  }

  if (colors.length) {
    choroPethFillColor.push(...colors);
  }

  return choroPethFillColor;
}

export function getLegendObject(array: any[]): Record<string, any> {
  const splicedArray = array.splice(3);

  const obj: Record<string, any> = {};
  const len = splicedArray.length;
  for (let i = 0; i <= len; i += 2) {
    const value = splicedArray.pop();
    const key = splicedArray.pop();
    if (key === null) {
      obj['-1'] = value;
    }
    obj[key] = value;
  }
  return obj;
}

export function getTempColorForValue(value: number): string {
  const colorObj = colorRanges.find(
    clr => Number(value) >= clr.min && Number(value) < clr.max,
  );

  return colorObj?.color || '#d4d4d4';

  // for (let i = 0; i < tempColorRanges.length - 1; i++) {
  //   const range = tempColorRanges[i];
  //   const nextRange = tempColorRanges[i + 1];
  //   if (value >= range.min && value < nextRange.min) {
  //     const factor = (value - range.min) / (nextRange.min - range.min);
  //     return interpolateColor(range.color, nextRange.color, factor);
  //   }
  // }
  // // Return the last range color if value exceeds all ranges
  // return tempColorRanges[0].color;
}
