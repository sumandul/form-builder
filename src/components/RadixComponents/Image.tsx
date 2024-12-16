/* eslint-disable jsx-a11y/no-static-element-interactions */

import { HTMLAttributes } from 'react';

/* eslint-disable jsx-a11y/click-events-have-key-events */
interface IDivProps extends HTMLAttributes<HTMLDivElement> {}

interface IProps extends IDivProps {
  aspectRation?: string;
  alt?: string;
  src: string;
}

export default function Image({
  aspectRation,
  className,
  src,
  alt,
  onClick,
}: IProps): JSX.Element {
  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div
      className={`image-cover aspect-${aspectRation} ${className}}`}
      style={{ aspectRatio: aspectRation }}
      onClick={onClick}
    >
      <img src={src} alt={alt} className={className} />
    </div>
  );
}
