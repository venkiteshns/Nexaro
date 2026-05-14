import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZap, FiTool, FiMonitor, FiTruck } from 'react-icons/fi';
import TaskCard from '../TaskCard/TaskCard';

const categories = ['All', 'Electrician', 'Plumber', 'Painter', 'Tutor', 'Carpenter'];

const mockTasks = [
  {
    id: 1,
    title: 'Complete house wiring for new extension',
    description: 'Looking for a licensed electrician to wire a newly built 2-bedroom extension. Materials will be provided. Need someone who can start immediately.',
    price: ' ₹450',
    postedTime: '2 hours ago',
    location: 'Downtown',
    distance: '2.5 km',
    category: 'Electrician',
    isUrgent: true,
    icon: FiZap
  },
  {
    id: 2,
    title: 'Fix leaking pipe in main bathroom',
    description: 'The pipe under the sink is leaking heavily. Need an emergency fix before it damages the wooden cabinets.',
    price: ' ₹80',
    postedTime: '5 hours ago',
    location: 'Westside',
    distance: '4.1 km',
    category: 'Plumber',
    isUrgent: true,
    icon: FiTool
  },
  {
    id: 3,
    title: 'Assemble IKEA Pax Wardrobe',
    description: 'Need help assembling a large IKEA Pax wardrobe system. All boxes are in the room, just need someone with the right tools and experience.',
    price: ' ₹120',
    postedTime: '1 day ago',
    location: 'North Hills',
    distance: '6.8 km',
    category: 'Carpenter',
    isUrgent: false,
    icon: FiTool
  }
];

const TaskFeed = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredTasks = activeFilter === 'All'
    ? mockTasks
    : mockTasks.filter(task => task.category === activeFilter);

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Tasks Near You</h2>
        <a href="#view-all" className="section-action">View Map</a>
      </div>

      <div className="filter-chips">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-chip ${activeFilter === category ? 'active' : ''}`}
            onClick={() => setActiveFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="task-feed">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map(task => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <TaskCard task={task} />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="task-card"
            style={{ justifyContent: 'center', textAlign: 'center', color: 'var(--color-muted)' }}
          >
            No tasks found in this category near your location.
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TaskFeed;
