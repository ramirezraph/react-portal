import * as React from 'react';
import { Helmet } from 'react-helmet-async';

import image from './images/undraw_communicate.svg';

export function Landing() {
  return (
    <>
      <Helmet>
        <title>Landing</title>
      </Helmet>
      <div className="flex h-screen w-screen items-center space-x-10 p-6">
        <div className="flex flex-1 justify-end ">
          <img src={image} className="object-cover" alt="Undraw" width={600} />
        </div>
        <div className="flex h-full flex-1 flex-col justify-center">
          <span className="select-none text-xl leading-loose text-zinc-800">
            welcome to
          </span>
          <h1 className="select-none text-6xl">DPVMHS Portal</h1>
          <span className="select-none text-xl leading-loose text-zinc-800">
            Dr. Pablito V. Mendoza Sr. High School
          </span>
          <button className="mt-24 w-fit rounded-sm bg-primary py-2 px-24 text-white">
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}
