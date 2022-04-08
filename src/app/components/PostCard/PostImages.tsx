import { Text, Image, Box, SimpleGrid } from '@mantine/core';
import * as React from 'react';

interface PostImage {
  url: string;
}
interface File {
  url: string;
  name: string;
  type: string;
}

export interface Post {
  id: string;
  ownerName: string;
  date: string;
  content: string;
  images?: PostImage[];
  files?: File[];
}

interface Prop {
  images?: PostImage[];
}

export function PostImages(props: Prop) {
  const { images } = props;

  const [upperImageCols, setUpperImageCols] = React.useState(1);
  const [lowerImageCols, setLowerImageCols] = React.useState(1);

  React.useEffect(() => {
    if (!images) return;

    if (images.length === 1) {
      setUpperImageCols(1);
    } else if (images.length === 2) {
      setUpperImageCols(2);
    }

    if (images.length === 3) {
      setUpperImageCols(1);
      setLowerImageCols(2);
    }

    if (images.length > 3) {
      setUpperImageCols(1);
      setLowerImageCols(3);
    }
  }, [images]);

  const onImageClicked = () => {
    console.log('image clicked');
  };

  const onMoreImageClicked = () => {
    console.log('more image clicked');
  };

  return (
    <>
      {images && (
        <SimpleGrid cols={upperImageCols} className="w-full" spacing={'xs'}>
          {images.slice(0, upperImageCols).map((image, index) => {
            return (
              <Image
                key={index}
                height={300}
                fit="cover"
                radius="md"
                src={image.url}
                alt="Post Image"
                className="w-full cursor-pointer"
                onClick={onImageClicked}
              />
            );
          })}
        </SimpleGrid>
      )}
      {images && images.length > 2 && (
        <SimpleGrid
          cols={lowerImageCols}
          className="-mt-1.5 w-full"
          spacing={'xs'}
        >
          {images.slice(1, 4).map((image, index) => {
            if (images.length > 4 && index === 2) {
              return (
                <Box
                  key={index}
                  onClick={onMoreImageClicked}
                  className="relative cursor-pointer rounded-md bg-black"
                >
                  <Text className="absolute left-0 right-0 top-0 bottom-0 z-10 ml-auto mt-auto mb-auto mr-auto h-10 w-full text-center text-4xl text-white">
                    +{images.length - 4}
                  </Text>
                  <Image
                    height={150}
                    fit="cover"
                    radius="md"
                    src={image.url}
                    alt="Post Image"
                    className="opacity-60"
                  />
                </Box>
              );
            } else {
              return (
                <Image
                  key={index}
                  height={150}
                  fit="cover"
                  radius="md"
                  src={image.url}
                  alt="Post Image"
                  className="w-full cursor-pointer"
                  onClick={onImageClicked}
                />
              );
            }
          })}
        </SimpleGrid>
      )}
    </>
  );
}
