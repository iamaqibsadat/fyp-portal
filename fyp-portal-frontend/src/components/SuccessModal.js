import React from 'react';

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg p-8 z-10">
        <h2 className="text-2xl font-bold mb-4">Success</h2>
        <p className="mb-4">The project request was successfully sent!</p>
        <button
          onClick={onClose}
          className="bg-purple-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-800 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
