import React, { useEffect, useState } from 'react';
import useTimeout from '../hooks/useTimeout';

interface StoriProps {
    duration?: number;
    start?: number;
    children: React.ReactNode[];
}

export default function Stori({
    duration = 5000,
    start = 0,
    children
}: StoriProps) {

    const [active, setActive] = useState(start);
    const [state, setState] = useState('idle');

    const items = children;
    const itemmsCount = items.length;
    const itemsMax = itemmsCount - 1;

    useTimeout(() => {
        const next = active + 1 > itemsMax ? 0 : active + 1;
        setActive(next);
        setState('idle');
    }, state !== 'idle' ? duration : null)


    useEffect(() => {
        if (state === 'idle') setState('running');
    }, [state]);

    function setPosition(index: number) {
        if (index === 0) {
            setState('idle')
        }
        setActive(index)
    }

    return (
        <div className="relative w-full text-white" role="region" aria-roledescription="carousel">
            <div className="absolute z-10 flex w-full gap-2 p-4">
            {items.map((item, index) => (
                <div className="relative h-1 overflow-hidden rounded-full bg-white/30 grow transform-cpu" key={index}>
                <div
                    className={`bg-white inset-0 absolute -translate-x-full ${active > index ? 'translate-x-0' : ''} ${active == index && state === 'running' ? 'transition-transform duration-[var(--duration)] ease-linear !translate-x-0' : ''}`}
                    style={{'--duration': `${duration}ms`} as React.CSSProperties}
                ></div>
                <button className="absolute inset-0" aria-controls="items" onClick={() => void setPosition(index)}>
                    <span className="sr-only">Activate slide {index + 1}</span>
                </button>
                </div>
            ))}
            </div>

            <div className="relative w-full" aria-live="off" id="items">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition duration-1000 ${active >= index ? 'opacity-100' : 'opacity-0'}`}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${index + 1} of ${itemmsCount}`}
                    >
                        {item}
                    </div>
                ))}
            </div>
        </div>
    )
}