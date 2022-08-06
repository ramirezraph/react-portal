import * as React from 'react';
import { Helmet } from 'react-helmet-async';

import { Button, Image, Text } from '@mantine/core';

import image from './images/undraw_communicate.svg';
import { useAuth0 } from '@auth0/auth0-react';

export function Landing() {
  const { loginWithRedirect } = useAuth0();

  return (
    <>
      <Helmet>
        <title>Welcome</title>
      </Helmet>
      <div className="flex h-screen w-screen flex-col justify-between">
        <section className="flex w-full flex-1 items-center space-x-10">
          <div className="flex flex-1 justify-end ">
            <Image src={image} fit="cover" alt="Undraw" width={600} />
          </div>
          <div className="flex h-full flex-1 flex-col justify-center">
            <Text className="select-none text-xl leading-loose text-gray-600">
              welcome to
            </Text>
            <Text className="select-none text-6xl font-semibold leading-normal">
              Student Portal
            </Text>
            <Text className="select-none text-xl leading-loose text-gray-600">
              At vero eos et accusamus et iusto odio dignissimos.
            </Text>
            <Button
              className="mt-24 w-fit rounded-sm bg-primary py-2 px-24 text-white"
              onClick={() => loginWithRedirect()}
            >
              Get Started
            </Button>
          </div>
        </section>
        <footer className="flex justify-between bg-document py-3 px-8 text-sm">
          <span>&copy; All rights reserved.</span>
          <span>
            developed by <span className="text-primary">Lorem Ipsum</span>
          </span>
        </footer>
      </div>
    </>
  );
}
