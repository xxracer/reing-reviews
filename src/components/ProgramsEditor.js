import React, { useState } from 'react';
import axios from 'axios';

const ProgramsEditor = ({ name, programs, onChange }) => {
  const [localPrograms, setLocalPrograms] = useState(programs);
  const [fileInputs, setFileInputs] = useState({});

  const handleProgramChange = (index, field, value) => {
    const updatedPrograms = [...localPrograms];
    updatedPrograms[index][field] = value;
    setLocalPrograms(updatedPrograms);
    onChange(name, updatedPrograms);
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      setFileInputs(prev => ({ ...prev, [index]: file }));
    }
  };

  const handleUpload = async (index) => {
    const file = fileInputs[index];
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const imageUrl = response.data.url;
      handleProgramChange(index, 'image', imageUrl);
      setFileInputs(prev => {
        const newFileInputs = { ...prev };
        delete newFileInputs[index];
        return newFileInputs;
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('File upload failed.');
    }
  };

  const addProgram = () => {
    const newPrograms = [...localPrograms, { title: '', description: '', image: '' }];
    setLocalPrograms(newPrograms);
    onChange(name, newPrograms);
  };

  const removeProgram = (index) => {
    const updatedPrograms = localPrograms.filter((_, i) => i !== index);
    setLocalPrograms(updatedPrograms);
    onChange(name, updatedPrograms);
  };

  return (
    <div>
      {localPrograms.map((program, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Program Title"
            value={program.title}
            onChange={(e) => handleProgramChange(index, 'title', e.target.value)}
            style={{ width: '100%', marginBottom: '5px' }}
          />
          <textarea
            placeholder="Program Description"
            value={program.description}
            onChange={(e) => handleProgramChange(index, 'description', e.target.value)}
            style={{ width: '100%', marginBottom: '5px' }}
          />
          <div>
            <input
              type="text"
              placeholder="Image URL"
              value={program.image}
              onChange={(e) => handleProgramChange(index, 'image', e.target.value)}
              style={{ width: 'calc(100% - 200px)', marginRight: '10px' }}
            />
            <input
              type="file"
              onChange={(e) => handleFileChange(index, e)}
              style={{ display: 'none' }}
              id={`file-upload-${index}`}
            />
            <label htmlFor={`file-upload-${index}`} className="button" style={{
              cursor: 'pointer',
              padding: '5px 10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              backgroundColor: '#f0f0f0',
              display: 'inline-block'
            }}>
              Choose File
            </label>
            <button type="button" onClick={() => handleUpload(index)} disabled={!fileInputs[index]} style={{ marginLeft: '10px' }}>
              Upload
            </button>
          </div>
          {program.image && <img src={program.image} alt={program.title || 'Program image'} style={{ width: '100px', marginTop: '10px' }} />}
          <button type="button" onClick={() => removeProgram(index)} style={{ marginTop: '10px' }}>
            Remove Program
          </button>
        </div>
      ))}
      <button type="button" onClick={addProgram}>Add Program</button>
    </div>
  );
};

export default ProgramsEditor;
