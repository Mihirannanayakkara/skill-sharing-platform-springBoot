import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';



const Notification = ({ message, isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full">
            <div className="mb-4">{message}</div>
            <div className="text-right">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;