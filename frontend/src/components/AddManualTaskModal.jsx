import React, { useState } from 'react';

const AddManualTaskModal = ({ onSave, onCancel }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const handleSubmit = () => {
    if (taskName.trim() === '') return;
    onSave({ taskName, taskDescription, completed: false });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Add New Task</h2>
        <input
          className="border w-full p-2 mb-3 rounded"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <textarea
          className="border w-full p-2 mb-3 rounded"
          placeholder="Task Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onCancel}>
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddManualTaskModal;
