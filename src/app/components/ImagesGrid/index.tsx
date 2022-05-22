import { Text, SimpleGrid, Image, Box, ActionIcon } from '@mantine/core';
import * as React from 'react';
import { X } from 'tabler-icons-react';
import { IFile } from '../PostCard';
import FsLightbox from 'fslightbox-react';

interface Props {
  images: IFile[];
  isOnEdit?: boolean;
  onImageRemove?: (image: IFile) => void;
}

export function ImagesGrid(props: Props) {
  const { images, isOnEdit, onImageRemove } = props;

  const [upperImageCols, setUpperImageCols] = React.useState(1);
  const [lowerImageCols, setLowerImageCols] = React.useState(1);
  const [sources, setSources] = React.useState<string[]>([]);

  const [lightboxController, setLightboxController] = React.useState({
    toggler: false,
    slide: 0,
  });

  React.useEffect(() => {
    setSources([...images.map(x => x.downloadUrl)]);
  }, [images]);

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

  const onImageClicked = (index: number) => {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: index,
    });
  };

  if (isOnEdit) {
    return (
      <SimpleGrid cols={3} className="-mt-1.5 w-full" spacing={'xs'}>
        {images.map((image, index) => (
          <div className="relative" key={image.id}>
            <ActionIcon
              variant="light"
              radius="xl"
              size="lg"
              className="absolute right-3 top-3 z-10"
              onClick={() => onImageRemove && onImageRemove(image)}
            >
              <X />
            </ActionIcon>
            <Image
              key={index}
              height={150}
              fit="cover"
              radius="md"
              src={image.downloadUrl}
              alt="Post Image"
              className="w-full cursor-pointer"
              onClick={() => onImageClicked(findIndex(image.downloadUrl))}
            />
          </div>
        ))}
      </SimpleGrid>
    );
  }

  const findIndex = (url: string) => {
    return sources.findIndex(x => x === url);
  };

  return (
    <>
      <FsLightbox
        toggler={lightboxController.toggler}
        sources={[...sources]}
        sourceIndex={lightboxController.slide}
      />
      {images && (
        <SimpleGrid cols={upperImageCols} className="w-full" spacing={'xs'}>
          {images.slice(0, upperImageCols).map((image, index) => {
            return (
              <Image
                key={image.id}
                height={300}
                fit="cover"
                radius="md"
                src={image.downloadUrl}
                alt="Post Image"
                className="w-full cursor-pointer"
                onClick={() => onImageClicked(findIndex(image.downloadUrl))}
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
                  key={image.id}
                  onClick={() => onImageClicked(findIndex(image.downloadUrl))}
                  className="relative cursor-pointer rounded-md bg-black"
                >
                  <Text className="absolute left-0 right-0 top-0 bottom-0 z-10 ml-auto mt-auto mb-auto mr-auto h-10 w-full text-center text-4xl text-white">
                    +{images.length - 4}
                  </Text>
                  <Image
                    height={150}
                    fit="cover"
                    radius="md"
                    src={image.downloadUrl}
                    alt="Post Image"
                    className="opacity-60"
                  />
                </Box>
              );
            } else {
              return (
                <Image
                  key={image.id}
                  height={150}
                  fit="cover"
                  radius="md"
                  src={image.downloadUrl}
                  alt="Post Image"
                  className="w-full cursor-pointer"
                  onClick={() => onImageClicked(findIndex(image.downloadUrl))}
                />
              );
            }
          })}
        </SimpleGrid>
      )}
    </>
  );
}
