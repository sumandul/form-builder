/* eslint-disable react/no-array-index-key */
import Searchbar from '@Components/common/Searchbar';
import { useState } from 'react';
import { FlexRow } from '@Components/common/Layouts';
import IconButton from '@Components/common/IconButton';
import useAuth from '@Hooks/useAuth';
import { useTypedSelector } from '@Store/hooks';
import PortalTemplate from '@Components/common/PortalTemplate';
import SignInRedirectOverlay from '@Components/PortalOverlays/SignInRedirectOverlay';
import NestedAccordion from '@Components/Dashboard/MapSection/LayerSection/NestedAccordion';
import { categorySelector } from '@Store/selector/map';
import AddlayerOverlay from '@Components/PortalOverlays/AddLayerOverlay';

export default function LayerSection(): JSX.Element {
  const allLayers = useTypedSelector(categorySelector);
  const { isAuthenticated } = useAuth();
  const [redirectPortal, setRedirectPortal] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      {redirectPortal && (
        <PortalTemplate>
          <SignInRedirectOverlay onCancel={() => setRedirectPortal(false)} />
        </PortalTemplate>
      )}

      <div>
        <div className="sticky top-0 z-10 mx-auto bg-grey-100 p-3">
          <Searchbar
            className="h-[36px] w-[100%] cursor-not-allowed"
            placeholder="Search"
            onChange={() => {}}
            value=""
          />
          <FlexRow className="mt-2 justify-between">
            <h5 className="font-primary">Layers</h5>
            <IconButton
              onClick={() => {
                if (!isAuthenticated) {
                  // open signin modal if not authenticated
                  setRedirectPortal(true);

                  return;
                }
                // open add layer modal
                setIsAddModalOpen(true);
              }}
              name="add"
              buttonText="ADD LAYER"
              className={`${
                isAuthenticated
                  ? 'bg-primary-500  hover:bg-primary-900'
                  : 'bg-grey-400'
              } w-[8.5rem] rounded-md text-button-md text-white`}
              iconClassName="ml-2 mb-1"
            />
          </FlexRow>
        </div>
        <div
          // key={JSON.stringify(localAllLayers)}
          className="my-4 px-3"
        >
          {allLayers.length ? (
            allLayers?.map(category => {
              return (
                <div key={JSON.stringify(category)} className="my-2">
                  <NestedAccordion
                    collapsed={false}
                    header={category.name_en}
                    subcategory={category.subcategory}
                  />
                </div>
              );
            })
          ) : (
            <p className="text-gray-400">No Layers</p>
          )}
        </div>
      </div>
      {isAddModalOpen && (
        <PortalTemplate>
          <AddlayerOverlay onCancel={() => setIsAddModalOpen(false)} />
        </PortalTemplate>
      )}
    </>
  );
}
