import { Group, ActionIcon, Text, Button } from '@mantine/core';
import { selectClassroom } from 'app/pages/Class/slice/selectors';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowNarrowRight, ChevronRight, Minus, X } from 'tabler-icons-react';
import { LessonModalLocationState } from '.';

interface Props {
  classCode: string;
  unitNumber: string;
  student: boolean;
  onClose: () => void;
}

export function Topbar(props: Props) {
  const { classCode, unitNumber, student, onClose } = props;
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [lessonIsNew, setLessonIsNew] = React.useState(false);

  const { lessonModalBackground } = useSelector(selectClassroom);

  React.useEffect(() => {
    if (!id) {
      setLessonIsNew(true);
      return;
    }
  }, [id]);

  const onAddNewLessonClicked = () => {
    const locState = location.state as LessonModalLocationState;
    if (!locState) return;

    navigate(
      {
        pathname: `/lesson/new`,
      },
      {
        state: {
          backgroundLocation: lessonModalBackground,
          unitId: locState.unitId,
          classId: locState.classId,
          unitNumber: unitNumber,
        },
        replace: true,
      },
    );
  };

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
          <Button size="md" compact onClick={onAddNewLessonClicked}>
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
