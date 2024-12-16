/* eslint-disable no-unused-vars */

import { AnimatePresence } from 'framer-motion';
import { IFileDataObject } from '@Components/common/MapComponents/Schemas';
import hasErrorBoundary from '@Components/common/hasErrorBoundary';
import FileCard, { FileCardSkeleton } from './FileCard';

interface IPreviewFilesProps {
  files: IFileDataObject[];
  handleFileDelete?: (x: any) => void;
  previewFiles?: boolean;
  canEditFile?: boolean;
  isLoading?: boolean;
  customDeleteFn?: () => void;
}

function PreviewFiles({
  files,
  handleFileDelete,
  previewFiles = false,
  canEditFile = false,
  isLoading,
  customDeleteFn,
}: IPreviewFilesProps) {
  const handleOverallFileDelete = (receivedFile: IFileDataObject) => {
    if (handleFileDelete) handleFileDelete(receivedFile);
    if (customDeleteFn) customDeleteFn();
  };
  if (isLoading)
    return (
      <div className="flex flex-col gap-1">
        <AnimatePresence>
          {[...Array(2)].map(index => (
            <FileCardSkeleton key={index} />
          ))}
        </AnimatePresence>
      </div>
    );
  if (files)
    return (
      <div className="flex w-full flex-col gap-1">
        <AnimatePresence>
          {files.map((file, index) => (
            <FileCard
              canEditFile={canEditFile}
              key={file.id}
              file={file}
              handleFileDelete={handleOverallFileDelete}
              index={index}
              previewFile={previewFiles}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  return null;
}
export default hasErrorBoundary(PreviewFiles);
