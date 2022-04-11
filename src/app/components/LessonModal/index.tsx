import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  ScrollArea,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowNarrowRight,
  ChevronRight,
  Download,
  Minus,
  Pencil,
  Plus,
  Trash,
  X,
} from 'tabler-icons-react';
import { LiveSwitch } from '../LiveSwitch/Loadable';
import { AttachedFile } from './components/AttachedFile/Loadable';

interface Prop {}

export function LessonModal(props: Prop) {
  let navigate = useNavigate();

  const onClose = () => {
    navigate(-1);
  };

  const onLiveToggle = () => {
    console.log('toggle live');
  };

  const [title, setTitle] = React.useState('Lesson 1: Why we program?');
  const [content, setContent] = React.useState('');

  const onTitleChange = event => {
    if (event.currentTarget.value.substring(0, 10) !== 'Lesson 1: ') return;
    setTitle(event.currentTarget.value);
  };
  const onContentChange = event => {
    setContent(event.currentTarget.value);
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      withCloseButton={false}
      centered
      size="full"
      padding={0}
      radius="md"
    >
      <Group direction="column" className="h-full w-full" spacing={0} grow>
        <Group
          position="apart"
          className="w-full flex-grow-0 rounded-tr-md rounded-tl-md bg-document p-4"
        >
          <Group>
            <Group className="gap-2 rounded-md bg-white py-1 px-2">
              <Text size="sm" weight="bold">
                CPE 401
              </Text>
              <ChevronRight size={16} />
              <Text size="sm">Unit 1</Text>
              <ChevronRight size={16} />
              <Text size="sm">
                Lesson 1 <span className="opacity-50">of 4</span>
              </Text>
              <ActionIcon>
                <ArrowNarrowRight />
              </ActionIcon>
            </Group>
            <Button size="md" compact>
              <Text className="text-sm font-normal">Add new lesson</Text>
            </Button>
          </Group>
          <Group className="gap-1">
            <ActionIcon
              size={'md'}
              variant="filled"
              className="bg-white text-black hover:bg-white"
              onClick={onClose}
            >
              <Minus size={18} />
            </ActionIcon>
            <ActionIcon
              size={'md'}
              variant="filled"
              className="bg-white text-black hover:bg-white"
              onClick={onClose}
            >
              <X size={18} />
            </ActionIcon>
          </Group>
        </Group>
        <Group className="w-full rounded-md" direction="row" grow>
          <Card withBorder radius={0} className="h-full">
            <Card.Section className="p-4">
              <Group position="apart">
                <Group>
                  <Button leftIcon={<Pencil size={18} />}>
                    <Text className="text-md font-normal">Edit</Text>
                  </Button>
                  <LiveSwitch live={true} onToggle={onLiveToggle} />
                </Group>
                <ActionIcon size="lg" variant="filled" color="red">
                  <Trash size={18} />
                </ActionIcon>
              </Group>
            </Card.Section>
            <Card.Section>
              <Divider />
            </Card.Section>
            <Card.Section>
              <ScrollArea
                style={{
                  height: '70vh',
                }}
                scrollbarSize={7}
                className="rounded-md"
              >
                <div className="p-4">
                  <TextInput
                    value={title}
                    onChange={onTitleChange}
                    className="w-full"
                    size="xl"
                    placeholder="Lesson #: Title"
                  />
                  <Textarea
                    value={content}
                    onChange={onContentChange}
                    placeholder={'Write something for this lesson here.'}
                    className="mt-1 w-full"
                    minRows={12}
                  />
                  <Group position="apart" className="mt-6">
                    <Group>
                      <Text size="lg" className="font-semibold">
                        Attachments
                      </Text>
                      <Button variant="outline" leftIcon={<Plus />}>
                        Add
                      </Button>
                    </Group>
                    <Button
                      variant="outline"
                      color={'gray'}
                      leftIcon={<Download />}
                    >
                      Download All
                    </Button>
                  </Group>
                  <Group position="apart" className="mt-3">
                    <Text size="sm">Name</Text>
                    <Text className="w-24" size="sm">
                      Actions
                    </Text>
                  </Group>
                  <AttachedFile name="Introduction.pdf" />
                  <AttachedFile name="Test File.pdf" />
                </div>
              </ScrollArea>
            </Card.Section>
          </Card>
          <Card className="bg-red-500">
            <ScrollArea
              style={{
                height: '70vh',
              }}
            >
              <Text>Test</Text>
            </ScrollArea>
          </Card>
        </Group>
      </Group>
    </Modal>
  );
}
