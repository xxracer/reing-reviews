import React from 'react';
import './InstructorEditor.css';

const InstructorEditor = ({ fieldName, value, onChange }) => {
    const instructors = Array.isArray(value) ? value : [];

    const handleInstructorChange = (index, field, newValue) => {
        const newInstructors = [...instructors];
        newInstructors[index] = { ...newInstructors[index], [field]: newValue };
        onChange(fieldName, newInstructors);
    };

    const addInstructor = () => {
        onChange(fieldName, [...instructors, { name: '', bio: '', image: '' }]);
    };

    const removeInstructor = (index) => {
        const newInstructors = instructors.filter((_, i) => i !== index);
        onChange(fieldName, newInstructors);
    };

    return (
        <div className="instructor-editor">
            {instructors.map((instructor, index) => (
                <div key={index} className="instructor-item">
                    <input
                        type="text"
                        placeholder="Name"
                        value={instructor.name || ''}
                        onChange={(e) => handleInstructorChange(index, 'name', e.target.value)}
                    />
                    <textarea
                        placeholder="Bio"
                        value={instructor.bio || ''}
                        onChange={(e) => handleInstructorChange(index, 'bio', e.target.value)}
                        rows="5"
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={instructor.image || ''}
                        onChange={(e) => handleInstructorChange(index, 'image', e.target.value)}
                    />
                    <button type="button" onClick={() => removeInstructor(index)}>Remove</button>
                </div>
            ))}
            <button type="button" onClick={addInstructor}>Add Instructor</button>
        </div>
    );
};

export default InstructorEditor;
