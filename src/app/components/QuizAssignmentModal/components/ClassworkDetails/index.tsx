import {
  Group,
  Text,
  ActionIcon,
  Button,
  ScrollArea,
  Textarea,
  TextInput,
} from '@mantine/core';
import { AttachedFile } from 'app/components/LessonModal/components/AttachedFile';
import { LiveSwitch } from 'app/components/LiveSwitch';
import * as React from 'react';
import {
  Pencil,
  At,
  UserCircle,
  Calendar,
  Plus,
  Download,
} from 'tabler-icons-react';
import { Form } from '../Form/Loadable';

interface Props {
  title: string;
  instructions: string;
}

export function ClassworkDetails(props: Props) {
  const { title, instructions } = props;

  const toggleSwitch = () => {};

  const [titleText, setTitleText] = React.useState(`Assignment: ${title}`);
  const [instructionText, setInstructionText] = React.useState(instructions);

  const onTitleChange = event => {
    if (event.currentTarget.value.substring(0, 12) !== 'Assignment: ') return;
    setTitleText(event.currentTarget.value);
  };
  const onInstructionChange = event => {
    setInstructionText(event.currentTarget.value);
  };

  return (
    <Group spacing={0} className="w-3/5 bg-white">
      <Group position="apart" className="w-full p-4" noWrap>
        <Group>
          <Button leftIcon={<Pencil size={19} />}>
            <Text size="sm" weight={400}>
              Edit
            </Text>
          </Button>
          <LiveSwitch live={false} onToggle={toggleSwitch} />
        </Group>
        <Group spacing={10}>
          <ActionIcon>
            <At />
          </ActionIcon>
          <ActionIcon>
            <UserCircle />
          </ActionIcon>
          <Button
            variant="subtle"
            color={'red'}
            leftIcon={<Calendar />}
            compact
            className="px-0"
          >
            <Text weight={400}>13/04/2022</Text>
          </Button>
        </Group>
      </Group>
      <ScrollArea
        style={{
          height: '60vh',
        }}
        scrollbarSize={7}
        className="w-full rounded-md"
      >
        <Group direction="column" className="px-4" spacing={0}>
          <TextInput
            value={titleText}
            onChange={onTitleChange}
            className="w-full"
            size="xl"
            placeholder="Lesson #: Title"
            classNames={{
              input: 'border-gray-200',
            }}
          />
          <Text weight={'bold'} size="sm" className="mt-3">
            Instruction
          </Text>
          <Textarea
            value={instructionText}
            onChange={onInstructionChange}
            placeholder={'Write an instruction here.'}
            className="mt-1 w-full"
            minRows={5}
            classNames={{
              input: 'border-gray-200',
            }}
          />
        </Group>
        <Form title="Form Title 1" possibleScores={100} className="mx-4 mt-4" />
        <Group className="p-4" direction="column">
          <Group position="apart" className="w-full">
            <Group>
              <Text size="lg" weight="bold">
                Attachments
              </Text>
              <Button variant="outline" leftIcon={<Plus size={19} />}>
                <Text weight={400} size="sm">
                  Add
                </Text>
              </Button>
            </Group>
            <Button
              variant="outline"
              color="dark"
              leftIcon={<Download size={19} />}
            >
              <Text weight={400} size="sm">
                Download all
              </Text>
            </Button>
          </Group>
          <Group position="apart" className="w-full px-3">
            <Text size="sm">Name</Text>
            <Text size="sm" className="w-36" align="center">
              Actions
            </Text>
          </Group>
          <Group direction="column" className="w-full px-3">
            <AttachedFile name={'Introduction.pdf'} />
            <AttachedFile name={'Welcome to class.mp4'} />
          </Group>
        </Group>
      </ScrollArea>
    </Group>
  );
}
