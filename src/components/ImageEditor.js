import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// A single editor instance for one image
const SingleImageEditor = ({ image, onCropComplete, onRemove }) => {
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ unit: 'px', width: 300, aspect: 16 / 9 });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [zoom, setZoom] = useState(1);

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    const generatePreview = useCallback((canvas, cropData) => {
        if (!cropData || !canvas || !imgRef.current) return;

        const image = imgRef.current;
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
            0, 0, cropData.width, cropData.height
        );

        canvas.toBlob(
            (blob) => {
                if (blob) {
                    onCropComplete(image.id, blob);
                }
            }, 'image/png', 1
        );
    }, [onCropComplete]);

    useEffect(() => {
        if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
            generatePreview(previewCanvasRef.current, completedCrop);
        }
    }, [completedCrop, generatePreview]);

    const imageStyle = { transform: `scale(${zoom})` };

    return (
        <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
            <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
            >
                <img ref={imgRef} src={image.previewUrl} onLoad={onLoad} style={imageStyle} alt="Crop Preview" />
            </ReactCrop>
            <div style={{ margin: '10px 0' }}>
                <label>Zoom: </label>
                <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                />
            </div>
            <button onClick={() => onRemove(image.id)}>Remove Image</button>
            <h5>Cropped Preview</h5>
            <canvas
                ref={previewCanvasRef}
                style={{
                    border: '1px solid black',
                    objectFit: 'contain',
                    maxWidth: '100%',
                    maxHeight: 300
                }}
            />
        </div>
    );
};


const ImageEditor = ({ fieldName, initialImageUrls = [], onChange, multiple = false }) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        // When initialImageUrls change, update the state
        const initialImages = initialImageUrls.map((url, index) => ({
            id: `initial-${index}-${Date.now()}`,
            previewUrl: url,
            isInitial: true // Flag to distinguish from new uploads
        }));
        setImages(initialImages);
    }, [initialImageUrls]);

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newImages = Array.from(e.target.files).map(file => ({
                id: `${file.name}-${Date.now()}`,
                file,
                previewUrl: URL.createObjectURL(file),
            }));

            if (multiple) {
                setImages(prev => [...prev, ...newImages]);
            } else {
                setImages(newImages);
            }
        }
    };

    const handleCropComplete = (imageId, blob) => {
        const file = images.find(img => img.id === imageId)?.file;
        if (file) {
            const croppedFile = new File([blob], file.name, {
                type: 'image/png',
                lastModified: Date.now(),
            });
            onChange(fieldName, croppedFile, file.name); // Pass original filename for mapping
        }
    };

    // This function now just removes from the UI state.
    // The parent component is responsible for updating the final list of URLs.
    const handleRemoveImage = (idToRemove) => {
        const remainingImages = images.filter(img => img.id !== idToRemove);
        setImages(remainingImages);

        // Notify parent of the change
        const remainingUrls = remainingImages
            .filter(img => img.isInitial)
            .map(img => img.previewUrl);

        onChange(fieldName, remainingUrls);
    };


    return (
        <div className="ImageEditor" style={{ border: '1px dashed #ccc', padding: '10px' }}>
            <div style={{ marginBottom: '10px' }}>
                <input type="file" accept="image/*" onChange={onSelectFile} multiple={multiple} />
            </div>

            {images.length > 0 ? (
                images.map((image) => (
                    <div key={image.id}>
                        {/* If it's a newly uploaded file, show the editor */}
                        {image.file ? (
                            <SingleImageEditor
                                image={image}
                                onCropComplete={handleCropComplete}
                                onRemove={handleRemoveImage}
                            />
                        ) : (
                            // If it's an initial image URL, just display it with a remove button
                            <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
                                <img src={image.previewUrl} alt="Existing" style={{ maxWidth: '100%', maxHeight: '200px' }}/>
                                <button onClick={() => handleRemoveImage(image.id)} style={{marginTop: '10px'}}>
                                    Remove Image
                                </button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No Image Selected</p>
            )}
        </div>
    );
};

export default ImageEditor;
