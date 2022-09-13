import * as React from 'react';
import { Helmet } from 'react-helmet-async';

import { Button, createStyles, Image, Text } from '@mantine/core';

import image from './images/undraw_communicate.svg';
import { useAuth0 } from '@auth0/auth0-react';

const useStyles = createStyles(theme => ({
  landingImage: {
    width: 600,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      width: 350,
    },
  },
}));

export function Landing() {
  const { loginWithRedirect } = useAuth0();

  const { classes } = useStyles();

  return (
    <>
      <Helmet>
        <title>Welcome</title>
      </Helmet>
      <div className="flex h-screen w-screen flex-col justify-between">
        <section className="mt-8 flex w-full flex-1 flex-col items-center space-x-6 xl:mt-0 xl:flex-row xl:space-x-10">
          <div className="flex justify-end xl:flex-1">
            <Image
              src={image}
              fit="cover"
              alt="Undraw"
              className={classes.landingImage}
            />
          </div>
          <div className="mt-12 flex w-11/12 flex-1 flex-col md:mt-16 md:px-20 xl:mt-0 xl:justify-center">
            <Text className="w-full select-none text-xl leading-loose text-gray-600 xl:w-full xl:text-xl">
              welcome to
            </Text>
            <Text className="select-none text-4xl font-bold leading-normal md:text-6xl md:font-semibold">
              Student Portal
            </Text>
            <Text className="w-11/12 select-none text-xl leading-loose text-gray-600 md:mt-6 md:w-full md:text-xl">
              At vero eos et accusamus et iusto odio dignissimos.
            </Text>
            <Button
              className="mt-12 w-fit rounded-sm bg-primary py-2 px-24 text-white md:mt-24"
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
