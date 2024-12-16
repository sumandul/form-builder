/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */

import { mixed, object, string } from 'yup';
import { getFileExtension } from '@xmanscript/utils';
import { isEmail } from '@Utils/index';
import isEmpty from '@Utils/isEmpty';

export const addPDFFormValidation = object({
  title: string().required('PDF Title is Required.'),
  description: string().required('Description is Required.'),
  pdf_file: mixed()
    .required('PDF File is Needed.')
    // @ts-ignore
    .test({
      message: 'File Extension Doesnot Match',
      test: (arr: any) => {
        const extension = getFileExtension(arr[0].fileObject.name);
        return ['pdf'].includes(extension || '');
      },
    }),
});

// object({
//   name_en: string().required(''),
//   category: string().required('Category is Required.'),
//   subcategory: string().required('Sub Category is Required.'),
//   file_upload: mixed()
//     .required('File is Needed.')
//     // @ts-ignore
//     .test({
//       message: 'File extension doesnot match.',
//       test: (arr: any) => {
//         const extension = getFileExtension(arr[0].fileObject.name);
//         return ['shp', 'csv', 'geojson', 'zip'].includes(extension || '');
//       },
//     }),
// });
export const addVectorLayerFormValidation = (values: Record<string, any>) => {
  const errorObject: Record<string, any> = {};
  const {
    name_en,
    category,
    subcategory,
    detail,
    file_upload,
    long_field,
    lat_field,
  } = values;
  if (!name_en) errorObject.name_en = 'Layer Name is Required.';
  if (!category) errorObject.category = 'Category is Required.';
  if (!subcategory) errorObject.subcategory = 'SubCategory is Required.';
  if (!detail) errorObject.detail = 'Layer Detail is Required';
  if (!file_upload) errorObject.file_upload = 'File is Required.';
  if (file_upload) {
    const extension = getFileExtension(file_upload[0].fileObject.name);

    if (!['shp', 'csv', 'geojson', 'zip'].includes(extension || '')) {
      errorObject.file_upload = "File extension doesn't match.";
    }
    if (extension === 'csv' && !long_field) {
      errorObject.long_field = 'Longitude attribute must be selected.';
    }
    if (extension === 'csv' && !lat_field) {
      errorObject.lat_field = 'Latitude attribute must be selected.';
    }
  }
  return errorObject;
};

export const addRasterLayerFormValidation = (values: Record<string, any>) => {
  const {
    name_en,
    category,
    subcategory,
    published_date,
    raster_file,
    select_existing_layer,
    sld_file,
  } = values;
  const errorObject: Record<string, any> = {};
  if (!name_en) errorObject.name_en = 'Layer Name is required.';
  if (!select_existing_layer) {
    if (!category) errorObject.category = 'Category is required.';
    if (!subcategory) errorObject.subcategory = 'Sub Category is required.';
  }

  if (!published_date) errorObject.published_date = 'Date is Required.';
  if (!raster_file) errorObject.raster_file = 'File is required.';
  else {
    const extension = getFileExtension(raster_file[0].fileObject.name);
    if (!['tif', 'tiff', 'geotiff'].includes(extension || '')) {
      errorObject.raster_file = 'File extension does not match.';
    }
  }
  if (!sld_file) errorObject.sld_file = 'File is required.';
  else {
    const extension = getFileExtension(sld_file[0].fileObject.name);
    if (!['sld'].includes(extension || '')) {
      errorObject.sld_file = 'File extension does not match.';
    }
  }
  return errorObject;
};

