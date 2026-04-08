import React from 'react';

interface TimelineEvent {
    id?: string | number;
    title?: string;
    timestamp?: string | number;
    address?: string;
    notes?: string;
}

const Timeline = ({ events }: { events: TimelineEvent[] }) => {
    const safeEvents = Array.isArray(events) ? events : [];
    
    if (safeEvents.length === 0) {
        return <p className="text-muted-foreground italic text-sm">No history available.</p>;
    }

    return (
        <div className="relative border-l border-primary/30 ml-4 py-2">
            {safeEvents.map((event, index) => (
                <div key={event?.id || index} className="mb-8 ml-6 relative group">
                    <span className="absolute -left-[33px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-background ring-4 ring-white/5 group-hover:ring-primary/30 transition-all">
                        <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,230,154,0.8)]"></span>
                    </span>
                    <div className="p-5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors relative -top-1">
                        <h3 className="flex items-center mb-1 text-lg font-bold text-foreground">
                            {event?.title || 'Unknown Event'}
                        </h3>
                        <time className="block mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                            {event?.timestamp ? new Date(event.timestamp).toLocaleString() : 'Date Unknown'}
                        </time>
                        <p className="mb-2 font-mono text-xs text-muted-foreground break-all bg-black/40 p-2 rounded-lg border border-white/5">
                            {event?.address || ''}
                        </p>
                        {event?.notes && <p className="text-sm text-muted-foreground bg-black/20 p-3 rounded-lg mt-3 border border-white/5 leading-relaxed">{event.notes}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Timeline;
