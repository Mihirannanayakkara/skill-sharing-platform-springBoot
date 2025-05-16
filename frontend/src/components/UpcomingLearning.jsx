import React from 'react';
import { motion } from 'framer-motion';

const UpcomingLearning = () => {
    // This could be fetched from an API in a real application
    const events = [
        {
            title: 'Advanced React Workshop',
            date: 'May 12, 2025',
            time: '2:00 PM'
        },
        {
            title: 'Cloud Computing Webinar',
            date: 'May 15, 2025',
            time: '6:30 PM'
        },
        {
            title: 'DevOps Community Meetup',
            date: 'May 20, 2025',
            time: '5:00 PM'
        }
    ];

    return (
        <motion.div
            className="bg-white rounded-lg shadow-sm p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Learning Events</h2>
            <div className="space-y-4">
                {events.map((event, index) => (
                    <div key={index} className="border-l-4 border-blue-600 pl-4">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-600">{event.date} • {event.time}</p>
                    </div>
                ))}
            </div>
            <button className="mt-4 w-full bg-blue-50 text-blue-700 font-medium py-2 rounded-md hover:bg-blue-100">
                View All Tasks
            </button>
        </motion.div>
    );
};

export default UpcomingLearning;