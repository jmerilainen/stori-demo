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
    onFinish: () => void;
}

const useTimer = ({
    speed,
    active,
    slides,
    autoPlay,
    onFinish,
}: TimerProps) => {
    const [currentSlide, setCurrentSlide] = useState(active);
    const [state, setState] = useState<'idle' | 'play' | 'queue'>('idle');

    const itemmsCount = slides;
    const itemsMax = itemmsCount - 1;

    useTimeout(() => {
        setState('idle');
        if (autoPlay) {
            setCurrentSlide(currentSlide + 1);
        }
    }, state === 'play' ? speed : null)

    useEffect(() => {
        if (currentSlide > itemsMax || currentSlide < 0) {
            setState('idle');
            onFinish();
            return;
        }
    }, [currentSlide, itemsMax, onFinish]);

    useEffect(() => {
        if (state === 'queue') setState('play');
    }, [state]);

    useEffect(() => {
        if (autoPlay) setState('queue');
    }, [autoPlay, currentSlide])

    const changeSlide = (index: number) => {
        setState('idle');
        setCurrentSlide(index)
    }

    return {
        currentSlide,
        setSlide: (index: number) => changeSlide(index),
        nextSlide: () => changeSlide(currentSlide + 1),
        prevSlide: () => changeSlide(currentSlide - 1),
    }
}

export default function Stori({
    duration = 5000,
    autoPlay = true,
    start = 0,
    onFinish = () => null,
    children
}: StoriProps) {

    const { currentSlide, nextSlide, prevSlide, setSlide } = useTimer({
        children: children,
        slides: children.length,
        autoPlay,
        speed: duration,
        active: start,
        onFinish: () => onFinish()
    });

    return (
        <>
            <div className="relative w-full h-full text-white" role="region" aria-roledescription="carousel">
                <div className="absolute z-20 flex w-full gap-2 p-4">
                    {children.map((item, index) => (
                        <TimeBar
                            key={index}
                            label={`Activte slide ${index + 1}`}
                            duration={duration}
                            slide={index}
                            animate={index === currentSlide}
                            fill={currentSlide > index}
                            onClick={() => setSlide(index)}
                        />
                    ))}
                </div>

                <div className="absolute inset-0 z-10 flex items-stretch">
                    <button className="grow" aria-controls="items" onClick={() => prevSlide()}>
                        <div className="sr-only">Previous</div>
                    </button>
                    <button className="grow" aria-controls="items" onClick={() => nextSlide()}>
                        <div className="sr-only">Next</div>
                    </button>
                </div>

                <div className="relative w-full h-full" aria-live="off" id="items">
                    {children.map((item, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition duration-1000 opacity-10 flex ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`${index + 1} of ${children.length}`}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}