import { useEffect, useState } from 'react';
import './loader.css';

interface ILoaderProps {
  map?: any;
  sourceId: string;
}

export default function Loader({ map, sourceId }: ILoaderProps) {
  const [isSourceLoaded, setIsSourceLoaded] = useState(false);
  useEffect(() => {
    map?.on('sourcedata', (ev: Record<string, any>) => {
      //   if (ev?.sourceId === sourceId) setIsSourceLoaded(ev?.isSourceLoaded);
      setIsSourceLoaded(ev?.isSourceLoaded);
    });
  }, [map, sourceId]);

  return (
    <>
      {!isSourceLoaded && (
        <div className="absolute right-[50%] top-[50%] z-10">
          <div className="loader" />
        </div>
      )}
    </>
  );
}
