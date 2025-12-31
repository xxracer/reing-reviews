import React from 'react';
import './ProgramsEditor.css';

const ProgramsEditor = ({ fieldName, value, onChange }) => {
    const programs = Array.isArray(value) ? value : [];

    const handleProgramChange = (index, field, newValue) => {
        const newPrograms = [...programs];
        newPrograms[index] = { ...newPrograms[index], [field]: newValue };
        onChange(fieldName, newPrograms);
    };

    const addProgram = () => {
        onChange(fieldName, [...programs, { title: '', path: '', description: '', image: '', alt: '' }]);
    };

    const removeProgram = (index) => {
        const newPrograms = programs.filter((_, i) => i !== index);
        onChange(fieldName, newPrograms);
    };

    return (
        <div className="programs-editor">
            {programs.map((program, index) => (
                <div key={index} className="program-item">
                    <input
                        type="text"
                        placeholder="Title"
                        value={program.title || ''}
                        onChange={(e) => handleProgramChange(index, 'title', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Path (e.g., /kids-program)"
                        value={program.path || ''}
                        onChange={(e) => handleProgramChange(index, 'path', e.target.value)}
                    />
                    <textarea
                        placeholder="Description"
                        value={program.description || ''}
                        onChange={(e) => handleProgramChange(index, 'description', e.target.value)}
                        rows="3"
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={program.image || ''}
                        onChange={(e) => handleProgramChange(index, 'image', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Image Alt Text"
                        value={program.alt || ''}
                        onChange={(e) => handleProgramChange(index, 'alt', e.target.value)}
                    />
                    <button type="button" onClick={() => removeProgram(index)}>Remove</button>
                </div>
            ))}
            <button type="button" onClick={addProgram}>Add Program</button>
        </div>
    );
};

export default ProgramsEditor;
