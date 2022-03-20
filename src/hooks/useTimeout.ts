import React from 'react';

// Source: https://www.joshwcomeau.com/snippets/react-hooks/use-timeout/
// + https://overreacted.io/making-setinterval-declarative-with-react-hooks/

export default function useTimeout(callback: () => void, delay: number | null) {
    const timeoutRef = React.useRef(0);
    const savedCallback = React.useRef(callback);

    React.useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    React.useEffect(() => {
        const tick = () => savedCallback.current();

        if (typeof delay === 'number') {
            timeoutRef.current = window.setTimeout(tick, delay);

            return () => window.clearTimeout(timeoutRef.current);
        }
    }, [delay]);

    return timeoutRef;
};