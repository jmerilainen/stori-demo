import React, { useState } from 'react';
import { useQuery } from 'react-query';
import Stori from './Components/Stori';
import IconLoading from './Components/IconLoading';

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

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min;
}

function App() {
  const [limit, setLimit] = useState(randomNumber(1,10));
  const [page, setPage] = useState(randomNumber(1,100));

  const { isLoading, error, data } = useQuery<PicsumItem[]>(['stories', limit, page], () =>
    fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`).then((res) => res.json())
  );

  function onFinish() {
    setLimit(randomNumber(1,10));
    setPage(randomNumber(1,100));
  }

  if (error) return <div>An error has occurred</div>;

  const items = data?.map(getImage) ?? [];

  return (
    <div className="flex items-center justify-center w-full min-h-screen py-20 bg-slate-50 dark:bg-slate-800 dark:text-white">
      <div className=" w-full max-w-[400px]  space-y-8">
        <div className="italic font-bold">
          Stori.
        </div>
        <div className="aspect-[9/16] bg-black text-white overflow-hidden rounded-lg flex relative transform-cpu shadow-xl">
          {isLoading
            ? <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 animate-spin">
                  <IconLoading />
              </div>
            </div>
            : <Stori onFinish={() => onFinish()}>
              {items.map((item, index) => (
                  <div className="relative">
                    <img key={item.id} src={item.url} className={`object-cover `} alt={item.alt} />
                    <div className="absolute bottom-0 right-0 z-10 p-4 text-xs text-white drop-shadow ">@ {item.alt}</div>
                  </div>
              ))}
            </Stori>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
