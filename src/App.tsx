import React, { useEffect, useLayoutEffect, useState } from 'react';

interface PicsumItem {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

interface Pic {
  id: string;
  url: string;
  alt: string;
}

function getImage(data: PicsumItem): Pic {
  return {
    id: data.id,
    url: `https://picsum.photos/id/${data.id}/350/700`,
    alt: data.author,
  };
}

function App() {

  const [active, setActive] = useState(0);
  const [duration] = useState(5000);
  const [start, setStart] = useState(true);

  const [items, setItems] = useState<Pic[]>([
    {"id":"100","author":"Tina Rataj","width":2500,"height":1656,"url":"https://unsplash.com/photos/pwaaqfoMibI","download_url":"https://picsum.photos/id/100/2500/1656"},
    {"id":"1000","author":"Lukas Budimaier","width":5626,"height":3635,"url":"https://unsplash.com/photos/6cY-FvMlmkQ","download_url":"https://picsum.photos/id/1000/5626/3635"},
    {"id":"1001","author":"Danielle MacInnes","width":5616,"height":3744,"url":"https://unsplash.com/photos/1DkWWN1dr-s","download_url":"https://picsum.photos/id/1001/5616/3744"}
  ].map(getImage));

  const [image, setImage] = useState(items[active]);
  const [count] = useState(items.length);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = active + 1 > count - 1 ? 0 : active + 1;
      setActive(next);
    }, duration);
    return () => void clearInterval(timer);
  }, [duration, active, count]);

  // useEffect(() => {
  //   setImage(getImage(items[active]));
  // }, [active, items]);

  // useEffect(() => {
  //   setImage(getImage(items[active]));
  // }, [active, items]);

  useEffect(() => {
    setStart(true)
    const request = requestAnimationFrame(() => {
      setStart(false)
    });

    return () => void cancelAnimationFrame(request);
  }, [active])


  return (
    <div className="w-full min-h-screen flex items-center justify-center  py-20">
      <div className="aspect-[9/18] bg-black overflow-hidden rounded-lg w-full max-w-[350px] flex relative">
        <div className="absolute w-full flex gap-2 z-10 p-4">
          {items.map((item, index) => (
            <div className="bg-white/30 h-1 rounded-full grow relative overflow-hidden transform-cpu " key={item.id}>
              <div
                className={`bg-white inset-0 absolute -translate-x-full ${active > index ? 'translate-x-0' : ''} ${active == index && ! start ? 'transition-transform duration-[var(--duration)] ease-linear !translate-x-0' : ''}`}
                style={{'--duration': `${duration}ms`} as React.CSSProperties}
              ></div>
              <button className="absolute inset-0" onClick={() => void setActive(index)}>
                <span className="sr-only">Activate</span>
              </button>
            </div>
          ))}
        </div>

        <div className="relative w-full">
           {items.map((item, index) => (
              <img key={item.id} src={item.url} className={`object-cover absolute inset-0 transition duration-1000 ${active >= index ? 'opacity-100' : 'opacity-0'}`} alt={image.alt} />
           ))}
        </div>

      </div>
    </div>
  );
}

export default App;
