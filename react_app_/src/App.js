import React, { useState, useMemo, useRef } from 'react';
import './App.css';
import Slider from './components/Slider';
import SidebarItem from './components/SidebarItem';
import Gallery from './components/Gallery';



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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState('');
  const [editedImageUrl, setEditedImageUrl] = useState('');


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


  
      const a = document.createElement('a');
      a.href = editedImageUrl;
      a.download = 'edited_image.png';
      a.click();
  
      
      
      setGalleryImages((prevGalleryImages) => [
        ...prevGalleryImages,
        { original: file, edited: editedImageUrl },
      ]);
    };
  
    image.src = file;
  };

  

  
  const handleImageClick = (originalUrl, editedUrl, index) => {
    setOriginalImageUrl(originalUrl);
    setEditedImageUrl(editedUrl);
    setSelectedImageIndex(index);
    setShowGallery(false);
    setShowModal(true);
  };
  
  

  

  const handleModalClose = () => {
    setShowModal(false);
  };

  
  
  const handlePrevImage = () => {
    setSelectedImageIndex((prevIndex) => {
      const newIndex = prevIndex > 0 ? prevIndex - 1 : galleryImages.length - 1;
      return newIndex;
    });
  };
  
  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) => {
      const newIndex = prevIndex < galleryImages.length - 1 ? prevIndex + 1 : 0;
      return newIndex;
    });
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

{showModal && (
  <div className="image-modal">
    <span className="close-modal" onClick={handleModalClose}>&times;</span>
    {editedImageUrl ? (
      <img key={editedImageUrl} src={editedImageUrl} alt="ENLARGED EDITED IMAGE" />
    ) : (
      <img key={originalImageUrl} src={originalImageUrl} alt="ENLARGED ORIGINAL IMAGE" />
    )}
    <div className="modal-nav">
      <button onClick={handlePrevImage}>Previous</button>
      <button onClick={handleNextImage}>Next</button>
    </div>
  </div>
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
