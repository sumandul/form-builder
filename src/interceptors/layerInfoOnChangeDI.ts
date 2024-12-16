import { removeObjectFromArray } from '@xmanscript/utils';

/* eslint-disable camelcase */
export default function layerInfoOnChangeDI(props: Record<string, any>) {
  const { currentValues } = props;

  const newValues = { ...currentValues };
  const {
    attribute_item,
    attribute_legend,
    external_attribute_item,
    external_attribute_legend,
  } = newValues;

  // shift from attribures to legend
  if (attribute_item.tag === 'right_one') {
    newValues.attribute_legend.value = [
      ...new Set([
        ...newValues.attribute_item.selected,
        ...attribute_legend.value,
      ]),
    ];

    // remove the selected items from the value
    newValues.attribute_item.value = newValues.attribute_item.selected?.reduce(
      (acc: Record<string, any>[], item: Record<string, any>) => {
        return removeObjectFromArray(acc, item);
      },
      [...attribute_item.value],
    );

    // reset the tag
    newValues.attribute_item.tag = undefined;
  }

  if (attribute_item.tag === 'right_all') {
    newValues.attribute_legend.value = [
      ...new Set([
        ...newValues.attribute_item.value,
        ...attribute_legend.value,
      ]),
    ];
    // remove the selected items from the value
    newValues.attribute_item.value = [];

    // reset the tag
    newValues.attribute_item.tag = undefined;
  }

  if (attribute_legend.tag === 'left_one') {
    newValues.attribute_item.value = [
      ...new Set([
        ...newValues.attribute_legend.selected,
        ...attribute_item.value,
      ]),
    ];

    // remove the selected items from the value
    newValues.attribute_legend.value =
      newValues.attribute_legend.selected?.reduce(
        (acc: Record<string, any>[], item: Record<string, any>) => {
          return removeObjectFromArray(acc, item);
        },
        [...attribute_legend.value],
      );

    // reset the tag
    newValues.attribute_legend.tag = undefined;
  }

  if (attribute_legend.tag === 'left_all') {
    newValues.attribute_item.value = [
      ...new Set([
        ...newValues.attribute_legend.value,
        ...attribute_item.value,
      ]),
    ];

    // remove the selected items from the value
    newValues.attribute_legend.value = [];

    // reset the tag
    newValues.attribute_legend.tag = undefined;
  }

  // ** for external_attributes **

  // shift from attribures to legend
  if (external_attribute_item.tag === 'right_one') {
    newValues.external_attribute_legend.value = [
      ...new Set([
        ...newValues.external_attribute_item.selected,
        ...external_attribute_legend.value,
      ]),
    ];

    // remove the selected items from the value
    newValues.external_attribute_item.value =
      newValues.external_attribute_item.selected?.reduce(
        (acc: Record<string, any>[], item: Record<string, any>) => {
          return removeObjectFromArray(acc, item);
        },
        [...external_attribute_item.value],
      );

    // reset the tag
    newValues.external_attribute_item.tag = undefined;
  }

  if (external_attribute_item.tag === 'right_all') {
    newValues.external_attribute_legend.value = [
      ...new Set([
        ...newValues.external_attribute_item.value,
        ...external_attribute_legend.value,
      ]),
    ];
    // remove the selected items from the value
    newValues.external_attribute_item.value = [];

    // reset the tag
    newValues.external_attribute_item.tag = undefined;
  }

  if (external_attribute_legend.tag === 'left_one') {
    newValues.external_attribute_item.value = [
      ...new Set([
        ...newValues.external_attribute_legend.selected,
        ...external_attribute_item.value,
      ]),
    ];

    // remove the selected items from the value
    newValues.external_attribute_legend.value =
      newValues.external_attribute_legend.selected?.reduce(
        (acc: Record<string, any>[], item: Record<string, any>) => {
          return removeObjectFromArray(acc, item);
        },
        [...external_attribute_legend.value],
      );

    // reset the tag
    newValues.external_attribute_legend.tag = undefined;
  }

  if (external_attribute_legend.tag === 'left_all') {
    newValues.external_attribute_item.value = [
      ...new Set([
        ...newValues.external_attribute_legend.value,
        ...external_attribute_item.value,
      ]),
    ];

    // remove the selected items from the value
    newValues.external_attribute_legend.value = [];

    // reset the tag
    newValues.external_attribute_legend.tag = undefined;
  }

  return newValues;
}
