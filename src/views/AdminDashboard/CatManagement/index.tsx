/* eslint-disable camelcase */
import { Button } from '@Components/RadixComponents/Button';
import Icon from '@Components/common/Icon';
import PortalTemplate from '@Components/common/PortalTemplate';
import AddCategoryFormOverlay from '@Components/PortalOverlays/AddCategoryFormOverlay';
import { useState } from 'react';
import AddSubCategoryFormOverlay from '@Components/PortalOverlays/AddSubCategoryFormOverlay';
import DraggableRowsTable from './DraggableRowsTable';

export default function CatManagement() {
  // const [searchText, setSearchText] = useState('');
  const [isOpenAddCatagoryPortal, setIsOpenAddCatagoryPortal] = useState(false);
  const [isOpenAddSubCatagoryPortal, setIsOpenAddSubCatagoryPortal] =
    useState(false);

  const [editableCategory, setEditableCategory] = useState(null);
  const [editableSubCategory, setEditableSubCategory] = useState(null);

  return (
    <>
      <div className="flex flex-col">
        <div className="top mb-4 flex items-start justify-between">
          <h5 className="">Category Management</h5>
          <div className="left flex gap-2">
            {/* <Searchbar
            placeholder="Search"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          /> */}
            <Button
              type="button"
              variant="icon-primary"
              className="flex !items-center justify-between gap-1 !px-2 text-sm font-bold"
              onClick={() => setIsOpenAddCatagoryPortal(true)}
            >
              ADD&nbsp;CATEGORY
              <Icon className="mt-1" name="add" />
            </Button>
            <Button
              type="button"
              variant="icon-primary"
              className="flex !items-center justify-between gap-1 !px-2 text-sm font-bold"
              onClick={() => setIsOpenAddSubCatagoryPortal(true)}
            >
              ADD&nbsp;SUB-CATEGORY
              <Icon className="mt-1" name="add" />
            </Button>
          </div>
        </div>

        {/* <DraggableRowsTable searchText={searchText} /> */}
        <DraggableRowsTable />
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
