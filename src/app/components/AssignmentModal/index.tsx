import {
  ActionIcon,
  Button,
  Group,
  Modal,
  ScrollArea,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import * as React from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import {
  ChevronRight,
  ArrowNarrowRight,
  Minus,
  X,
  Pencil,
  At,
  UserCircle,
  Calendar,
  Plus,
  Download,
} from 'tabler-icons-react';
import { AttachedFile } from '../LessonModal/components/AttachedFile/Loadable';
import { LiveSwitch } from '../LiveSwitch';
import { StudentsList } from './components/StudentsList/Loadable';
import { StudentWork } from './components/StudentWork/Loadable';

interface Props {}

export function AssignmentModal(props: Props) {
  // const {  } = props;

  let navigate = useNavigate();

  let [searchParams] = useSearchParams();

  const onClose = () => {
    navigate(-1);
  };

  const toggleSwitch = () => {};

  const [title, setTitle] = React.useState('Assignment: Laboratory Activity 1');
  const [instruction, setInstruction] = React.useState('');

  const onTitleChange = event => {
    if (event.currentTarget.value.substring(0, 12) !== 'Assignment: ') return;
    setTitle(event.currentTarget.value);
  };
  const onInstructionChange = event => {
    setInstruction(event.currentTarget.value);
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      withCloseButton={false}
      centered
      size={1100}
      padding={0}
      radius="md"
    >
      <Group direction="column" className="w-full bg-white" spacing={0} grow>
        <Group
          position="apart"
          className="w-full flex-grow-0 rounded-tr-md rounded-tl-md bg-document p-4"
        >
          <Group className="gap-2 rounded-md bg-white py-1 px-2">
            <Text size="sm" weight="bold">
              CPE 401
            </Text>
            <ChevronRight size={16} />
            <Text size="sm">Classwork</Text>
            <ChevronRight size={16} />
            <Text size="sm">Laboratory Activity 2</Text>
            <ActionIcon>
              <ArrowNarrowRight />
            </ActionIcon>
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
        <Group
          position="apart"
          direction="row"
          className="items-start pr-3"
          spacing="sm"
          noWrap
        >
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
                  value={title}
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
                  value={instruction}
                  onChange={onInstructionChange}
                  placeholder={'Write an instruction here.'}
                  className="mt-1 w-full"
                  minRows={8}
                  classNames={{
                    input: 'border-gray-200',
                  }}
                />
              </Group>
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
          {searchParams && searchParams.get('view') === 'list' && (
            <StudentsList />
          )}
          {searchParams &&
            searchParams.get('view') !== 'list' &&
            searchParams.get('view') !== null && <StudentWork />}
        </Group>
      </Group>
    </Modal>
  );
}
