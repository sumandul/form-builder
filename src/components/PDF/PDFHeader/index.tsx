import AddPDFOverlay from '@Components/PortalOverlays/AddPDFOverlay';
import { Button } from '@Components/RadixComponents/Button';
import Dropdown from '@Components/RadixComponents/Dropdown';
import Input from '@Components/RadixComponents/Input';
import Icon from '@Components/common/Icon';
import PortalTemplate from '@Components/common/PortalTemplate';
import { sortOptionsList } from '@Constants/index';
import { useState } from 'react';

export default function PDFHeader({
  setSearchText,
  setSortBy,
  sortBy,
}: {
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  sortBy: string;
}) {
  const [addPDF, setAddPDF] = useState(false);
  return (
    <>
      <div className="top-filters flex w-full items-center justify-between ">
        <Input
          className="!h-9 !w-[17.4375rem] !border-gray-300 !bg-gray-100"
          hasIcon
          rightIconName="search"
          iconStyle="!text-gray-800 !text-[1.5rem]"
          placeholder="Search"
          onChange={(e: any) => {
            setSearchText(e.target.value);
          }}
        />
        <div className="flex items-center justify-center gap-2">
          <Dropdown
            dropDownSize="sm"
            options={sortOptionsList}
            placeholder="Sort By"
            choose="value"
            value={sortBy}
            className="!h-9 w-[10rem] !border-gray-300 !bg-white"
            onChange={value => {
              setSortBy(value);
            }}
          />
          <Button
            onClick={(e: any) => {
              e.stopPropagation();
              setAddPDF(true);
            }}
            variant="default"
            // disabled
            className="!flex !h-9 !items-center !justify-center !gap-1"
          >
            ADD PDF
            <Icon name="add" />
          </Button>
        </div>
      </div>
      {addPDF && (
        <PortalTemplate>
          <AddPDFOverlay onCancel={() => setAddPDF(false)} />
        </PortalTemplate>
      )}
    </>
  );
}
