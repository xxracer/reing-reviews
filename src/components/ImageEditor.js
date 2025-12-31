import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './ImageEditor.css';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    );
}

const ImageEditor = ({ fieldName, initialImageUrl, onChange, aspect = 16 / 9 }) => {
    const [imgSrc, setImgSrc] = useState('');
    const previewCanvasRef = useRef(null);
    const imgRef = useRef(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState();
    const [scale, setScale] = useState(1);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setImgSrc(initialImageUrl || '');
        if (initialImageUrl) {
            setIsEditing(false); // If there's an initial image, show it without forcing edit mode
        } else {
            setIsEditing(true); // If there's no image, start in edit mode to prompt upload
        }
    }, [initialImageUrl]);

    function onSelectFile(e) {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined);
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImgSrc(reader.result?.toString() || '');
                setIsEditing(true);
            });
            reader.readAsDataURL(e.target.files[0]);
            onChange(fieldName, e.target.files[0]); // Pass the file object up immediately
        }
    }

    function onImageLoad(e) {
        const { width, height } = e.currentTarget;
        const newCrop = centerAspectCrop(width, height, aspect);
        setCrop(newCrop);
        setCompletedCrop(newCrop); // Set a default completed crop
    }

    const handleCenterImage = () => {
        if (imgRef.current) {
            const { width, height } = imgRef.current;
            const newCrop = centerAspectCrop(width, height, aspect);
            setCrop(newCrop);
            setCompletedCrop(newCrop);
        }
    };

    // This effect is for generating the preview
    useEffect(() => {
        async function createPreview() {
            if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
                return;
            }

            const image = imgRef.current;
            const canvas = previewCanvasRef.current;
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            canvas.width = Math.floor(completedCrop.width * scaleX);
            canvas.height = Math.floor(completedCrop.height * scaleY);

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('No 2d context');
            }

            ctx.drawImage(
                image,
                completedCrop.x * scaleX,
                completedCrop.y * scaleY,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY,
                0,
                0,
                canvas.width,
                canvas.height,
            );
        }

        createPreview();
    }, [completedCrop]);


    const handleDoneEditing = () => {
        setIsEditing(false);
        // Here you might want to generate a final blob and pass it up
        if (previewCanvasRef.current) {
            previewCanvasRef.current.toBlob(blob => {
                if (blob) {
                    onChange(fieldName, blob);
                }
            }, 'image/png');
        }
    };

    return (
        <div className="image-editor-container">
            <h4 className="image-editor-title">{fieldName.replace(/_/g, ' ')}</h4>

            {!isEditing && imgSrc && (
                 <div className="preview-container">
                    <img src={imgSrc} alt="Current" style={{ maxWidth: '100%', maxHeight: '300px' }}/>
                 </div>
            )}

            {isEditing ? (
                <>
                    <div className="preview-container">
                        {imgSrc ? (
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspect}
                            >
                                <img
                                    ref={imgRef}
                                    src={imgSrc}
                                    alt="Crop me"
                                    style={{ transform: `scale(${scale})` }}
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>
                        ) : (
                            <p className="no-image-text">No Image Selected</p>
                        )}
                    </div>
                    <div className="controls-container">
                        <input type="file" accept="image/*" onChange={onSelectFile} />
                        <div className="zoom-container">
                            <label htmlFor="scale-input">Zoom:</label>
                            <input
                                id="scale-input"
                                type="range"
                                step="0.1"
                                min="0.5"
                                max="2"
                                value={scale}
                                onChange={(e) => setScale(Number(e.target.value))}
                                className="zoom-slider"
                            />
                        </div>
                        <button type="button" onClick={handleCenterImage} className="center-button">
                            Center
                        </button>
                    </div>
                </>
            ) : (
                <div className="image-editor-buttons">
                    <button type="button" onClick={() => setIsEditing(true)}>Change Image</button>
                </div>
            )}

            {/* Keep the canvas for preview generation, but it can be hidden */}
            <canvas
                ref={previewCanvasRef}
                style={{
                    display: 'none',
                    border: '1px solid black',
                    objectFit: 'contain',
                    width: completedCrop?.width,
                    height: completedCrop?.height,
                }}
            />
        </div>
    );
};

export default ImageEditor;
