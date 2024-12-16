/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getMapCategory, patchLayerCategory } from '@Services/adminDashboard';
import { convertJsonToFormData, shiftObjects } from '@Utils/index';
import Collapse, { CollapseSkeleton } from './Collapse';

type IDraggableRowsTableProps = { searchText?: string };

export default function DraggableRowsTable({
  searchText,
}: IDraggableRowsTableProps) {
  const [from, setFrom] = useState<Record<string, any>>({});
  const [to, setTo] = useState<Record<string, any>>({});
  const [processedCatagoryData, setProcessedCatagoryData] = useState<
    Record<string, any>[]
  >([]);

  const { mutate } = useMutation({
    mutationKey: ['patch-layer-category'],
    mutationFn: patchLayerCategory,
  });

  const { isLoading } = useQuery({
    queryKey: ['get-map-category', searchText],
    queryFn: () => getMapCategory({ ordering: 'order' }),
    select: response => response.data,
    onSuccess: response => setProcessedCatagoryData(response),
  });

  useEffect(() => {
    if (from.index === to.index) return;
    setProcessedCatagoryData(prev => {
      const newArray = shiftObjects(prev, {
        fromIndex: from.index,
        toIndex: to.index,
      });
      const formDataArray = convertJsonToFormData({
        is_subcategory: false,
        category_id: newArray.map(subCategory => subCategory.id),
      });
      mutate({ id: prev[0].id, formData: formDataArray });
      return [...newArray];
    });
  }, [to]);

  return (
    <div className="scrollbar table overflow-x-auto">
      <div className="content w-full">
        <div className="flex w-full">
          <div className="flex w-20 items-center justify-center gap-2 bg-primary-500 p-3 text-white">
            <p>SN</p>
          </div>
          <div className="flex flex-1 items-center gap-2 bg-primary-500 p-3 text-white">
            <p>Category</p>
          </div>
          <div className="flex w-20 items-center justify-center gap-2 bg-primary-500 p-3 text-white">
            <p />
          </div>
        </div>
        <div className="axatw-flex flex-col border border-gray-300 p-2">
          <div className="canvas w-full">
            {isLoading
              ? [...Array.from({ length: 6 })].map((_item, index) => (
                  <CollapseSkeleton key={index} />
                ))
              : processedCatagoryData?.map(
                  (category: Record<string, any>, index: number) => {
                    return (
                      <Collapse
                        key={category.id}
                        category={category}
                        index={index}
                        setFrom={setFrom}
                        setTo={setTo}
                      />
                    );
                  },
                )}
            {}
          </div>
        </div>
      </div>
    </div>
  );
}