export const addWMSLayerFormValidation = (values: Record<string, any>) => {
  const errorObject: Record<string, any> = {};
  const {
    name_en,
    wmslayer_type,
    category,
    subcategory,
    select_existing_layer,
    url,
    published_date,
  } = values;
  if (!name_en) errorObject.name_en = 'Layer Name is Required.';
  if (!wmslayer_type) errorObject.wmslayer_type = 'WMS Layer Type is Required.';
  if (!url) errorObject.url = 'Url is Required.';
  if (!published_date && select_existing_layer)
    errorObject.published_date = 'Date is Required.';
  if (!select_existing_layer) {
    if (!category) errorObject.category = 'Category is Required.';
    if (!subcategory) errorObject.subcategory = 'Subcategory is Required.';
  }
  return errorObject;
};

export const signinFormValidation = object({
  email: string()
    .email('Please enter a valid email address')
    .required('Email is Required.'),
  password: string().required('Password is Required.'),
});

export const resetPasswordFormValidation = object({
  email: string()
    .email('Please enter a valid email address')
    .required('Email is Required.'),
});

export const emailChannelFormValidation = object({
  threshold: string().required('Threshold is Required.'),
  subject: string().required('Subject is Required.'),
  description: string().required('Threshold is Required.'),
});

// export const

export function addUserFormValidation(values: Record<string, any>) {
  const errorObject: Record<string, any> = {};
  const { username, role_type, designation, image, email } = values;
  if (!username) errorObject.username = 'Username is required.';
  if (email) {
    if (!isEmail(email)) errorObject.email = 'Valid email is required.';
  } else {
    errorObject.email = 'Email is required.';
  }
  // if (!description) errorObject.description = 'Description is required.';
  if (!role_type) errorObject.role_type = 'Role is required.';
  if (!designation) errorObject.designation = 'Designation is required.';
  if (image?.length) {
    if (image[0].fileObject) {
      const extension = getFileExtension(image[0].fileObject?.name);
      if (!['jpg', 'jpeg', 'png'].includes(extension || ''))
        errorObject.image = "Image extension doen't match.";
    }
  } else {
    errorObject.image = 'Image is required.';
  }

  return errorObject;
}

export function alertThresholdValidation(values: Record<string, any>) {
  const errorObject: Record<string, any> = {};
  const weatherSourcesNeedingMunicipalities = [
    'windy',
    'hkh_weather_data',
    'weatherapi_forecast',
  ];
  const {
    layer,
    statistics,
    threshold_value,
    threshold_operator,
    alert_type,
    description,
    is_active,
    selectedTab,
    parameter,
    // date,
    // weather_statistics,
    weather_municipality_codes,
    weather_threshold_value,
    weather_alert_type,
    weather_threshold_operator,
    weather_title,
    stations,
    weather_description,
    weather_is_active,
    thresholdsList,
    weather_source,
  } = values;
  if (selectedTab === 'layer') {
    if (!layer) errorObject.layer = 'Layer is required.';
    if (!statistics) errorObject.statistics = 'Statistics is required.';
    if (!threshold_value)
      errorObject.threshold_value = 'Threshold value is required.';
    if (!alert_type) errorObject.alert_type = 'Alert type is required.';
    if (!threshold_operator)
      errorObject.threshold_operator = 'Threshold operator is required.';
    // if (!title) errorObject.title = 'Message is required.';
    if (!description) errorObject.description = 'Description is required.';
    if (!is_active) errorObject.is_active = 'Status is required.';
    if (stations)
      errorObject.stations = 'weather_municipality_codes is required.';
  } else {
    if (!weather_source)
      errorObject.weather_source = 'Weather Source is required.';
    if (parameter !== 'precipitation' && !weather_threshold_value)
      errorObject.weather_threshold_value = 'Threshold value is required.';

    if (parameter === 'precipitation' && isEmpty(thresholdsList))
      errorObject.precipitation_threshold_value =
        'Threshold value is required.';
    if (weather_source === 'hydrology_rainfall' && isEmpty(stations)) {
      errorObject.stations = 'stations is required.';
    }
    if (
      weatherSourcesNeedingMunicipalities.includes(weather_source) &&
      isEmpty(weather_municipality_codes)
    ) {
      errorObject.weather_municipality_codes = 'Municipality is required.';
    }

    if (!weather_alert_type)
      errorObject.weather_alert_type = 'Alert type is required.';
    if (!weather_threshold_operator)
      errorObject.weather_threshold_operator =
        'Threshold operator is required.';
    if (!weather_title) errorObject.weather_title = 'Message is required.';
    if (!weather_description)
      errorObject.weather_description = 'Description is required.';
    if (!weather_is_active)
      errorObject.weather_is_active = 'Status is required.';
  }
  return errorObject;
}

