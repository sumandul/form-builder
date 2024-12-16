/* eslint-disable no-unused-vars */
// import { removeComponentAnimation } from '@Animations/index';
import { HTMLAttributes, useState } from 'react';
import { cn } from '@Utils/index';
import format from 'date-fns/format';
import { motion } from 'framer-motion';
import { IFileDataObject } from '@Components/common/MapComponents/Schemas';
import Icon from '@Components/common/Icon';
import PortalTemplate from '@Components/common/PortalTemplate';
import DeleteConfirmationOverlay from '@Components/PortalOverlays/DeleteConfirmationOverlay';
import Skeleton from '../Skeleton';
import { Button } from '../Button';
// import { SyncLoader } from 'react-spinners';
// import { useQueryClient } from 'react-query';

const defaultImageUrl =
  'https://static.vecteezy.com/system/resources/previews/000/420/681/original/picture-icon-vector-illustration.jpg';

interface IFileCardProps extends HTMLAttributes<HTMLDivElement> {
  file: IFileDataObject;
  handleFileDelete?: (x: any) => void;
  index?: number;
  previewFile?: boolean;
  canEditFile?: boolean;
}

export default function FileCard({
  file,
  className,
  handleFileDelete,
  index = 0,
  previewFile = false,
  canEditFile = false,
}: IFileCardProps) {
  // const queryClient = useQueryClient();
  const [viewPreview, setViewPreview] = useState<boolean>(false);
  const [confirmDelete, setConfirmDetele] = useState<boolean>(false);

  // const { mutate: deleteDocument, ...deleteFileStatus } = ProjectDocumentService.hardDeleteData(
  //   (file?.id as string) || '',
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ['get_project_document'] });
  //     },
  //   },
  // );

  return (
    <>
      <div className="overflow-hidden rounded-lg transition-all duration-500">
        <motion.div
          // {...removeComponentAnimation}
          initial={{ opacity: 0, transform: 'translateX(-50%)' }}
          animate={{ opacity: 1, transform: 'translateX(0%)' }}
          exit={{
            opacity: 1,
            transform: 'translateX(-100%)',
            background: '#EFBDBD',
            transition: { delay: 0 },
          }}
          transition={{ duration: 0.2, ease: 'easeOut', delay: index * 0.1 }}
          className={cn(
            'flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2',
            className,
          )}
        >
          <div className="info flex flex-1 items-center gap-3">
            <img
              src={file.document || defaultImageUrl}
              alt="pdf thumbnail"
              className="h-[3.875rem] w-[3.875rem]"
            />
            <div className="description flex flex-col items-start justify-center">
              {!file.fileObject ? (
                <p className="body-md text-gray-800">{file.name}</p>
              ) : (
                <p className="body-md text-gray-800">{file.name}</p>
              )}
              {!file.fileObject ? (
                <div className="meta flex gap-1">
                  {/* <p className="tooltip text-blue-500">A02</p> */}
                  {file.date_created && (
                    <p className="body-sm text-gray-600">
                      Uploaded on{' '}
                      {file.date_created
                        ? format(new Date(file.date_created), 'dd/MM/yyyy')
                        : '-'}
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </div>
          <div className="actions flex items-center justify-center gap-3">
            {/* {!file.fileObject ? (
              <Button
                type="button"
                variant="link"
                className="!px-0 font-bold"
                onClick={() => {
                  if (previewFile) setViewPreview(true);
                }}
              >
                View&nbsp;Document
              </Button>
            ) : null} */}
            {!file.fileObject ? (
              <a href={file.document} target="_blank" rel="noreferrer" download>
                <Button type="button" variant="icon-primary" size="sm-icon">
                  <Icon name="download" className="m-0 p-0 text-gray-600" />
                </Button>
              </a>
            ) : null}

            <Button
              type="button"
              variant="icon-primary"
              size="sm-icon"
              onClick={() => {
                setConfirmDetele(true);
                // deleteDocument();
                if (handleFileDelete) handleFileDelete(file);
              }}
            >
              {/* {deleteFileStatus.isLoading ? (
                <SyncLoader
                  color="#484848"
                  speedMultiplier={2}
                  size={5}
                  margin={2}
                />
              ) : (
              )} */}
              <Icon
                name="delete"
                className="text-other-red m-0 p-0 text-others-rejected"
              />
            </Button>
          </div>
        </motion.div>
      </div>
      {/* {viewPreview && (
        <PortalTemplate>
          <DocumentPreviewOverlay
            canEditFile={canEditFile}
            onClose={() => {
              setViewPreview(false);
            }}
            file={file || {}}
          />
        </PortalTemplate>
      )} */}
      {/* {confirmDelete && (
        <PortalTemplate>
          <DeleteConfirmationOverlay
            onCancel={() => {
              setConfirmDetele(false);
            }}
            // onDelete={() => {
            //   if (!file.fileObject) deleteDocument();
            //   if (handleFileDelete) handleFileDelete(file);
            // }}
          />
        </PortalTemplate>
      )} */}
    </>
  );
}

export function FileCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg transition-all duration-500">
      <motion.div
        // {...removeComponentAnimation}
        initial={{ opacity: 0, transform: 'translateY(-50%)' }}
        animate={{ opacity: 1, transform: 'translateY(0%)' }}
        exit={{
          opacity: 1,
          transform: 'translateY(-100%)',
          background: '#EFBDBD',
          transition: { delay: 0 },
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={cn(
          'flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2',
        )}
      >
        <div className="info flex w-3/5 items-center gap-3">
          <Skeleton className="h-[25px] w-[25px] items-center justify-center rounded-full border p-2 text-center" />
          <div className="description flex w-2/3 flex-col items-start justify-center gap-1">
            <Skeleton className="body-md w-full bg-gray-300 text-gray-800" />
            <div className="meta flex w-full gap-1">
              <Skeleton className="h-2 w-1/5" />
              <Skeleton className="h-2 w-4/5" />
            </div>
          </div>
        </div>
        <div className="actions flex w-2/5 items-center justify-center gap-3 ">
          <Skeleton className="w-3/5 border  p-2 text-center" />
          <Skeleton className="w-1/5 border  p-2 text-center" />
          <Skeleton className="w-1/5 border  p-2 text-center" />
        </div>
      </motion.div>
    </div>
  );
}
