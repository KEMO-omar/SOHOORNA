import React from 'react';

export const Lanterns: React.FC = () => {
  return (
    <>
      <img
        src="/antern.png"
        alt="فانوس رمضان"
        className="fixed top-0 right-2 w-14 md:w-16 z-50 pointer-events-none drop-shadow-[0_0_12px_#D4AF37] animate-lantern-right"
      />
      <img
        src="/antern.png"
        alt="فانوس رمضان"
        className="fixed top-0 left-2 w-14 md:w-16 z-50 pointer-events-none drop-shadow-[0_0_12px_#D4AF37] animate-lantern-left"
      />
    </>
  );
};
