import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import ImageEditor from './ImageEditor';

const EditableSection = ({ pageName, sectionTitle, fields }) => {
  const [content, setContent] = useState({});
  const [files, setFiles] = useState({});
  const [urlInputs, setUrlInputs] = useState({});
  const [notification, setNotification] = useState({ message: '', type: '' });
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`/api/content/${pageName}`);
        setContent(response.data);
        if (sectionRef.current) {
          sectionRef.current.setAttribute('data-loaded', 'true');
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };
    fetchContent();
  }, [pageName]);

  const handleTextChange = useCallback((e) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = (fieldName, value) => {
    if (Array.isArray(value)) {
      // This is a full replacement of the URL list (e.g., from removing an item)
      setContent(prev => ({ ...prev, [fieldName]: value.map(url => ({ url })) }));
    } else {
      // This is a new file blob to be uploaded
      setFiles(prev => {
        const existingFiles = prev[fieldName] || [];
        return { ...prev, [fieldName]: [...existingFiles, value] };
      });
    }
  };

  const handleUrlInputChange = (fieldName, value) => {
    setUrlInputs(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleAddUrl = (fieldName) => {
    const url = urlInputs[fieldName];
    if (url) {
      setContent(prev => ({
        ...prev,
        [fieldName]: [...(prev[fieldName] || []), { url, originalname: url, align: 'center', width: '100%' }],
      }));
      setUrlInputs(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleRemoveFile = (fieldName, fileToRemove) => {
    setContent(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter(file => file.url !== fileToRemove.url),
    }));
  };

  const handleImageMetaChange = (fieldName, index, metaField, value) => {
    setContent(prev => {
      const updatedFiles = [...prev[fieldName]];
      updatedFiles[index][metaField] = value;
      return { ...prev, [fieldName]: updatedFiles };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(content).forEach(key => {
      if (typeof content[key] === 'object' && content[key] !== null) {
        formData.append(key, JSON.stringify(content[key]));
      } else if (content[key] !== undefined && content[key] !== null) {
        formData.append(key, content[key]);
      }
    });

    Object.keys(files).forEach(key => {
      if (files[key] && files[key].length > 0) {
        for (let i = 0; i < files[key].length; i++) {
          formData.append(key, files[key][i]);
        }
      }
    });

    try {
      await axios.post(`/api/content/${pageName}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNotification({ message: 'Content updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error updating content:', error);
      setNotification({ message: 'Failed to update content.', type: 'error' });
    } finally {
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            name={field.name}
            value={content[field.name] || ''}
            onChange={handleTextChange}
            style={{ width: '100%' }}
          />
        );
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={content[field.name] || ''}
            onChange={handleTextChange}
            style={{ width: '100%', minHeight: '100px' }}
          />
        );
      case 'file':
        const currentImages = content[field.name] || [];
        const imageUrls = Array.isArray(currentImages) ? currentImages.map(img => img.url).filter(Boolean) : [];
        return (
            <div>
                <ImageEditor
                    fieldName={field.name}
                    initialImageUrls={imageUrls}
                    onChange={handleFileChange}
                    multiple={field.multiple || false}
                />
                <div style={{ marginTop: '10px' }}>
                    <input
                        type="text"
                        placeholder="Or add image URL"
                        value={urlInputs[field.name] || ''}
                        onChange={(e) => handleUrlInputChange(field.name, e.target.value)}
                        style={{ width: 'calc(100% - 120px)', marginRight: '10px' }}
                    />
                    <button type="button" onClick={() => handleAddUrl(field.name)}>Add from URL</button>
                </div>
            </div>
        );
      case 'custom':
        const CustomComponent = field.component;
        const componentProps = {
          onChange: (fieldName, value) => setContent(prev => ({ ...prev, [fieldName]: value })),
        };
        if (field.name === 'instructors' || field.name === 'posts' || field.name === 'programs') {
            try {
                componentProps[field.name] = typeof content[field.name] === 'string' ? JSON.parse(content[field.name] || '[]') : content[field.name] || [];
            } catch {
                componentProps[field.name] = [];
            }
        }
        return (
          <CustomComponent
            name={field.name}
            {...componentProps}
          />
        );
      default:
        return <p>Unsupported field type</p>;
    }
  };

  return (
    <div ref={sectionRef} style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }} data-testid="editable-section">
      <h2>{sectionTitle}</h2>
      <form onSubmit={handleSubmit}>
        {fields.map(field => (
          <div key={field.name} style={{ marginBottom: '15px' }} data-testid={`field-${field.name}`}>
            <label>{field.label}:</label>
            {renderField(field)}
            {field.type === 'file' && content[field.name] && Array.isArray(content[field.name]) && (
              <div>
                <p>Current files:</p>
                {content[field.name].map((file, index) => (
                  <div key={index} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                      <a href={file.url} target="_blank" rel="noopener noreferrer">{file.originalname || file.url}</a>
                      <button type="button" onClick={() => handleRemoveFile(field.name, file)} style={{ marginLeft: '10px' }}>Remove</button>
                    </div>
                    <div>
                      <label>Alignment: </label>
                      <select value={file.align || 'center'} onChange={(e) => handleImageMetaChange(field.name, index, 'align', e.target.value)}>
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                      <label style={{ marginLeft: '10px' }}>Width: </label>
                      <input type="text" value={file.width || '100%'} onChange={(e) => handleImageMetaChange(field.name, index, 'width', e.target.value)} style={{ width: '100px' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <button type="submit">Save Changes</button>
      </form>
      {notification.message && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px 20px',
          backgroundColor: notification.type === 'success' ? 'green' : 'red',
          color: 'white',
          borderRadius: '5px',
        }}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default EditableSection;