export function addAnalyticsDataValidator(values: Record<string, any>) {
  const errorObject: Record<string, any> = {};
  const {
    layer,
    title,
    description,
    statistics,
    threshold_value,
    graph_type,
    selectedTab,
    weather_layer,
    weather_title,
    weather_description,
    weather_statistics,
    weather_threshold_value,
    weather_graph_type,
    weather_source,
    parameter,
  } = values;

  // console.log(values, 'values');

  if (selectedTab === 'layer') {
    if (!layer) errorObject.layer = 'Analytics parameter must be selected.';
    if (!title) errorObject.title = 'Title of chart is required.';
    if (!description)
      errorObject.description = 'Description of chart is required.';
    if (!statistics)
      errorObject.statistics = 'Statistics of chart is required.';
    if (!threshold_value)
      errorObject.threshold_value = 'Threshold value is required.';
    if (!graph_type) errorObject.graph_type = 'Graph type value is required.';
  } else {
    if (!weather_source)
      errorObject.weather_source = 'Weather source must be selected.';
    if (!parameter) errorObject.parameter = 'Parameter is required.';
    if (!weather_layer)
      errorObject.weather_layer = 'Analytics parameter must be selected.';
    if (!weather_title)
      errorObject.weather_title = 'Title of chart is required.';
    if (!weather_description)
      errorObject.weather_description = 'Description of chart is required.';
    if (!weather_statistics)
      errorObject.weather_statistics = 'Statistics of chart is required.';
    if (!weather_threshold_value)
      errorObject.weather_threshold_value = 'Threshold value is required.';
    if (!weather_graph_type)
      errorObject.weather_graph_type = 'Graph type value is required.';
  }
  return errorObject;
}

export function addCategoryValidator(values: Record<string, any>) {
  const errorObject: Record<string, any> = {};
  const { name_en, details } = values;
  if (!name_en) errorObject.name_en = 'Category name is required.';
  if (!details) errorObject.details = 'Category description is required.';
  return errorObject;
}

export function addSubCategoryValidator(values: Record<string, any>) {
  const errorObject: Record<string, any> = {};
  const { category, name_en, details } = values;
  if (!category) errorObject.category = 'Category Must be Selected.';
  if (!name_en) errorObject.name_en = 'Sub Category name is required.';
  if (!details) errorObject.details = 'Category description is required.';
  return errorObject;
}

export function editLayerFormValidator(values: Record<string, any>) {
  const errorObject: Record<string, any> = {};
  const { name_en, category, subcategory } = values;
  if (!name_en) errorObject.name_en = 'Layer name is required.';
  if (!category) errorObject.category = 'Category is required.';
  if (!subcategory) errorObject.subcategory = 'Subcategory is required.';
  return errorObject;
}

export function layerInfoValidation(values: Record<string, any>) {
  const errorObject: Record<string, any> = {};
  const { layer_id } = values;
  if (!layer_id) errorObject.layer_id = 'Please select a layer.';
  // if (!attribute_legend.value?.length)
  //   errorObject.attribute_legend = 'No items selected.';
  // if (!external_attribute_legend.value?.length)
  //   errorObject.external_attribute_legend = 'No items selected.';
  return errorObject;
}

export const emailUserValidation = object({
  email: string()
    .email('Please enter a valid email address')
    .required('Email is Required.'),
  username: string().required('Username is Required.'),
});
