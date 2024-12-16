/* eslint-disable react/no-unstable-nested-components */
import { Button } from '@Components/RadixComponents/Button';
import DataTable from '@Components/common/DataTable';
import PortalTemplate from '@Components/common/PortalTemplate';
import Searchbar from '@Components/common/Searchbar';
import useForm from '@Hooks/useForm';
import useWindowDimensions from '@Hooks/useWindowDimensions';
import {
  deleteEmailChannelUser,
  getEmailUser,
  patchEmailChannel,
} from '@Services/adminDashboard';
import React, { useMemo, useState } from 'react';
import TableDropDown from '@Components/common/TableFormControl/tableDropDown';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import TableToogle from '@Components/common/TableFormControl/tableToogle';
import { processAndCombineDataForObject } from '@Utils/index';
import SubmitButton from '@Components/common/SubmitButton';
import isEmpty from '@Utils/isEmpty';
import AddEmailUser from './AddEmailUser';
import DeleteConfirmationOverlay from './DeleteConfirmationOverlay';

function getSelectedLayerValues(layers: Record<string, any>[]) {
  if (isEmpty(layers) || !layers) return [];

  const tempLayers = layers.map((layer: Record<string, any>) => {
    if (!layer.source) return null;
    return `${layer.source}-${layer.id}`;
  });
  return tempLayers.filter(layer => {
    return layer != null;
  });
}

