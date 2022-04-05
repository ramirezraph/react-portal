import {
  Card,
  Group,
  Avatar,
  ActionIcon,
  Button,
  Text,
  Image,
  Grid,
  Box,
  SimpleGrid,
} from '@mantine/core';
import moment from 'moment';
import * as React from 'react';
import { Dots, ThumbUp, Message, Download, Files } from 'tabler-icons-react';

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
  id: string;
  ownerName: string;
  date: string;
  content: string;
  images?: PostImage[];
  files?: File[];
}

export function PostCard(props: Prop) {
  const { id, ownerName, date, content, images, files } = props;

  const [upperImageCols, setUpperImageCols] = React.useState(1);
  const [lowerImageCols, setLowerImageCols] = React.useState(1);

  const [ownerInitials, setOwnerInitials] = React.useState<string | null>(null);

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

  React.useEffect(() => {
    const names = ownerName.split(' ');
    const firstLetter = names[0].substring(0, 1);
    setOwnerInitials(firstLetter);
  }, [ownerName]);

  const onImageClicked = () => {
    console.log('image clicked');
  };

  const onMoreImageClicked = () => {
    console.log('more image clicked');
  };

  return (
    <Card className="mt-3 rounded-md">
      <Group direction="row" noWrap>
        <Avatar color={'primary'} radius="xl" className="self-start">
          {ownerInitials}
        </Avatar>
        <Group direction="column" className="flex-grow" noWrap>
          <Group direction="row" position="apart" className="w-full" noWrap>
            <div className="flex-grow">
              <Text className="font-semibold">{ownerName}</Text>
              <Text color={'gray'} size="xs">
                {moment(date).startOf('hour').fromNow()}
              </Text>
            </div>
            <ActionIcon className="self-start">
              <Dots />
            </ActionIcon>
          </Group>
          <Text>{content}</Text>

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
                        +{9}
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
          <Group className="mt-3 w-full" position="apart" noWrap>
            <Group>
              <Button variant="subtle" compact color={'dark'} className="px-0">
                <ThumbUp />
                <Text className="ml-2">11</Text>
              </Button>
              <Button variant="subtle" compact color={'dark'} className="px-0">
                <Message />
                <Text className="ml-2">5</Text>
              </Button>
            </Group>
            <Group>
              <ActionIcon>
                <Files />
              </ActionIcon>
              <ActionIcon>
                <Download />
              </ActionIcon>
            </Group>
          </Group>
        </Group>
      </Group>
    </Card>
  );
}
