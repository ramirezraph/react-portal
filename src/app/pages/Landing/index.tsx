import * as React from 'react';
import { Helmet } from 'react-helmet-async';

import image from './images/undraw_communicate.svg';

export function Landing() {
  return (
    <>
      <Helmet>
        <title>Landing</title>
      </Helmet>
      <div className="w-screen h-screen flex items-center space-x-10 p-6">
        <div className="flex-1 flex justify-end ">
          <img src={image} className="object-cover" alt="Undraw" width={600} />
        </div>
        <div className="flex-1 h-full flex flex-col justify-center">
          <span className="text-xl leading-loose select-none text-zinc-800">
            welcome to
          </span>
          <h1 className="text-6xl select-none">DPVMHS Portal</h1>
          <span className="text-xl leading-loose select-none text-zinc-800">
            Dr. Pablito V. Mendoza Sr. High School
          </span>
          <button className="bg-primary w-fit py-2 px-24 text-white rounded-sm mt-24">
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}
