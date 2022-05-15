import {
  Card,
  Group,
  Avatar,
  ActionIcon,
  Button,
  Text,
  Popover,
  Tooltip,
  Menu,
  Divider,
} from '@mantine/core';
import moment from 'moment';
import * as React from 'react';
import {
  ThumbUp,
  Message,
  Download,
  Files,
  Pin,
  Trash,
  Pencil,
} from 'tabler-icons-react';
import { ImagesGrid } from '../ImagesGrid/Loadable';
import { PostFiles } from './PostFiles';
import { IImage } from '../ImagesGrid';

export interface IFile {
  id: string;
  downloadUrl: string;
  name: string;
  type: string;
}

export interface Post {
  id: string;
  ownerName: string;
  date: string;
  content: string;
  images?: IImage[];
  files?: IFile[];
}

interface Prop {
  id: string;
  ownerName: string;
  date: string;
  content?: string;
  images: IImage[];
  files?: IFile[];
}

export function PostCard(props: Prop) {
  const { ownerName, date, content, images, files } = props;

  const [ownerInitials, setOwnerInitials] = React.useState<string | null>(null);

  const [opened, setOpened] = React.useState(false);

  React.useEffect(() => {
    const names = ownerName.split(' ');
    const firstLetter = names[0].substring(0, 1);
    setOwnerInitials(firstLetter);
  }, [ownerName]);

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
            <Menu position="right" className="self-start">
              <Menu.Item icon={<Pin size={16} />}>Pin on top</Menu.Item>
              <Menu.Item icon={<Pencil size={16} />}>Edit</Menu.Item>
              <Divider />
              <Menu.Item icon={<Trash size={16} color="red" />}>
                <Text size="sm" color="red">
                  Delete
                </Text>
              </Menu.Item>
            </Menu>
          </Group>
          {content && <Text size="sm">{content}</Text>}
          <ImagesGrid images={images} />
          <Group className="w-full" position="apart" noWrap>
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
            {files && files?.length > 0 && (
              <Group>
                <Tooltip label="Attached files" position="bottom" withArrow>
                  <Popover
                    opened={opened}
                    onClose={() => setOpened(false)}
                    target={
                      <Button
                        variant="subtle"
                        color={'dark'}
                        className="px-1"
                        onClick={() => setOpened(o => !o)}
                      >
                        <Files />
                        <Text className="ml-2">{files.length}</Text>
                      </Button>
                    }
                    width={300}
                    position="left"
                  >
                    <PostFiles files={files} />
                  </Popover>
                </Tooltip>

                <Tooltip
                  label="Download All"
                  position="bottom"
                  withArrow
                  className="m-0 p-0"
                >
                  <ActionIcon>
                    <Download />
                  </ActionIcon>
                </Tooltip>
              </Group>
            )}
          </Group>
        </Group>
      </Group>
    </Card>
  );
}
