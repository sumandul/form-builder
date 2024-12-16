/* eslint-disable no-unused-vars */
import { getMunicipality } from '@Services/common';
import ComboBox from '@Components/RadixComponents/ComboBox';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import Icon from '@Components/common/Icon';

interface IMunicipalFilter {
  value: number | null;
  onChange: (value: number) => void;
  handleReset: () => void;
}

const MunicipalFilter = ({
  value,
  onChange,
  handleReset,
}: IMunicipalFilter) => {
  const { data: municipalOptions } = useQuery({
    queryKey: ['get-municipality-list'],
    queryFn: getMunicipality,
    select: res =>
      res.data.map((municipal: Record<string, any>) => ({
        id: municipal.id,
        label: municipal.name,
        value: municipal.code,
      })),
  });
  return (
    <div className="absolute right-44 top-3 z-20 flex items-center justify-center gap-x-3">
      {value && (
        <div title="Reset Municipality">
          <Icon
            name="restart_alt"
            className="rounded-md border border-gray-400 bg-white p-1 hover:bg-gray-200"
            onClick={handleReset}
          />
        </div>
      )}
      <div className="w-[8rem]">
        <ComboBox
          options={municipalOptions}
          value={value || ''}
          onChange={onChange}
          choose="value"
          className="!w-[8rem]"
          dropDownSize="drop-md"
        />
      </div>
    </div>
  );
};

export default MunicipalFilter;
