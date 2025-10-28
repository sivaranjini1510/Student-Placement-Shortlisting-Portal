import React from 'react';

const GPAInput = ({ gpas, onChange }) => (
  <div className="grid grid-cols-2 gap-4">
    {gpas.map((gpa, index) => (
      <input
        key={index}
        type="number"
        step="0.01"
        value={gpa}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder={`Semester ${index + 1} GPA`}
        className="border p-2"
      />
    ))}
  </div>
);

export default GPAInput;
