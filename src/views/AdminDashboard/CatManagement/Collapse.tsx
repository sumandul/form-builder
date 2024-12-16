/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Icon from '@Components/common/Icon';
import { useEffect, useState } from 'react';
import { motion as m } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteLayerCategory,
  deleteSubCategory,
  getLayerSubCategory,
  patchSubLayer,
} from '@Services/adminDashboard';
import { convertJsonToFormData, shiftObjects } from '@Utils/index';
import PortalTemplate from '@Components/common/PortalTemplate';
import DeleteConfirmationOverlay from '@Components/PortalOverlays/DeleteConfirmationOverlay';
import { toast } from 'react-toastify';
import AddCategoryFormOverlay from '@Components/PortalOverlays/AddCategoryFormOverlay';
import AddSubCategoryFormOverlay from '@Components/PortalOverlays/AddSubCategoryFormOverlay';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import Skeleton from '@Components/RadixComponents/Skeleton';

export default function Collapse({ category, index, setTo, setFrom }: any) {
  const [isOpen, setIsOpen] = useState(true);
  const [draggable, setDraggable] = useState(false);

  const [processedSubCatagoryData, setProcessedSubCatagoryData] = useState<
    Record<string, any>[]
  >([]);

  const [isOpenAddCatagoryPortal, setIsOpenAddCatagoryPortal] = useState(false);
  const [isOpenAddSubCatagoryPortal, setIsOpenAddSubCatagoryPortal] =
    useState(false);

  const [editableCategory, setEditableCategory] = useState(null);
  const [editableSubCategory, setEditableSubCategory] = useState(null);

  const [deletableCategory, setDeletableCategory] = useState('');
  const [deletableSubCategory, setDeletableSubCategory] = useState('');

  useQuery({
    queryKey: ['get-sub-cat', category.id],
    queryFn: () =>
      getLayerSubCategory({ category: category?.id, ordering: 'order' }),
    select: response => response.data,
    onSuccess: response => {
      setProcessedSubCatagoryData(response);
    },
  });

  const [subFrom, setSubFrom] = useState<Record<string, any>>({});
  const [subTo, setSubTo] = useState<Record<string, any>>({});

  const { mutate } = useMutation({
    mutationKey: ['patch-sub-layer'],
    mutationFn: patchSubLayer,
  });

  useEffect(() => {
    if (subFrom.index === subTo.index) return;
    setProcessedSubCatagoryData(prev => {
      const newArray = shiftObjects(prev, {
        fromIndex: subFrom.index,
        toIndex: subTo.index,
      });
      const formDataArray = convertJsonToFormData({
        is_subcategory: true,
        category_id: newArray.map(subCategory => subCategory.id),
      });
      mutate({ id: category.id, formData: formDataArray });
      return [...newArray];
    });
  }, [subTo]);

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isConfirmDeleteSubCatOpen, setIsConfirmDeleteSubCatOpen] =
    useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteCategory, isLoading } = useMutation<
    any,
    unknown,
    any,
    unknown
  >({
    mutationFn: deleteLayerCategory,
    mutationKey: ['delete-category'],
    onSuccess: () => {
      setIsConfirmDeleteOpen(false);
      toast.success('Category deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['get-map-category'] });
    },
  });

  const { mutate: deleteSubCat, isLoading: isLoadingSubCategoryDelete } =
    useMutation<any, unknown, any, unknown>({
      mutationFn: deleteSubCategory,
      mutationKey: ['delete-sub-category'],
      onSuccess: () => {
        setIsConfirmDeleteSubCatOpen(false);
        toast.success('Sub-Category deleted successfully.');
        queryClient.invalidateQueries({ queryKey: ['get-map-category'] });
        queryClient.invalidateQueries({ queryKey: ['get-sub-cat'] });
      },
    });

  return (
    <>
      <div
        onDrop={e => {
          e.stopPropagation();
          setTo({ index, id: category.id });
        }}
        onDragOver={e => e.preventDefault()}
        className="h-full w-full"
      >
        <div className="flex flex-col transition-all duration-150">
          <div
            className={`top flex h-[2.5rem] select-none items-center justify-start border-b border-gray-100 hover:bg-gray-100 ${
              index !== 0 && 'border-t'
            }`}
            draggable={draggable}
            onDragStart={() => {
              setIsOpen(false);
              setFrom({ index, id: category.id });
            }}
          >
            <div
              className="drag-icon w-20"
              onMouseDown={() => {
                setDraggable(true);
              }}
              onMouseUp={() => {
                setDraggable(false);
              }}
            >
              <Icon name="drag_indicator" />
            </div>
            <span
              className={`flex flex-1 items-center gap-1 ${
                !processedSubCatagoryData.length ? 'pl-8' : 'pl-0'
              }`}
              onClick={() => {
                setIsOpen(prev => !prev);
              }}
            >
              {processedSubCatagoryData.length ? (
                <Icon
                  name={isOpen ? 'expand_less' : 'expand_more'}
                  className="mt-[.5rem] select-none"
                />
              ) : null}
              <p className="select-none">{category.name_en}</p>
            </span>
            <span className="actions flex items-center gap-2 pt-[.5rem]">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Icon name="info" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {category?.details && (
                      <p className="w-full max-w-[15rem] rounded-xl bg-gray-600 p-2 text-[0.875rem] text-white">
                        {category?.details}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Icon
                name="edit"
                onClick={() => {
                  setEditableCategory(category.id);
                  setIsOpenAddCatagoryPortal(true);
                }}
              />
              <Icon
                name="delete"
                className="text-others-rejected"
                onClick={() => {
                  setIsConfirmDeleteOpen(true);
                  setDeletableCategory(category.id);
                }}
              />
            </span>
          </div>
          {isOpen && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: '100%' }}
              transition={{ duration: 0.2 }}
              className="list flex flex-col "
            >
              {processedSubCatagoryData?.map((item: any, idx: any) => {
                return (
                  <div
                    key={item.id}
                    className="item h-[2.5rem] w-full select-none  items-center gap-2 border-b border-gray-100 text-[.875rem] font-normal text-gray-600 hover:bg-gray-100"
                    onDrop={e => {
                      e.stopPropagation();
                      setSubTo({ index: idx, id: item.id });
                    }}
                    onDragOver={e => e.preventDefault()}
                  >
                    <div
                      className="cover flex h-full w-full items-center"
                      draggable
                      onDragStart={() => {
                        setSubFrom({ index: idx, id: category.id });
                      }}
                    >
                      <div className=" flex items-center gap-1">
                        <span className=" px-4">
                          {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                        <Icon name="drag_indicator" />
                      </div>
                      <span className="flex-1 pl-12">{item.name_en}</span>
                      <span className="actions flex items-center gap-2 pt-[.5rem]">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Icon name="info" />
                            </TooltipTrigger>
                            <TooltipContent>
                              {item?.details && (
                                <p className="w-full max-w-[15rem] rounded-xl bg-gray-600 p-2 text-[0.875rem] text-white">
                                  {item?.details}
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Icon
                          name="edit"
                          onClick={() => {
                            setEditableSubCategory(item.id);
                            setIsOpenAddSubCatagoryPortal(true);
                          }}
                        />
                        <Icon
                          name="delete"
                          className="text-others-rejected"
                          onClick={() => {
                            setIsConfirmDeleteSubCatOpen(true);
                            setDeletableSubCategory(item.id);
                          }}
                        />
                      </span>
                    </div>
                  </div>
                );
              })}
            </m.div>
          )}
        </div>
      </div>
      {isOpenAddCatagoryPortal && (
        <PortalTemplate>
          <AddCategoryFormOverlay
            onCancel={() => {
              setIsOpenAddCatagoryPortal(false);
              setEditableCategory(null);
            }}
            id={editableCategory}
          />
        </PortalTemplate>
      )}
      {isConfirmDeleteOpen && (
        <PortalTemplate>
          <DeleteConfirmationOverlay
            title="Are you sure you want to delete this category?"
            onCancel={() => setIsConfirmDeleteOpen(false)}
            onConfirm={() => {
              deleteCategory(deletableCategory);
            }}
            isLoading={isLoading}
          />
        </PortalTemplate>
      )}
      {isConfirmDeleteSubCatOpen && (
        <PortalTemplate>
          <DeleteConfirmationOverlay
            title="Are you sure you want to delete this sub category?"
            onCancel={() => setIsConfirmDeleteSubCatOpen(false)}
            onConfirm={() => {
              deleteSubCat(deletableSubCategory);
            }}
            isLoading={isLoadingSubCategoryDelete}
          />
        </PortalTemplate>
      )}
      {isOpenAddSubCatagoryPortal && (
        <PortalTemplate>
          <AddSubCategoryFormOverlay
            onCancel={() => {
              setIsOpenAddSubCatagoryPortal(false);
              setEditableSubCategory(null);
            }}
            id={editableSubCategory}
          />
        </PortalTemplate>
      )}
    </>
  );
}

export function CollapseSkeleton() {
  return (
    <div className="item flex h-[2.5rem] w-full  items-center justify-between gap-2 border-b border-gray-100 font-normal text-gray-600 ">
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-8 flex-1" />
      <span className="actions flex items-center gap-2 pt-[.5rem]">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </span>
    </div>
  );
}
