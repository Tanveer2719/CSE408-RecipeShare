import React from 'react';

interface LoadingOverlayProps {
  loading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-80 ${
        loading ? 'flex' : 'hidden'
      }`}
    >
      <div className="border-t-8 border-blue-500 border-solid rounded-full animate-spin h-12 w-12"></div>
    </div>
  );
};

export default LoadingOverlay;