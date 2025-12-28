import React, { useState, useEffect } from 'react';

const InstructorEditor = ({ instructors, onChange }) => {
  const [localInstructors, setLocalInstructors] = useState(instructors || []);

  useEffect(() => {
    onChange({ target: { name: 'instructors', value: JSON.stringify(localInstructors) } });
  }, [localInstructors]);

  const handleInstructorChange = (index, field, value) => {
    const updatedInstructors = [...localInstructors];
    updatedInstructors[index][field] = value;
    setLocalInstructors(updatedInstructors);
  };

  const addInstructor = () => {
    setLocalInstructors([...localInstructors, { id: Date.now(), name: '', bio: '', image: '' }]);
  };

  const removeInstructor = (index) => {
    setLocalInstructors(localInstructors.filter((_, i) => i !== index));
  };

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
