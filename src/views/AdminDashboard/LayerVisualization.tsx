/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */

import {
  deleteRasterLayerDetail,
  deleteVectorLayerDetail,
  deleteWmsLayerDetail,
  getMapLayer,
} from '@Services/adminDashboard';
import PortalTemplate from '@Components/common/PortalTemplate';
import DeleteConfirmationOverlay from '@Components/PortalOverlays/DeleteConfirmationOverlay';
import { useMemo, useState } from 'react';
import Searchbar from '@Components/common/Searchbar';
import { Button } from '@Components/RadixComponents/Button';
import Icon from '@Components/common/Icon';
import DataTable from '@Components/common/DataTable';
import ToolTip from '@Components/RadixComponents/ToolTip';
import { FlexRow } from '@Components/common/Layouts';
import useWindowDimensions from '@Hooks/useWindowDimensions';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AddlayerOverlay from '@Components/PortalOverlays/AddLayerOverlay';
import EditLayerFormOverlay from '@Components/PortalOverlays/EditLayerFormOverlay';
import { useDispatch } from 'react-redux';
import { deleteLayerList } from '@Store/actions/mapActions';

export default function LayerVisualization() {
  const { width } = useWindowDimensions();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOpenEditLayerPortal, setIsOpenEditLayerPortal] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const [deletableLayer, setDeletableLayer] = useState<Record<string, any>>({});
  const [editableLayer, setEditableLayer] = useState<Record<string, any>>({});

  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { mutate: deleteVectorLayer, isLoading: isVectorLoaLoading } =
    useMutation<any, unknown, any, unknown>({
      mutationFn: deleteVectorLayerDetail,
      mutationKey: ['delete-vector-layer'],
      onSuccess: () => {
        setIsConfirmDeleteOpen(false);
        toast.success('Layer deleted successfully.');
        queryClient.invalidateQueries({
          queryKey: ['layer-data-list'],
        });

        // Manually delete the layer from the list as well
        dispatch(deleteLayerList(deletableLayer));
      },
    });
  const { mutate: deleteWmsLayer, isLoading: isWmsLoading } = useMutation<
    any,
    unknown,
    any,
    unknown
  >({
    mutationFn: deleteWmsLayerDetail,
    mutationKey: ['delete-wms-layer'],
    onSuccess: () => {
      setIsConfirmDeleteOpen(false);
      toast.success('Layer deleted successfully.');
      queryClient.invalidateQueries({
        queryKey: ['layer-data-list'],
      });

      // Manually delete the layer from the list as well
      dispatch(deleteLayerList(deletableLayer));
    },
  });
  const { mutate: deleteRasterLayer, isLoading: isRasterLoading } = useMutation<
    any,
    unknown,
    any,
    unknown
  >({
    mutationFn: deleteRasterLayerDetail,
    mutationKey: ['delete-raster-layer'],
    onSuccess: () => {
      setIsConfirmDeleteOpen(false);
      toast.success('Layer deleted successfully.');
      queryClient.invalidateQueries({
        queryKey: ['layer-data-list'],
      });

      // Manually delete the layer from the list as well
      dispatch(deleteLayerList(deletableLayer));
    },
  });

  const analyticsDataColumn = useMemo(() => {
    return [
      {
        header: 'S.N',
        accessorKey: 'layer',
        cell: (info: any) => info.row.index + 1,
      },
      {
        header: 'Layer Name',
        accessorKey: 'name_en',
      },
      {
        header: 'Category',
        accessorKey: 'category',
      },
      {
        header: 'Sub Category',
        accessorKey: 'subcategory',
      },
      {
        header: '',
        accessorKey: 'icon',
        cell: ({ row }: any) => (
          <FlexRow className="justify-around">
            <ToolTip
              name="edit"
              message="Edit"
              iconClick={() => {
                setIsOpenEditLayerPortal(true);
                setEditableLayer({
                  id: row?.original?.layer_id || null,
                  type: row?.original?.layer_type,
                });
              }}
            />

            <ToolTip
              name="delete"
              message="Delete"
              iconClick={() => {
                setDeletableLayer({
                  id: row?.original?.layer_id,
                  type: row?.original?.layer_type,
                  name: row?.original?.name_en,
                });
                setIsConfirmDeleteOpen(true);
              }}
              className="text-others-rejected"
            />
          </FlexRow>
        ),
      },
    ];
  }, []);

  return (
    <>
      <div className="flex flex-col">
        <div className="top mb-4 flex items-start justify-between">
          <h5 className="">Layer Visualization</h5>
          <div className="left flex gap-2">
            <Searchbar
              placeholder="Search"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <Button
              type="button"
              variant="icon-primary"
              className="flex !items-center justify-between gap-1 font-bold"
              onClick={() => setIsAddModalOpen(true)}
            >
              ADD&nbsp;LAYER&nbsp;FORM
              <Icon className="mt-1" name="add" />
            </Button>
          </div>
        </div>
        <DataTable
          columns={analyticsDataColumn}
          queryKey="layer-data-list"
          queryFn={getMapLayer}
          initialState={{
            paginationState: {
              pageIndex: 0,
              pageSize: 20,
            },
          }}
          searchInput={searchText}
          wrapperStyle={{
            // display: 'flex',
            // justifyItems: 'center',
            // background: 'red',
            height: width <= 390 ? '60vh' : 'calc(100vh-11.5rem)',
          }}
          // withPagination
        />
      </div>

      {/* {isOpenAddLayerPortal && (
        <PortalTemplate>
          <AddAnalyticsForm
            onCancel={() => {
              setIsOpenAddLayerPortal(false);
              setEditableLayer(null);
            }}
            id={editableLayer}
          />
        </PortalTemplate>
      )} */}

      {isConfirmDeleteOpen && (
        <PortalTemplate>
          <DeleteConfirmationOverlay
            title="Are you sure you want to delete this layer?"
            onCancel={() => setIsConfirmDeleteOpen(false)}
            onConfirm={() => {
              if (deletableLayer.type === 'wms')
                deleteWmsLayer(deletableLayer.id);
              if (deletableLayer.type === 'raster')
                deleteRasterLayer(deletableLayer.id);
              if (deletableLayer.type === 'vector')
                deleteVectorLayer(deletableLayer.id);
            }}
            isLoading={isWmsLoading || isRasterLoading || isVectorLoaLoading}
          />
        </PortalTemplate>
      )}
      {isAddModalOpen && (
        <PortalTemplate>
          <AddlayerOverlay onCancel={() => setIsAddModalOpen(false)} />
        </PortalTemplate>
      )}
      {isOpenEditLayerPortal && (
        <PortalTemplate>
          <EditLayerFormOverlay
            id={editableLayer.id}
            type={editableLayer.type}
            onCancel={() => setIsOpenEditLayerPortal(false)}
          />
        </PortalTemplate>
      )}
    </>
  );
}
