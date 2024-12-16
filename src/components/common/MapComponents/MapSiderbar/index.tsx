import { Button } from '@Components/RadixComponents/Button';
import MaterialIcon from '@Components/common/MaterialIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { useTypedDispatch, useTypedSelector } from '@Store/hooks';
import { setMapState } from '@Store/actions/mapActions';
import LayerSection from '../../../Dashboard/MapSection/LayerSection';

export default function MapSidebar() {
  const dispatch = useTypedDispatch();
  const isFullScreenOn = useTypedSelector(state => state.mapSlice.isFullScreen);
  const isMapSidebarOn = useTypedSelector(
    state => state.mapSlice.isMapSideBarOn,
  );
  const handleLayerToggle = () => {
    dispatch(setMapState({ isMapSideBarOn: !isMapSidebarOn }));
  };
  return (
    <>
      <div className="absolute z-20 h-full  ">
        <Button
          onClick={handleLayerToggle}
          className={`absolute ${
            isMapSidebarOn
              ? 'left-[20.5rem] top-1/2 z-[-10] w-[2rem]'
              : 'left-5 top-5'
          }  text-button-md hover:bg-primary-900`}
        >
          {isMapSidebarOn ? (
            <MaterialIcon name="chevron_left" iconSize="lg" />
          ) : (
            <span className="flex w-[4rem] items-center gap-x-2 rounded-lg text-white shadow-lg">
              LAYERS <span className="material-icons">chevron_right</span>
            </span>
          )}
        </Button>

        {isMapSidebarOn && (
          <AnimatePresence>
            <motion.div
              className="scrollbar overflow-y-auto overflow-x-hidden  bg-grey-100"
              initial={{ x: '-100%' }}
              exit={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 0.3 }}
              style={{
                height: isFullScreenOn ? '100vh' : 'calc(100vh - 68px)',
                width: '21.25rem',
              }}
            >
              <LayerSection />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </>
  );
}
