import React, { useState, useMemo, useRef } from 'react';
import './App.css';
import Slider from './components/Slider';
import SidebarItem from './components/SidebarItem';
import Gallery from './components/Gallery'


const getDefaultOptions = () => [
  {
    name: 'Brightness',
    property: 'brightness',
    value: 100,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Contrast',
    property: 'contrast',
    value: 100,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Saturation',
    property: 'saturate',
    value: 100,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Grayscale',
    property: 'grayscale',
    value: 0,
    range: {
      min: 0,
      max: 100
    },
    unit: '%'
  },
  {
    name: 'Sepia',
    property: 'sepia',
    value: 0,
    range: {
      min: 0,
      max: 100
    },
    unit: '%'
  },
  {
    name: 'Hue Rotate',
    property: 'hue-rotate',
    value: 0,
    range: {
      min: 0,
      max: 360
    },
    unit: 'deg'
  },
  {
    name: 'Blur',
    property: 'blur',
    value: 0,
    range: {
      min: 0,
      max: 20
    },
    unit: 'px'
  }
];

function App() {

  const [file, setFile] = useState('');
  const [editedFile, setEditedFile] = useState(); 
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [options, setOptions] = useState(getDefaultOptions());
  const selectedOption = options[selectedOptionIndex];
  const [galleryImages, setGalleryImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);

  const handleSliderChange = ({ target }) => {
    setOptions((prevOptions) =>
      prevOptions.map((option, index) => (index !== selectedOptionIndex ? option : { ...option, value: target.value }))
    );
  };

  const handleImageChange = (e) => {
    const originalImage = e.target.files[0];
  
    if (originalImage) {
      const originalImageUrl = URL.createObjectURL(originalImage);
  
     
      setGalleryImages((prevGalleryImages) => [
        ...prevGalleryImages,
        { original: originalImageUrl, edited: null },
      ]);
  
      setFile(originalImageUrl);
      setEditedFile(null);
    }
  };


  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const image = new Image();
  
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
  
      const context = canvas.getContext('2d');
      context.filter = getImageStyle.filter;
  
      context.drawImage(image, 0, 0);
  
      const editedImageUrl = canvas.toDataURL('image/png');
  
     
      setGalleryImages((prevGalleryImages) => [
        ...prevGalleryImages,
        { original: file, edited: editedImageUrl },
      ]);
    };
  
    image.src = file;
  };
  const handleImageClick = (imageUrl) => {
    setFile(imageUrl);
    setEditedFile(null);
    setShowGallery(false);
  };

  const handleGalleryToggle = () => {
    
    setShowGallery((prevShowGallery) => !prevShowGallery);
    
  };



  const getImageStyle = useMemo(() => {
    const filters = options.map((option) => `${option.property}(${option.value}${option.unit})`);
    return { filter: filters.join(' ') };

  }, [options]);

 

  return (
    <div className='container'>
      <div className='main-image'>
        <h1 className='title'>IMAGE EDITOR</h1>
        <h3 className='image-add'>Upload your Image:</h3>
        <input type='file' onChange={handleImageChange} />
        <img src={file} alt='SELECTED IMAGE' style={getImageStyle} className='image' />
        <button onClick={handleDownload} className='download-button'>
          Download Image
        </button>

        <button onClick={handleGalleryToggle} className='gallery-toggle-button'>
          {showGallery ? 'Hide Gallery' : 'Show Gallery'}
        </button>
        {showGallery && (
          <Gallery images={galleryImages} handleImageClick={handleImageClick} />
        )}
      </div>

      <div className='sidebar'>
        {options.map((option, index) => (
          <SidebarItem
            key={index}
            name={option.name}
            active={index === selectedOptionIndex}
            handleClick={() => setSelectedOptionIndex(index)}
          />
        ))}
      </div>
      <Slider
        min={selectedOption.range.min}
        max={selectedOption.range.max}
        value={selectedOption.value}
        handleChange={handleSliderChange}
      />


    </div>
  
  );

  

  
  
}
export default App;