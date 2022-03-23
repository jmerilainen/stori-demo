import React, { useEffect, useRef, useState } from 'react';
import useTimeout from '../hooks/useTimeout';

// TODO: Refactor the file
interface StoriProps {
    duration?: number;
    autoPlay?: boolean;
    start?: number;
    onFinish?: () => void;
    children: React.ReactNode[];
}

interface TimeBarProps {
    fill?: boolean;
    animate?: boolean;
    duration: number;
    label: string;
    slide: number;
    onClick: () => void;
}

function TimeBar({
    fill = false,
    animate = false,
    duration,
    label,
    onClick
}: TimeBarProps) {
    const [animated, setAnimated] = useState(false);

    const bar = useRef(null);

    useEffect(() => {
        if (bar.current) setAnimated(true);

        return () => setAnimated(false);
    }, [animate]);

    return (
        <div className={`relative h-1 overflow-hidden rounded-full shadow-inner ${fill ? 'bg-white' : 'bg-white/30'} grow transform-cpu`}>
            {animate ?
                <div
                    ref={bar}
                    className={`bg-white inset-0 absolute transition-transform duration-[var(--duration)] ease-linear ${! animated ? '-translate-x-[101%]' : ''}`}
                    style={{'--duration': `${duration}ms`} as React.CSSProperties}
                ></div>
                : ''
            }

            <button className="absolute inset-0 transition hover:bg-white/50" aria-controls="items" onClick={() => void onClick()}>
                <span className="sr-only">Activate slide {label + 1}</span>
            </button>
        </div>
    )
}

interface TimerProps {
    children: React.ReactNode;
    slides: number;
    active: number;
    speed: number;
    autoPlay: boolean;
    onChange: (n: number) => void;
    onFinish: () => void;
}

function Timer({
    children,
    speed,
    active,
    slides,
    autoPlay,
    onChange,
    onFinish,
}: TimerProps) {
    const [currentSlide, setCurrentSlide] = useState(active);
    const [state, setState] = useState<'idle' | 'play'>('idle');

    const itemmsCount = slides;
    const itemsMax = itemmsCount - 1;

    const setPosition = (index: number) => onChange(index)

    useTimeout(() => {
        setPosition(currentSlide + 1);
    }, state === 'play' ? speed : null)

    useEffect(() => {
        setState('idle');

        if (active > itemsMax || active < 0) {
            onFinish();
            return;
        }

        setCurrentSlide(active);
    }, [active, itemsMax, onFinish]);

    useEffect(() => {
        if (autoPlay) setState('play');
    }, [autoPlay, currentSlide]);

    return <>{children}</>;
}

export default function Stori({
    duration = 5000,
    autoPlay = true,
    start = 0,
    onFinish = () => null,
    children
}: StoriProps) {
    const [active, setActive] = useState(start);

    const setNextSlide = () => setActive(active + 1);
    const setPreviousSlide = () => setActive(active - 1);

    return (
        <Timer
            slides={children.length}
            active={active}
            autoPlay={autoPlay}
            onChange={(index) => setActive(index)}
            onFinish={() => onFinish()}
            speed={duration}
        >
            <div className="relative w-full text-white" role="region" aria-roledescription="carousel">
                <div className="absolute z-20 flex w-full gap-2 p-4">
                    {children.map((item, index) => (
                        <TimeBar
                            key={index}
                            label={`Activte slide ${index + 1}`}
                            duration={duration}
                            slide={index}
                            animate={index === active}
                            fill={active > index}
                            onClick={() => setActive(index)}
                        />
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
                    {children.map((item, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition duration-1000 opacity-10 ${active === index ? 'opacity-100' : 'opacity-0'}`}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`${index + 1} of ${children.length}`}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </Timer>
    )
}