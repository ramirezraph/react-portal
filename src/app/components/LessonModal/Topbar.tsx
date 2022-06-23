import { Group, ActionIcon, Text, Button } from '@mantine/core';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowNarrowRight, ChevronRight, Minus, X } from 'tabler-icons-react';

interface Props {
  classCode: string;
  unitNumber: string;
  student: boolean;
  onClose: () => void;
}

export function Topbar(props: Props) {
  const { classCode, unitNumber, student, onClose } = props;

  const [lessonIsNew, setLessonIsNew] = React.useState(false);

  const { id } = useParams();

  React.useEffect(() => {
    if (!id) {
      setLessonIsNew(true);
      return;
    }
  }, [id]);

  return (
    <Group
      position="apart"
      className="w-full flex-grow-0 rounded-tr-md rounded-tl-md bg-document p-4"
    >
      <Group>
        <Group className="gap-2 rounded-md bg-white py-1 px-2">
          <Text size="sm" weight="bold">
            {classCode}
          </Text>
          <ChevronRight size={16} />
          <Text size="sm">{unitNumber}</Text>
          <ChevronRight size={16} />
          <Text size="sm">
            Lesson 1 <span className="opacity-50">of 4</span>
          </Text>
          {!lessonIsNew && (
            <ActionIcon>
              <ArrowNarrowRight />
            </ActionIcon>
          )}
        </Group>
        {!student && !lessonIsNew && (
          <Button size="md" compact>
            <Text className="text-sm font-normal">Add new lesson</Text>
          </Button>
        )}
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
  );
}
