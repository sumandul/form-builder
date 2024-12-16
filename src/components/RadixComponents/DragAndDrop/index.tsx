/* eslint-disable no-unused-vars */

import { cn } from '@Utils/index';
import { ChangeEvent, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  IFileDataObject,
  IRegisterProps,
} from '@Components/common/MapComponents/Schemas';
import Icon from '@Components/common/Icon';
import PreviewFiles from './PreviewFiles';

interface IUploadProps extends Partial<IRegisterProps> {
  customFn?: () => void;
}

export default function DragAndDrop({
  uniquename,
  onChange,
  className,
  multiple = false,
  bindvalue,
  customFn,
  id,
  placeholder,
  disabled,
  accept = '',
}: IUploadProps) {
  const [files, setFiles] = useState<IFileDataObject[]>([]);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles: IFileDataObject[] = [];

    if (e.target.files)
      // eslint-disable-next-line no-restricted-syntax
      for (const file of e.target.files) {
        uploadedFiles.push({ id: uuidv4(), name: file.name, fileObject: file });
      }
    setFiles(uploadedFiles);
    if (onChange) onChange(uploadedFiles);
  };

  const handleFileDelete = (fileToDelete: File) => {
    if (files) {
      const updatedFiles = Array.from(files).filter(
        (file: any) => file !== fileToDelete,
      );
      setFiles(updatedFiles);
      if (onChange) onChange(updatedFiles);
    }
  };

  useEffect(() => {
    setFiles(bindvalue);
  }, [bindvalue]);

  return (
    <div
      id={id}
      className={cn(
        'flex w-full flex-col gap-4 transition-all duration-100 ease-in-out',
        className,
      )}
      style={{ pointerEvents: disabled ? 'none' : 'all' }}
    >
      {/* {files && files.length ? ( */}
      {/* // ) : ( */}
      <label
        htmlFor={uniquename}
        className="flex min-h-[1.25rem] cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed p-3 font-bold "
      >
        <Icon name="backup" className="text-blue-500" />
        <span className="text-sm text-tooltip font-normal ">
          {placeholder || 'Drag and Drop Files Here.'}
        </span>
        <input
          key={uuidv4()}
          type="file"
          id={uniquename}
          className="hidden"
          name={uniquename}
          onChange={handleFileChange}
          multiple={multiple}
          accept={accept}
        />
      </label>
      {PreviewFiles({ files, handleFileDelete, customDeleteFn: customFn })}
      {/* )} */}
    </div>
  );
}
