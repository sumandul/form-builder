import React, { useState } from 'react';
import NewFormControl from '../FormUI/NewFormControl';

const TableDropDown = ({ id, options, onChange, selectedOption }: any) => {
  const [selectedThreshold, setSelectedThreshold] =
    useState<string[]>(selectedOption);

  const handleThresholdChange = (updatedValue: string[]) => {
    setSelectedThreshold(updatedValue);
    if (onChange) {
      onChange(updatedValue);
    }
  };

  return (
    <div>
      <span>
        <NewFormControl
          id={id}
          controlType="multiSelect"
          label=""
          placeholder="Select"
          requiredControl
          selectedOptions={selectedThreshold}
          valueKey="id"
          options={options}
          onChange={data => handleThresholdChange(data)}
        />
      </span>
    </div>
  );
};

export default TableDropDown;
