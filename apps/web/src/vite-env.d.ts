declare module 'react-responsive-masonry' {
  import * as React from 'react';

  interface MasonryProps {
    columnsCount?: number;
    gutter?: string;
    children?: React.ReactNode;
  }
  const Masonry: React.FC<MasonryProps>;
  export default Masonry;

  interface ResponsiveMasonryProps {
    columnsCountBreakPoints?: Record<number, number>;
    children?: React.ReactNode;
  }
  export const ResponsiveMasonry: React.FC<ResponsiveMasonryProps>;
}
