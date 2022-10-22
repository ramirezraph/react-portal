import {
  Group,
  ActionIcon,
  Text,
  Button,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { selectClassroom } from 'app/pages/Class/slice/selectors';
import { getDocs, query, where } from 'firebase/firestore';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { lessonsColRef } from 'services/firebase';
import { ChevronRight, Minus, X } from 'tabler-icons-react';
import { LessonModalLocationState } from '.';

interface Props {
  classCode: string;
  unitId: string;
  unitNumber: string;
  student: boolean;
  onClose: () => void;
  lessonNumber?: string;
}

export function Topbar(props: Props) {
  const { classCode, unitNumber, student, lessonNumber, unitId, onClose } =
    props;
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [lessonIsNew, setLessonIsNew] = React.useState(false);
  const [numberOfLessons, setNumberOfLessons] = React.useState(0);

  const { lessonModalBackground } = useSelector(selectClassroom);

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  React.useEffect(() => {
    if (!id) {
      setLessonIsNew(true);
      return;
    }

    setLessonIsNew(false);
  }, [id]);

  React.useEffect(() => {
    const getNumberOfLessons = async () => {
      const q = query(lessonsColRef, where('unitId', '==', unitId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return;
      }

      setNumberOfLessons(querySnapshot.size);
    };

    getNumberOfLessons();
  }, [unitId, id]);

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
      noWrap
    >
      <Group noWrap>
        <Group className="gap-2 rounded-md bg-white py-1 px-2" noWrap>
          <Text size="sm" weight="bold">
            {classCode}
          </Text>
          <ChevronRight size={16} />
          <Text size="sm">{unitNumber}</Text>
          <ChevronRight size={16} />
          {lessonIsNew && !isMobile && <Text size="sm">New Lesson</Text>}

          {!lessonIsNew && (
            <Text size="sm">
              {lessonNumber}{' '}
              <span className="opacity-50">of {numberOfLessons}</span>
            </Text>
          )}
          {/* {!lessonIsNew && (
            <ActionIcon>
              <ArrowNarrowRight />
            </ActionIcon>
          )} */}
        </Group>
        {!student && !lessonIsNew && !isMobile && (
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