const DefineRuleOverlay = ({ onClose, thresholdOption }: any) => {
  const { width } = useWindowDimensions();
  const [searchText, setSearchText] = useState('');
  const queryClient = useQueryClient();
  const [isDeleteOverlay, setIsDeleteOverlay] = useState(false);
  const [isEmailAddUserOverlay, setIsEmailAddUserOverlay] =
    useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<Record<string, any> | null>(
    null,
  );

  const {
    mutate: patchEmail,
    error: patchError,
    isLoading: patchLoading,
    isSuccess: patchIsSuccess,
    isError: patchIsError,
  } = useMutation({
    // mutationKey: ['patch-email-channel'],
    mutationFn: patchEmailChannel,
    onSuccess: () => {
      // eslint-disable-next-line no-use-before-define
      clearAndInitialiseForm();
      queryClient.invalidateQueries({ queryKey: ['user-email-get'] });
      toast.success('User updated Successfully.');
      // onCancel();
    },
  });

  const {
    mutate: deleteEmailUser,
    error: deleteError,
    isLoading: isEmailUserDeleting,
  } = useMutation({
    // mutationKey: ['patch-email-channel'],
    mutationFn: deleteEmailChannelUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-email-get'] });
      setIsDeleteOverlay(false);
      setSelectedData(null);
      toast.success('User updated Successfully.');
      // onCancel();
    },
  });

  const { handleSubmit, clearAndInitialiseForm, setBindValues } = useForm({
    initialValues: {},
    formName: 'email-channel-table-form',

    postInterceptor: async postValues => {
      try {
        const patchData = processAndCombineDataForObject(postValues);

        const patchPermises = patchData.map(
          // eslint-disable-next-line camelcase
          async (entry: Record<string, any>) => {
            // eslint-disable-next-line camelcase
            const { id, layers, auto_send } = entry;
            let payloadLayers;
            if (layers) {
              payloadLayers = layers?.map((layer: Record<string, any>) => {
                const layerArray = layer.split('-');
                const [source, idx] = layerArray;
                return {
                  source,
                  id: idx ? Number(idx) : idx,
                };
              });
            }
            const formData = new FormData();
            // Only append 'layers' if 'layer' is not undefined and not empty
            // eslint-disable-next-line valid-typeof
            if (typeof payloadLayers !== 'undefined') {
              formData.append('layers', JSON.stringify(payloadLayers));
            }

            // Similarly, only append 'auto_send' if it's not undefined
            // eslint-disable-next-line camelcase
            if (auto_send !== undefined) {
              formData.append('auto_send', auto_send);
            }

            return patchEmail({ id, formData });
          },
        );

        await Promise.all(patchPermises);
      } catch (error) {
        throw new Error(error as string);
      }
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
      },
      {
        header: 'Email',
        accessorKey: 'email',
      },
      // {
      //   header: 'Threshold',
      //   accessorKey: '',
      //   cell: ({ row }: any) => {
      //     return (
      //       <span>
      //         <TableDropDown
      //           id={row.original?.id}
      //           options={[
      //             { id: 1, label: 'Wetness', value: 'wetness' },
      //             { id: 2, label: 'Snow Cover', value: 'snow cover' },
      //             { id: 3, label: 'Precipitation', value: 'precipitation' },
      //           ]}
      //           selectedOption={row?.original?.layers || []}
      //           onChange={(value: Record<string, any>) =>
      //             setBindValues(prev => ({
      //               ...prev,
      //               [row.original?.id]: value,
      //             }))
      //           }
      //         />
      //       </span>
      //     );
      //   },
      // },

      {
        header: 'Threshold',
        accessorKey: '',
        cell: ({ row }: any) => {
          return (
            <span>
              <TableDropDown
                id={row.original?.id}
                options={thresholdOption}
                selectedOption={getSelectedLayerValues(row?.original?.layers)}
                onChange={(value: Record<string, any>) =>
                  setBindValues(prev => ({
                    ...prev,
                    [row.original?.id]: value,
                  }))
                }
              />
            </span>
          );
        },
      },
      {
        header: 'Auto Email Activation',
        accessorKey: 'auto_send',
        cell: ({ row }: any) => {
          return (
            <TableToogle
              id={row.original?.id}
              onChange={(value: Record<string, any>) =>
                setBindValues(prev => ({
                  ...prev,
                  [`auto_send-${row.original?.id}`]: value,
                }))
              }
              selectedValue={row?.original?.auto_send}
            />
          );
        },
      },
      {
        header: '',
        accessorKey: 'icon-delete',
        cell: ({ row }: any) => {
          return (
            <span
              role="presentation"
              className="material-icons cursor-pointer text-red-500 hover:text-red-400"
              onClick={() => {
                setIsDeleteOverlay(true);
                setSelectedData(row.original);
              }}
            >
              delete
            </span>
          );
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="absolute left-1/2 top-1/2  h-[38.625rem] w-[58.625rem] -translate-x-1/2 -translate-y-1/2 gap-2 rounded-lg bg-white">
        <div className="body flex h-full flex-col space-y-7 p-6">
          <div className="head flex w-full items-center justify-between">
            <div className="content flex flex-col gap-2">
              <h4>Define Rule</h4>
              <span className="body-md text-[#484848]">
                Please fill up the details to define rule
              </span>
            </div>
            <div className="left flex gap-2">
              <Searchbar
                className="h-9 max-w-[13rem] cursor-pointer"
                placeholder="Search"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() => {
                  setIsEmailAddUserOverlay(prev => !prev);
                }}
                className="flex h-9 w-[8.063rem] !px-4 !py-2"
              >
                <i className="material-icons text-icon-sm">add</i>
                <span style={{ whiteSpace: 'nowrap' }}>ADD USER</span>
              </Button>
            </div>
          </div>
          <div className="z-40 h-[26rem]">
            <DataTable
              columns={userDataColumns}
              queryKey="user-email-get"
              queryFn={getEmailUser}
              initialState={{
                paginationState: {
                  pageIndex: 0,
                  pageSize: 20,
                },
              }}
              searchInput={searchText}
              wrapperStyle={{
                //   display: 'flex',
                //   justifyItems: 'center',
                //   background: 'red',
                height: width <= 390 ? '60vh' : 'calc(100vh-16rem)',
              }}

              // withPagination
            />
          </div>
          <div className="z-20 flex items-end justify-center gap-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </Button>

            <SubmitButton
              isSubmitting={patchLoading}
              isError={patchIsError}
              isSuccess={patchIsSuccess}
              onClick={handleSubmit}
              // error={patchError}
              variant="default"
              className="flex items-center justify-center gap-1  text-white disabled:!pointer-events-auto disabled:!cursor-not-allowed"
              error={
                // @ts-ignore
                patchError?.response?.data?.message
              }
            >
              Save
            </SubmitButton>
          </div>
        </div>
        {isEmailAddUserOverlay && (
          <PortalTemplate>
            <AddEmailUser onClose={() => setIsEmailAddUserOverlay(false)} />
          </PortalTemplate>
        )}
        {isDeleteOverlay && (
          <PortalTemplate style={{ zIndex: 60 }}>
            <DeleteConfirmationOverlay
              title="Are you sure you want to delete ?"
              onCancel={() => {
                setIsDeleteOverlay(false);
                setSelectedData(null);
              }}
              onConfirm={() => deleteEmailUser(selectedData?.id)}
              isLoading={isEmailUserDeleting}
              error={
                deleteError
                  ? // @ts-ignore
                    deleteError?.response?.data?.message || 'Error Occurred'
                  : null
              }
            />
          </PortalTemplate>
        )}
      </div>
    </>
  );
};

export default DefineRuleOverlay;
