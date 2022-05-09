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
import { showNotification, updateNotification } from '@mantine/notifications';
import {
  addDoc,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import * as React from 'react';
import {
  Location,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { db, lessonsColRef } from 'services/firebase';
import {
  ArrowForward,
  ArrowNarrowRight,
  Check,
  ChevronRight,
  Download,
  Minus,
  Pencil,
  Plus,
  Settings,
  Trash,
  X,
} from 'tabler-icons-react';
import { LiveSwitch } from '../LiveSwitch/Loadable';
import { PostCard } from '../PostCard';
import { AttachedFile } from './components/AttachedFile/Loadable';
import { getLessonNumber, testForDuplicateLessonNumber } from './utils';
import { v4 as uuidv4 } from 'uuid';

interface Prop {}

export function LessonModal(props: Prop) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const onClose = () => {
    navigate(-1);
  };

  const [lessonIsNew, setLessonIsNew] = React.useState(false);
  const [isOnEditMode, setIsOnEditMode] = React.useState(false);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [lessonNumber, setLessonNumber] = React.useState('Lesson 1');
  const [title, setTitle] = React.useState('Why we program?');
  const [content, setContent] = React.useState('');
  const [classId, setClassId] = React.useState('');
  const [unitId, setUnitId] = React.useState('');
  const [isLive, setIsLive] = React.useState(false);

  interface LocationState {
    backgroundLocation: Location;
    unitId: string;
    classId: string;
  }

  const onLessonNumberChange = event => {
    if (event.currentTarget.value.substring(0, 7) !== 'Lesson ') return;

    // digits only, allows periods.
    const regExp = /^[1-9][.\d]*(,\d+)?$/;
    const number = getLessonNumber(event.currentTarget.value);

    if (!number) {
      // whitespace
      setLessonNumber(event.currentTarget.value);
      return;
    }

    if (regExp.test(number)) {
      setLessonNumber(event.currentTarget.value);
    }
  };

  const onTitleChange = event => {
    setTitle(event.currentTarget.value);
  };

  const onContentChange = event => {
    setContent(event.currentTarget.value);
  };

  React.useEffect(() => {
    const locState = location.state as LocationState;
    console.log(locState);

    setUnitId(locState.unitId);
    setClassId(locState.classId);
  }, [location.state]);

  React.useEffect(() => {
    if (!id) {
      setLessonIsNew(true);
      setIsOnEditMode(true);
      setLessonNumber('Lesson 1');
      setTitle('New Lesson');
      setIsLive(false);
      return;
    }

    setLessonIsNew(false);
    setIsOnEditMode(false);

    // fetch lesson data
    console.log('onSnapshot: LessonModal');
    const unsubscribe = onSnapshot(doc(db, 'lessons', id), doc => {
      const lessonData = doc.data();
      if (lessonData) {
        setLessonNumber(`Lesson ${lessonData.number}`);
        setTitle(lessonData.title);
        setContent(lessonData.content);
        setIsLive(lessonData.isLive);
      }
    });

    return () => {
      console.log('onSnapshot: LessonModal - unsubscribe');
      unsubscribe();
    };
  }, [id]);

  const onLiveToggle = async () => {
    if (!id) return;

    const lessonDocRef = doc(db, 'lessons', id);
    await updateDoc(lessonDocRef, {
      isLive: !isLive,
      updatedAt: Timestamp.now(),
    });
  };

  const onSubmitNewLesson = async () => {
    setSubmitLoading(true);
    const number = getLessonNumber(lessonNumber);

    // simple validate
    if (!title && !number) {
      setSubmitLoading(false);
      showNotification({
        title: 'Failed',
        message: 'Lesson number and title are required.',
        color: 'red',
        icon: <X />,
      });
      return;
    }

    // check for duplicate lesson number
    const duplicateTest = await testForDuplicateLessonNumber(unitId, number);
    if (!duplicateTest) {
      setSubmitLoading(false);
      showNotification({
        title: 'Failed',
        message: 'Lesson number already in used.',
        color: 'red',
        icon: <X />,
      });
      return;
    }

    const notificationId = uuidv4();
    showNotification({
      id: notificationId,
      loading: true,
      title: 'In progress',
      message: `Creating Lesson ${number}: ${title} ...`,
      autoClose: false,
      disallowClose: true,
    });

    const newLesson = {
      classId: classId,
      unitId: unitId,
      number: number,
      title: title,
      content: content,
      isLive: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      deletedAt: null,
    };

    await addDoc(lessonsColRef, newLesson)
      .then(() => {
        updateNotification({
          id: notificationId,
          title: 'Success',
          message: `Lesson ${number}: ${title} created successfully.`,
          color: 'green',
          icon: <Check />,
        });
        setLessonIsNew(false);
        setIsOnEditMode(false);
      })
      .catch(e => {
        showNotification({
          title: 'Failed',
          message: `Lesson ${number}: ${title} create failed.`,
          color: 'red',
          icon: <X />,
        });
        return;
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  const onSubmitUpdateLesson = async () => {
    if (!id) return;

    setSubmitLoading(true);
    const number = getLessonNumber(lessonNumber);

    // simple validate
    if (!title && !number) {
      setSubmitLoading(false);
      showNotification({
        title: 'Failed',
        message: 'Lesson number and title are required.',
        color: 'red',
        icon: <X />,
      });
      return;
    }

    // check for duplicate lesson number
    const duplicateTest = await testForDuplicateLessonNumber(
      unitId,
      number,
      id,
    );
    if (!duplicateTest) {
      setSubmitLoading(false);
      showNotification({
        title: 'Failed',
        message: 'Lesson number already in used.',
        color: 'red',
        icon: <X />,
      });
      return;
    }

    const notificationId = uuidv4();
    showNotification({
      id: notificationId,
      loading: true,
      title: 'In progress',
      message: `Updating Lesson ${number}: ${title} ...`,
      autoClose: false,
      disallowClose: true,
    });

    const lessonDocRef = doc(db, 'lessons', id);
    await updateDoc(lessonDocRef, {
      number: number,
      title: title,
      content: content,
      updatedAt: Timestamp.now(),
    })
      .then(() => {
        updateNotification({
          id: notificationId,
          title: 'Success',
          message: `Lesson ${number}: ${title} created successfully.`,
          color: 'green',
          icon: <Check />,
        });
      })
      .catch(e => {
        showNotification({
          title: 'Failed',
          message: `Lesson ${number}: ${title} update failed. \n${e}`,
          color: 'red',
          icon: <X />,
        });
      })
      .finally(() => {
        setSubmitLoading(false);
        setIsOnEditMode(false);
      });
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      withCloseButton={false}
      centered
      size={lessonIsNew ? 800 : 1600}
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
        <Group className="w-full rounded-md" direction="row" spacing={0} grow>
          <Card withBorder radius={0} className="h-full">
            <Card.Section className="p-4">
              <Group position="apart">
                <Group>
                  {lessonIsNew ? (
                    <Button
                      color="green"
                      leftIcon={<ArrowForward size={18} />}
                      onClick={onSubmitNewLesson}
                      loading={submitLoading}
                    >
                      <Text className="text-md font-normal">Submit</Text>
                    </Button>
                  ) : isOnEditMode ? (
                    <Button
                      color="primary"
                      leftIcon={<ArrowForward size={18} />}
                      onClick={onSubmitUpdateLesson}
                      loading={submitLoading}
                    >
                      <Text className="text-md font-normal">
                        Submit changes
                      </Text>
                    </Button>
                  ) : (
                    <Button
                      color="orange"
                      leftIcon={<Pencil size={18} />}
                      onClick={() => setIsOnEditMode(true)}
                    >
                      <Text className="text-md font-normal">Edit</Text>
                    </Button>
                  )}

                  <LiveSwitch live={isLive} onToggle={onLiveToggle} />
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
                  <Group noWrap spacing={4}>
                    <TextInput
                      value={lessonNumber}
                      size="xl"
                      placeholder="Lesson number"
                      onChange={onLessonNumberChange}
                      readOnly={!isOnEditMode}
                      required
                    />
                    <TextInput
                      value={title}
                      className="w-full"
                      size="xl"
                      placeholder="Lesson title"
                      onChange={onTitleChange}
                      readOnly={!isOnEditMode}
                      required
                    />
                  </Group>
                  <Textarea
                    value={content}
                    onChange={onContentChange}
                    placeholder={'Write something for this lesson here.'}
                    className="mt-1 w-full"
                    minRows={12}
                    readOnly={!isOnEditMode}
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
                  <Group className="mt-6" spacing="sm">
                    <AttachedFile name="Introduction.pdf" />
                    <AttachedFile name="Test File.pdf" />
                    <AttachedFile name="Test File.pdf" />
                  </Group>
                </div>
              </ScrollArea>
            </Card.Section>
          </Card>
          {!lessonIsNew && (
            <Card className="m-0 p-0" radius={0}>
              <Card>
                <Card.Section className="p-4">
                  <Group position="apart">
                    <Text className="font-semibold">Comments</Text>
                    <Group>
                      <Button>Write a comment</Button>
                      <ActionIcon size="lg">
                        <Settings />
                      </ActionIcon>
                    </Group>
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
                    className="bg-document"
                  >
                    <div className="p-4">
                      <PostCard
                        id="asdfasdfa"
                        ownerName="John Doe"
                        date="2022-04-05T12:10"
                        content="Hello, World!"
                      />
                    </div>
                  </ScrollArea>
                </Card.Section>
              </Card>
            </Card>
          )}
        </Group>
      </Group>
    </Modal>
  );
}
