import React, { useState, useCallback } from 'react';

const InstructorEditor = ({ name, instructors, onChange }) => {
  const [localInstructors, setLocalInstructors] = useState(instructors || []);

  const handleInstructorChange = useCallback((index, field, value) => {
    const updatedInstructors = [...localInstructors];
    updatedInstructors[index] = { ...updatedInstructors[index], [field]: value };
    setLocalInstructors(updatedInstructors);
    onChange(name, updatedInstructors);
  }, [localInstructors, name, onChange]);

  const addInstructor = useCallback(() => {
    const newInstructors = [...localInstructors, { id: Date.now(), name: '', bio: '', image: '' }];
    setLocalInstructors(newInstructors);
    onChange(name, newInstructors);
  }, [localInstructors, name, onChange]);

  const removeInstructor = useCallback((index) => {
    const updatedInstructors = localInstructors.filter((_, i) => i !== index);
    setLocalInstructors(updatedInstructors);
    onChange(name, updatedInstructors);
  }, [localInstructors, name, onChange]);

  return (
    <div>
      {localInstructors.map((instructor, index) => (
        <div key={instructor.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Name"
            value={instructor.name}
            onChange={(e) => handleInstructorChange(index, 'name', e.target.value)}
            style={{ width: '100%', marginBottom: '5px' }}
          />
          <textarea
            placeholder="Bio"
            value={instructor.bio}
            onChange={(e) => handleInstructorChange(index, 'bio', e.target.value)}
            style={{ width: '100%', minHeight: '80px', marginBottom: '5px' }}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={instructor.image}
            onChange={(e) => handleInstructorChange(index, 'image', e.target.value)}
            style={{ width: '100%', marginBottom: '5px' }}
          />
          <button type="button" onClick={() => removeInstructor(index)}>Remove Instructor</button>
        </div>
      ))}
      <button type="button" onClick={addInstructor}>Add Instructor</button>
    </div>
  );
};

export default InstructorEditor;
