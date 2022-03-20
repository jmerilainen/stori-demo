import React, { useEffect, useLayoutEffect, useState } from 'react';
import Stori from './Components/Stori';

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
    url: `https://picsum.photos/id/${data.id}/400/711`,
    alt: data.author,
  };
}


function App() {

  const [items, setItems] = useState<Pic[]>([
    {"id":"100","author":"Tina Rataj","width":2500,"height":1656,"url":"https://unsplash.com/photos/pwaaqfoMibI","download_url":"https://picsum.photos/id/100/2500/1656"},
    {"id":"1000","author":"Lukas Budimaier","width":5626,"height":3635,"url":"https://unsplash.com/photos/6cY-FvMlmkQ","download_url":"https://picsum.photos/id/1000/5626/3635"},
    {"id":"1001","author":"Danielle MacInnes","width":5616,"height":3744,"url":"https://unsplash.com/photos/1DkWWN1dr-s","download_url":"https://picsum.photos/id/1001/5616/3744"}
  ].map(getImage));

  return (
    <div className="flex items-center justify-center w-full min-h-screen py-20">
      <div className="aspect-[9/16] bg-black overflow-hidden rounded-lg w-full max-w-[400px] flex relative transform-cpu ">
        <Stori>
          {items.map((item, index) => (
              <img key={item.id} src={item.url} className={`object-cover absolute inset-0`} alt={item.alt} />
          ))}
        </Stori>
      </div>
    </div>
  );
}

export default App;
