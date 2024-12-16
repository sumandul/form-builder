import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface IPortalProps {
  overlayComponent: ReactNode;
}

export default function Portal({ overlayComponent }: IPortalProps) {
  const backdropNode = document.getElementById('backdrop-root');
  const portalNode = document.getElementById('overlay-root');
  return (
    <>
      {backdropNode
        ? createPortal(
            <div className="fixed left-0 top-0 z-50 h-screen w-screen bg-black bg-opacity-60" />,
            backdropNode,
          )
        : null}

      {portalNode
        ? createPortal(
            <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center">
              {overlayComponent}
            </div>,
            portalNode,
          )
        : null}
    </>
  );
}
