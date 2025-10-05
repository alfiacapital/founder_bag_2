import React from 'react';
import { FiClock, FiSun, FiCalendar } from 'react-icons/fi';

const ProductivityCards = ({ productivity = {} }) => {
    const cards = [
        {
            title: 'Most Productive Hour',
            value: productivity?.mostProductiveHour || '--:--',
            icon: FiClock,
            color: 'from-cyan-500 to-cyan-600'
        },
        {
            title: 'Most Productive Day',
            value: productivity?.mostProductiveDay || '--',
            icon: FiSun,
            color: 'from-yellow-500 to-yellow-600'
        },
        {
            title: 'Most Productive Month',
            value: productivity?.mostProductiveMonth || '--',
            icon: FiCalendar,
            color: 'from-pink-500 to-pink-600'
        }
    ];

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
            {cards.map((card, index) => (
                <div key={index} className='rounded-button border border-dark-stroke bg-dark-bg2 p-4'>
                    {/* Icon with gradient background */}
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                        <card.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className='text-dark-text2 text-md font-medium'>{card.title}</h3>
                    <p className='text-white pt-2 text-md'>{card.value}</p>
                </div>
            ))}
        </div>
    );
};

export default ProductivityCards;

