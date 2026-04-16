import React from 'react';

const Timeline = ({ events }) => {
    if (!events || events.length === 0) {
        return <p className="text-slate-500 italic">No history available.</p>;
    }

    return (
        <div className="relative border-l border-indigo-500/20 ml-4 py-2">
            {events.map((event, index) => (
                <div key={index} className="mb-8 ml-6 relative">
                    <span className="absolute -left-8 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 border border-indigo-400 ring-4 ring-indigo-500/10 backdrop-blur-md shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                        <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
                    </span>
                    <div className="glass-panel p-5 rounded-xl relative -top-1 border border-white/5 bg-slate-900/40">
                        <h3 className="flex items-center mb-1 font-display text-xl font-bold text-slate-100">
                            {event.title}
                        </h3>
                        <time className="block mb-3 text-xs font-mono font-bold tracking-widest leading-none text-indigo-400 uppercase">
                            {new Date(event.timestamp).toLocaleString()}
                        </time>
                        <p className="mb-3 font-mono text-sm text-slate-300 break-all bg-slate-950/50 p-3 rounded-lg border border-indigo-500/10 shadow-inner">
                            {event.address}
                        </p>
                        {event.notes && <p className="text-sm font-medium text-slate-400 border-l-[3px] border-indigo-500/50 pl-3 mt-3">{event.notes}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Timeline;
