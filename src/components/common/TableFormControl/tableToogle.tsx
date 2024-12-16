import React, { useEffect, useState } from 'react';
import NewFormControl from '../FormUI/NewFormControl';

const TableToogle = ({ id, onChange, selectedValue }: any) => {
  const [isEmailAutoSend, setisEmailAutoSend] = useState<boolean>(true);

  const handleThresholdChange = (updatedValue: boolean) => {
    setisEmailAutoSend(updatedValue);
    if (onChange) {
      onChange(updatedValue);
    }
  };

  useEffect(() => {
    setisEmailAutoSend(selectedValue);
  }, [selectedValue]);

  return (
    <div>
      <span>
        <NewFormControl
          id={id}
          controlType="toggle"
          label=""
          bindvalue={!!isEmailAutoSend}
          checked={!!isEmailAutoSend}
          choose="value"
          onChange={data => handleThresholdChange(data)}
        />
      </span>
    </div>
  );
};

export default TableToogle;
