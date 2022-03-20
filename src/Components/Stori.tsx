import React, { useEffect, useState } from 'react';
import useTimeout from '../hooks/useTimeout';

interface StoriProps {
    duration?: number;
    autoPlay?: boolean;
    start?: number;
    onFinish?: () => void;
    children: React.ReactNode[];
}

export default function Stori({
    duration = 5000,
    autoPlay = true,
    start = 0,
    onFinish = () => null,
    children
}: StoriProps) {
    const [active, setActive] = useState(start);
    const [state, setState] = useState<'idle' | 'play'>('idle');

    const items = children;
    const itemmsCount = items.length;
    const itemsMax = itemmsCount - 1;

    useTimeout(() => {
        setNextSlide();
    }, state === 'play' ? duration : null)

    useEffect(() => {
        if (autoPlay) setState('play');
    }, [autoPlay, active]);

    function setPosition(index: number) {
        setState('idle');

        if (index > itemsMax || index < 0) {
            onFinish();
            setActive(0)
            return;
        }

        setActive(index)
    }

    function setNextSlide() {
        setPosition(active + 1)
    }

    function setPreviousSlide() {
        setPosition(active - 1)
    }

    return (
        <div className="relative w-full text-white" role="region" aria-roledescription="carousel">
            <div className="absolute z-20 flex w-full gap-2 p-4">
                {items.map((item, index) => (
                    <div className="relative h-1 overflow-hidden rounded-full shadow-inner bg-white/30 grow transform-cpu" key={index}>
                        <div
                            className={`bg-white inset-0 absolute -translate-x-[101%] ${active > index ? '!translate-x-0' : ''} ${active === index && state === 'play' ? 'transition-transform duration-[var(--duration)] ease-linear !translate-x-0' : ''}`}
                            style={{'--duration': `${duration}ms`} as React.CSSProperties}
                        ></div>
                        <button className="absolute inset-0 transition hover:bg-white/50" aria-controls="items" onClick={() => void setPosition(index)}>
                            <span className="sr-only">Activate slide {index + 1}</span>
                        </button>
                    </div>
                ))}
            </div>

            <div className="absolute inset-0 z-10 flex items-stretch">
                <button className="grow" aria-controls="items" onClick={() => setPreviousSlide()}>
                    <div className="sr-only">Previous</div>
                </button>
                <button className="grow" aria-controls="items" onClick={() => setNextSlide()}>
                    <div className="sr-only">Next</div>
                </button>
            </div>

            <div className="relative w-full" aria-live="off" id="items">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition duration-1000 ${active == index ? 'opacity-100' : 'opacity-0'}`}
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