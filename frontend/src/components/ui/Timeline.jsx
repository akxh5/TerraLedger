import React from 'react';

const Timeline = ({ events }) => {
    if (!events || events.length === 0) {
        return <p className="text-slate-500 italic">No history available.</p>;
    }

    return (
        <div className="relative border-l border-blue-200/50 ml-4 py-2">
            {events.map((event, index) => (
                <div key={index} className="mb-8 ml-6 relative">
                    <span className="absolute -left-8 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 ring-4 ring-white backdrop-blur-md">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    </span>
                    <div className="glass-panel p-4 rounded-xl relative -top-1">
                        <h3 className="flex items-center mb-1 text-lg font-semibold text-slate-800">
                            {event.title}
                        </h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-blue-400">
                            {new Date(event.timestamp).toLocaleString()}
                        </time>
                        <p className="mb-2 text-base font-normal text-slate-600 font-mono text-sm break-all">
                            {event.address}
                        </p>
                        {event.notes && <p className="text-sm text-slate-500 bg-white/30 p-2 rounded-lg mt-2">{event.notes}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Timeline;
