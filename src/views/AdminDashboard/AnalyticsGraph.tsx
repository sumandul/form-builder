/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */

import { deleteAnalyticsDetail, getAnalytics } from '@Services/adminDashboard';
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
import AddAnalyticsForm from '@Components/PortalOverlays/AddAnalyticsForm';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function AnalyticsGraph() {
  const { width } = useWindowDimensions();
  const [searchText, setSearchText] = useState('');
  const [isOpenAddUserPortal, setIsOpenAddUserPortal] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const [deletableUser, setDeletableUser] = useState('');
  const [editableUser, setEditAbleUser] = useState(null);

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation<any, unknown, any, unknown>({
    mutationFn: deleteAnalyticsDetail,
    mutationKey: ['delete-analytics'],
    onSuccess: () => {
      setIsConfirmDeleteOpen(false);
      toast.success('Analytics deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['analytics-data-list'] });
    },
  });

  const analyticsDataColumn = useMemo(() => {
    return [
      {
        header: 'S.N',
        accessorKey: 'id',
        cell: (info: any) => info.row.index + 1,
      },

      {
        header: 'Title',
        accessorKey: 'title',
      },
      {
        header: 'Statistics',
        accessorKey: 'statistics',
        cell: ({ row }: any) => (
          <span>{row?.original?.statistics?.join(', ')}</span>
        ),
      },
      {
        header: 'Threshold Value',
        accessorKey: 'threshold_value',
      },
      {
        header: 'Type of Chart',
        accessorKey: 'graph_type',
      },
      {
        header: 'Public',
        accessorKey: 'is_public',
        cell: ({ row }: any) => (
          <span>{row?.original?.is_public ? 'Yes' : 'No'}</span>
        ),
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
                setIsOpenAddUserPortal(true);
                setEditAbleUser(row?.original?.id || null);
              }}
            />

            <ToolTip
              name="delete"
              message="Delete"
              iconClick={() => {
                setDeletableUser(row?.original?.id);
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
          <h5 className="">Analytics form</h5>
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
              onClick={() => setIsOpenAddUserPortal(true)}
            >
              ADD&nbsp;ANALYTICS&nbsp;FORM
              <Icon className="mt-1" name="add" />
            </Button>
          </div>
        </div>
        <DataTable
          columns={analyticsDataColumn}
          queryKey="analytics-data-list"
          queryFn={getAnalytics}
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

      {isOpenAddUserPortal && (
        <PortalTemplate>
          <AddAnalyticsForm
            onCancel={() => {
              setIsOpenAddUserPortal(false);
              setEditAbleUser(null);
            }}
            id={editableUser}
          />
        </PortalTemplate>
      )}

      {isConfirmDeleteOpen && (
        <PortalTemplate>
          <DeleteConfirmationOverlay
            title="Are you sure you want to delete this data?"
            onCancel={() => setIsConfirmDeleteOpen(false)}
            onConfirm={() => {
              mutate(deletableUser);
            }}
            isLoading={isLoading}
          />
        </PortalTemplate>
      )}
    </>
  );
}
