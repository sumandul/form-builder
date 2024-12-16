/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import DeleteConfirmationOverlay from '@Components/PortalOverlays/DeleteConfirmationOverlay';
import { Button } from '@Components/RadixComponents/Button';
import Skeleton from '@Components/RadixComponents/Skeleton';
import Icon from '@Components/common/Icon';
import PortalTemplate from '@Components/common/PortalTemplate';
import { deletePDf, downloadPDF } from '@Services/pdf';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';

export default function PDFCard({ PDFFile }: { PDFFile: Record<string, any> }) {
  const [confirmationPortal, setConfirmDelete] = useState(false);
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationKey: ['delete-pdf', PDFFile.uuid],
    mutationFn: () => deletePDf(PDFFile.uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-pdf-list'] });
    },
  });

  const { mutate: downloadPdf, ...pdfDownloadState } = useMutation({
    mutationKey: ['download-pdf', PDFFile.uuid],
    mutationFn: downloadPDF,
  });

  return (
    <>
      {/* <a
        href="https://ncu.rcnpv.com.tw/Uploads/20131231103232738561744.pdf"
        target="_blank"
        rel="noreferrer"
        onClick={e => e.stopPropagation()}
      > */}
      <div
        // role="button"
        className="group h-[379px] w-full min-w-[15rem] max-w-[279px] cursor-pointer overflow-hidden
            rounded-xl border-2 border-gray-200 transition-all duration-150 hover:shadow-md"
        onClick={() => {
          window.open(PDFFile.pdf_file);
        }}
      >
        <div className="h-[13.125rem] overflow-hidden">
          <img
            alt="Thumbnail"
            src={
              PDFFile.thumbnail ||
              'https://3.bp.blogspot.com/-gVyRRhkNgAs/ViDuoCWYwuI/AAAAAAAA5Ww/Z8KU6T9nYRw/s1600/Beautiful-Nature-Wallpapers-For-Desktop-Hd-Hd-1080P-12-HD-Wallpapers.jpg'
            }
            className="mb-2 h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="content flex h-[179px] flex-col  gap-1 p-[1rem]">
          <div className="title h-fit">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <h6 className="line-clamp-1 text-left">{PDFFile?.title}</h6>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-full max-w-[15rem] rounded-xl bg-gray-600 p-2 text-[0.875rem] text-white">
                    {PDFFile?.title}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="line-clamp-3 text-[0.875rem]">
                    {PDFFile?.description}
                  </p>
                </TooltipTrigger>
                <TooltipContent className="mb-7 w-full">
                  <p className="w-full max-w-[15rem] rounded-xl bg-gray-600 p-2 text-[0.875rem] text-white">
                    {PDFFile?.description}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="actions flex h-full w-full items-end justify-end gap-[0.5rem] pb-2">
            <Button
              onClick={(e: any) => {
                e.stopPropagation();
                setConfirmDelete(true);
              }}
              variant="link"
              className="!h-9 !text-others-rejected hover:!bg-others-rejected hover:!text-white"
            >
              DELETE
            </Button>
            <Button
              onClick={(e: any) => {
                e.stopPropagation();
                downloadPdf({ uuid: PDFFile?.uuid, fileName: PDFFile.title });
              }}
              variant="outline"
              size="sm-icon"
              className="!flex !h-9 !items-center !justify-center !gap-1"
            >
              {pdfDownloadState.isLoading ? 'DOWNLOADING...' : 'DOWNLOAD'}
              <Icon name="file_download" className="pt-1" />
            </Button>
          </div>
        </div>
      </div>
      {/* </a> */}
      {confirmationPortal && (
        <PortalTemplate>
          <DeleteConfirmationOverlay
            onCancel={() => setConfirmDelete(false)}
            onConfirm={() => mutate(PDFFile.uuid)}
            isLoading={isLoading}
          />
        </PortalTemplate>
      )}
    </>
  );
}

export function PDFCardSkeleton() {
  return (
    <>
      <div
        className="group h-fit w-full min-w-[15rem] max-w-[279px] cursor-pointer overflow-hidden
            rounded-xl border-2 border-gray-200 transition-all duration-150 hover:shadow-md"
      >
        <Skeleton className="h-[13.125rem] w-full overflow-hidden" />
        <div className="content flex h-1/2 flex-col gap-5 p-[1rem]">
          <div className="title">
            <Skeleton className="line-clamp-1 h-5" />
            <Skeleton className="mt-2 h-[3rem] text-[0.875rem]" />
          </div>
          <div className="actions flex w-full items-center justify-end gap-[0.5rem]">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-7 w-24" />
          </div>
        </div>
      </div>
      {/* </a> */}
    </>
  );
}
