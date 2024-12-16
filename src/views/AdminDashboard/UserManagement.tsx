/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-nested-ternary */
import AddUserOverlay from '@Components/PortalOverlays/AddUserOverlay';
import { Button } from '@Components/RadixComponents/Button';
import ToolTip from '@Components/RadixComponents/ToolTip';
import DataTable from '@Components/common/DataTable';
import Icon from '@Components/common/Icon';
import { FlexRow } from '@Components/common/Layouts';
import PortalTemplate from '@Components/common/PortalTemplate';
import Searchbar from '@Components/common/Searchbar';
import useWindowDimensions from '@Hooks/useWindowDimensions';
import { deleteUser, getUserDetails } from '@Services/adminDashboard';
import avatarImage from '@Assets/images/Avatar-images.png';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import DeleteConfirmationOverlay from '@Components/PortalOverlays/DeleteConfirmationOverlay';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export default function UserManagement() {
  const { width } = useWindowDimensions();
  const [searchText, setSearchText] = useState('');
  const [isOpenAddUserPortal, setIsOpenAddUserPortal] = useState(false);

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deletableUser, setDeletableUser] = useState('');
  const [editableUser, setEditAbleUser] = useState(null);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation<any, unknown, any, unknown>({
    mutationFn: deleteUser,
    mutationKey: ['delete-user'],
    onSuccess: () => {
      setIsConfirmDeleteOpen(false);
      toast.success('User deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['user-data-list'] });
    },
  });
  const userDataColumns = useMemo(() => {
    return [
      {
        header: 'S.N',
        accessorKey: 'id',
        cell: (info: any) => info.row.index + 1,
      },
      {
        header: 'Users',
        accessorKey: 'username',
        cell: ({ row }: any) => {
          return (
            <span className="flex items-center gap-2">
              <img
                src={
                  row?.original?.thumbnail
                    ? row?.original?.thumbnail
                    : avatarImage
                }
                className="h-[1.75rem] w-[1.75rem] rounded-full"
                alt="profile"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <p className="line-clamp-1">{row?.original?.username}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className=" bg-gray-800 px-2 py-1 text-white">
                      {row?.original?.username}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          );
        },
      },
      {
        header: 'Designation',
        accessorKey: 'designation',
      },
      {
        header: 'Role',
        accessorKey: 'role_type',
      },
      {
        header: 'User Status',
        accessorKey: 'is_active',
        cell: ({ row }: any) => (
          <span>{row?.original?.is_active ? 'Active' : 'Inactive'}</span>
        ),
      },
      {
        header: 'Latest Updated on',
        accessorKey: 'date_modified',
        cell: ({ row }: any) => (
          <span>
            {format(
              new Date(row?.original?.date_modified),
              "yyyy-MM-dd | hh:mm aaaaa'm'",
            )}
          </span>
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
          <h5 className="">User Management</h5>
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
              ADD&nbsp;USER <Icon className="mt-1" name="add" />
            </Button>
          </div>
        </div>
        <DataTable
          columns={userDataColumns}
          queryKey="user-data-list"
          queryFn={getUserDetails}
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
          <AddUserOverlay
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
            title="Are you sure you want to delete this user?"
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
