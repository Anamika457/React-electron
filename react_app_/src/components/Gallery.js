

import React from 'react';

const Gallery = ({ images, handleImageClick }) => {
  return (
    <div className='gallery-container'>
      {images.map((image, index) => (
        <div key={index} className='gallery-item'>
          <img
            src={image.edited || image.original}
            alt={`Image ${index + 1}`}
            onClick={() => handleImageClick(image.original || image.edited)} 
            className='gallery-image'
          />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
