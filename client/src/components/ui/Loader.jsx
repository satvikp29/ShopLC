import React from 'react';

const Loader = ({ size = 'md', fullPage = false }) => {
  const sizeClass = size === 'sm' ? 'loader-sm' : size === 'lg' ? 'loader-lg' : 'loader-md';

  if (fullPage) {
    return (
      <div className="loader-fullpage">
        <div className={`loader ${sizeClass}`} />
      </div>
    );
  }

  return <div className={`loader ${sizeClass}`} />;
};

export default Loader;
