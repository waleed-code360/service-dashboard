import React from 'react';

const Skeleton = ({ width, height, className = '', style = {} }) => {
    return (
        <div
            className={`skeleton ${className}`}
            style={{
                width: width || '100%',
                height: height || '20px',
                ...style
            }}
        ></div>
    );
};

export default Skeleton;
