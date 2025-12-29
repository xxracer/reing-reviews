import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageEditor = ({ fieldName, initialImageUrl, onChange }) => {
  const [upImg, setUpImg] = useState(initialImageUrl);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: 'px', width: 300, aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [zoom, setZoom] = useState(1);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const generatePreview = useCallback((canvas, cropData) => {
    if (!cropData || !canvas) {
      return;
    }

    const image = imgRef.current;
    if (!image) {
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = cropData.width * pixelRatio;
    canvas.height = cropData.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      cropData.x * scaleX,
      cropData.y * scaleY,
      cropData.width * scaleX,
      cropData.height * scaleY,
      0,
      0,
      cropData.width,
      cropData.height
    );

    canvas.toBlob(
      (blob) => {
        if (blob) {
            onChange(fieldName, blob);
        }
      },
      'image/png',
      1
    );
  }, [fieldName, onChange]);


  useEffect(() => {
      if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
          generatePreview(previewCanvasRef.current, completedCrop);
      }
  }, [completedCrop, generatePreview]);

  const imageStyle = {
      transform: `scale(${zoom})`,
  };

  return (
    <div className="ImageEditor" style={{ border: '1px dashed #ccc', padding: '10px' }}>
      <div style={{ marginBottom: '10px' }}>
        <input type="file" accept="image/*" onChange={onSelectFile} />
      </div>
      {upImg ? (
        <>
          <div style={{ marginBottom: '10px', overflow: 'hidden', maxWidth: '100%', border: '1px solid #ccc' }}>
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
            >
              <img ref={imgRef} src={upImg} onLoad={onLoad} style={imageStyle} alt="Source"/>
            </ReactCrop>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="zoom">Zoom:</label>
            <input
              id="zoom"
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
              className="zoom-range"
            />
          </div>
          <div>
              <h5>Preview</h5>
              <canvas
                ref={previewCanvasRef}
                style={{
                  border: '1px solid black',
                  objectFit: 'contain',
                  width: completedCrop?.width ?? 0,
                  height: completedCrop?.height ?? 0,
                }}
              />
          </div>
        </>
      ) : (
        <p>No Image Selected</p>
      )}
    </div>
  );
};

export default ImageEditor;
