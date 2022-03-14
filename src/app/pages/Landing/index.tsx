import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import image from './images/undraw_communicate.svg';

export function Landing() {
  return (
    <>
      <Helmet>
        <title>Welcome</title>
      </Helmet>
      <div className="flex h-screen w-screen flex-col justify-between">
        <section className="flex w-full flex-1 items-center space-x-10">
          <div className="flex flex-1 justify-end">
            <img
              src={image}
              className="object-cover"
              alt="Undraw"
              width={600}
            />
          </div>
          <div className="flex h-full flex-1 flex-col justify-center">
            <span className="select-none text-xl leading-loose text-zinc-800">
              welcome to
            </span>
            <h1 className="select-none text-6xl font-semibold">
              DPVMHS Portal
            </h1>
            <span className="select-none text-xl leading-loose text-zinc-800">
              Dr. Pablito V. Mendoza Sr. High School
            </span>
            <Link
              to="/"
              className="mt-24 w-fit rounded-sm bg-primary-500 py-2 px-24 text-white"
            >
              Get Started
            </Link>
          </div>
        </section>
        <footer className="flex justify-between bg-neutral-500 py-3 px-8 text-sm">
          <span>&copy; All rights reserved.</span>
          <span>
            developed by <span className="text-primary-500">Lorem Ipsum</span>
          </span>
        </footer>
      </div>
    </>
  );
}
