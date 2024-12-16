import capitalizeFirstLetter from '@Utils/capitalizeFirstLetter';

export default function prepareDropdownOptions(
  data: Record<string, any>,
  { labelKey, valueKey } = { labelKey: 'label', valueKey: 'value' },
) {
  return data.map((item: string | number) => ({
    [labelKey]: Number.isNaN(item)
      ? item
      : capitalizeFirstLetter(item.toString()),
    [valueKey]: item,
  }));
}
