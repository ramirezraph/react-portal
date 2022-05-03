import { ActionIcon, Group, Modal, Text } from '@mantine/core';
import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight, ArrowNarrowRight, Minus, X } from 'tabler-icons-react';
import { ClassworkDetails } from '../QuizAssignmentModal/components/ClassworkDetails/Loadable';
import { StudentsList } from '../QuizAssignmentModal/components/StudentsList/Loadable';

interface Props {}

export function QuizAssignmentModal(props: Props) {
  // const {  } = props;

  let navigate = useNavigate();

  let [searchParams] = useSearchParams();

  const onClose = () => {
    navigate(-1);
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
          <ClassworkDetails title="Laboratory Activity 1" instructions="" />
          {searchParams && searchParams.get('view') === 'list' && (
            <StudentsList />
          )}
        </Group>
      </Group>
    </Modal>
  );
}
