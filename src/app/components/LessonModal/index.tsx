import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  Popover,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import {
  addDoc,
  deleteDoc,
  doc,
  DocumentData,
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
  Check,
  CircleX,
  Pencil,
  Trash,
  X,
} from 'tabler-icons-react';
import { LiveSwitch } from '../LiveSwitch/Loadable';
import { getLessonNumber, testForDuplicateLessonNumber } from './utils';
import { v4 as uuidv4 } from 'uuid';
import { useModals } from '@mantine/modals';
import { useSelector } from 'react-redux';
import { selectClassroom } from 'app/pages/Class/slice/selectors';
import { ClassRole } from 'app/pages/Class/slice/types';
import RichTextEditor, { Editor } from '@mantine/rte';
import { Topbar } from './Topbar';
import { CommentSection } from './CommentSection';
import { Attachments } from './Attachments';
import { useMediaQuery } from '@mantine/hooks';

interface Prop {}

export interface LessonModalLocationState {
  backgroundLocation: Location;
  unitId: string;
  classId: string;
  unitNumber: string;
}

export function LessonModal(props: Prop) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const modals = useModals();

  const onClose = () => {
    navigate(-1);
  };

  const [originalDataCopy, setOriginalDataCopy] =
    React.useState<DocumentData | null>(null);

  const [lessonIsNew, setLessonIsNew] = React.useState(false);
  const [isOnEditMode, setIsOnEditMode] = React.useState(false);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [lessonNumber, setLessonNumber] = React.useState('Lesson 1');
  const [title, setTitle] = React.useState('Why we program?');
  const [content, setContent] = React.useState('');
  const [classId, setClassId] = React.useState('');
  const [unitId, setUnitId] = React.useState('');
  const [isLive, setIsLive] = React.useState(false);
  const [popoverNumberVisible, setPopoverNumberVisible] = React.useState(false);
  const [popoverNumberText, setPopoverNumberText] = React.useState(
    'Lesson number is required.',
  );
  const [popoverTitleVisible, setPopoverTitleVisible] = React.useState(false);

  // header
  const [unitNumber, setUnitNumber] = React.useState('');
  const [classCode, setClassCode] = React.useState('');

  const classroom = useSelector(selectClassroom);

  const richTextEditorRef = React.useRef<Editor>(null);

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

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

  React.useEffect(() => {
    const locState = location.state as LessonModalLocationState;
    setUnitId(locState.unitId);
    setClassId(locState.classId);
    setUnitNumber(locState.unitNumber);

    if (classroom.activeClass) {
      setClassCode(classroom.activeClass.code);
    }
  }, [classroom.activeClass, location.state]);

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
        richTextEditorRef.current?.setEditorContents(
          richTextEditorRef.current?.getEditor(),
          lessonData.content,
        );
        setIsLive(lessonData.isLive);
        setOriginalDataCopy(lessonData);
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

  const validateLessonInfo = async () => {
    const number = getLessonNumber(lessonNumber);
    if (!number) {
      setPopoverNumberText('Lesson number is required.');
      setPopoverNumberVisible(o => !o);
      return false;
    }
    // check for duplicate lesson number
    const duplicateTest = await testForDuplicateLessonNumber(
      unitId,
      number,
      id,
    );
    if (!duplicateTest) {
      setPopoverNumberText('Lesson number already in used.');
      setPopoverNumberVisible(o => !o);
      return false;
    }
    if (!title || title.length === 0) {
      setPopoverTitleVisible(o => !o);
      return false;
    }
    return true;
  };

  const onSubmitNewLesson = async () => {
    setSubmitLoading(true);
    const validateResult = await validateLessonInfo();

    if (!validateResult) {
      setSubmitLoading(false);
      return;
    }

    const number = getLessonNumber(lessonNumber);
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
      isLive: isLive,
      numberOfComments: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      deletedAt: null,
    };

    await addDoc(lessonsColRef, newLesson)
      .then(doc => {
        updateNotification({
          id: notificationId,
          title: 'Success',
          message: `Lesson ${number}: ${title} created successfully.`,
          color: 'green',
          icon: <Check />,
        });

        navigate(
          {
            pathname: `/lesson/${doc.id}`,
          },
          {
            state: {
              backgroundLocation: classroom.lessonModalBackground,
              unitId: unitId,
              classId: classId,
              unitNumber: unitNumber,
            },
            replace: true,
          },
        );
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

    const validateResult = await validateLessonInfo();
    if (!validateResult) {
      return;
    }

    const number = getLessonNumber(lessonNumber);
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
          message: `Lesson ${number}: ${title} updated successfully.`,
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

  const displayDeleteLessonModal = () => {
    if (!id) return;
    return modals.openConfirmModal({
      title: <Text weight="bold">Are you absolutely sure?</Text>,
      centered: true,
      zIndex: 999,
      trapFocus: true,
      closeOnClickOutside: false,
      children: (
        <Text size="sm">
          This action cannot be undone. This will permanently delete{' '}
          <span className="font-bold">
            {lessonNumber}: {title}
          </span>
          , along with other data associated with it.
        </Text>
      ),
      labels: { confirm: 'Delete lesson', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: () => onDelete(id),
    });
  };

  const onDelete = (lessonId: string) => {
    if (!lessonId) return;

    const notificationId = uuidv4();
    navigate(-1);
    showNotification({
      id: notificationId,
      loading: true,
      title: 'In progress',
      message: `Deleting ${lessonNumber}: ${title} ...`,
      autoClose: false,
      disallowClose: true,
    });

    deleteDoc(doc(db, 'lessons', lessonId))
      .then(() => {
        updateNotification({
          id: notificationId,
          title: 'Success',
          message: `${lessonNumber}: ${title} deleted successfully.`,
          color: 'green',
          icon: <Check />,
        });
      })
      .catch(e => {
        updateNotification({
          id: notificationId,
          title: 'Failed',
          message: `${lessonNumber}: ${title} delete failed. ${e}`,
          color: 'red',
          icon: <X />,
        });
      });
  };

  const onCancelCreate = () => {
    navigate(-1);
  };

  const onCancelUpdate = () => {
    if (originalDataCopy) {
      setLessonNumber(`Lesson ${originalDataCopy.number}`);
      setTitle(originalDataCopy.title);
      richTextEditorRef.current?.setEditorContents(
        richTextEditorRef.current?.getEditor(),
        originalDataCopy.content,
      );
      setIsOnEditMode(false);
    }
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
      <Stack className="h-full w-full" spacing={0}>
        <Topbar
          classCode={classCode}
          unitId={unitId}
          unitNumber={unitNumber}
          lessonNumber={lessonNumber}
          student={classroom.activeClassRole === ClassRole.Student}
          onClose={onClose}
        />
        <Group
          className="w-full rounded-md"
          direction={isMobile ? 'column' : 'row'}
          spacing={0}
          grow
        >
          <Card withBorder radius={0} className="h-full">
            {classroom.activeClassRole === ClassRole.Teacher && (
              <Card.Section className="p-4">
                <Group position="apart">
                  <Group>
                    {lessonIsNew ? (
                      <>
                        <Button
                          color="green"
                          leftIcon={<ArrowForward size={18} />}
                          onClick={onSubmitNewLesson}
                          loading={submitLoading}
                        >
                          <Text className="text-md font-normal">Submit</Text>
                        </Button>
                        <Button
                          color="gray"
                          onClick={onCancelCreate}
                          loading={submitLoading}
                        >
                          <Text className="text-md font-normal">Cancel</Text>
                        </Button>
                      </>
                    ) : isOnEditMode ? (
                      <>
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
                        <Button
                          color="gray"
                          onClick={onCancelUpdate}
                          loading={submitLoading}
                        >
                          <Text className="text-md font-normal">Cancel</Text>
                        </Button>
                      </>
                    ) : (
                      <Button
                        color="orange"
                        leftIcon={<Pencil size={18} />}
                        onClick={() => setIsOnEditMode(true)}
                      >
                        <Text className="text-md font-normal">Edit</Text>
                      </Button>
                    )}
                    {!isMobile && (
                      <LiveSwitch live={isLive} onToggle={onLiveToggle} />
                    )}
                  </Group>
                  {!lessonIsNew && (
                    <Group>
                      {isMobile && (
                        <LiveSwitch live={isLive} onToggle={onLiveToggle} />
                      )}
                      <ActionIcon
                        size="lg"
                        variant="filled"
                        color="red"
                        onClick={displayDeleteLessonModal}
                      >
                        <Trash size={18} />
                      </ActionIcon>
                    </Group>
                  )}
                </Group>
              </Card.Section>
            )}

            {classroom.activeClassRole === ClassRole.Teacher && (
              <Card.Section>
                <Divider />
              </Card.Section>
            )}

            <Card.Section>
              <ScrollArea
                style={{
                  height: '70vh',
                }}
                scrollbarSize={7}
                className="rounded-md"
              >
                <div className="p-4">
                  {isMobile && (
                    <Stack spacing={0}>
                      <Popover
                        opened={popoverNumberVisible}
                        onClose={() => setPopoverNumberVisible(false)}
                        target={
                          <TextInput
                            value={lessonNumber}
                            size="xl"
                            placeholder="Lesson number"
                            onChange={onLessonNumberChange}
                            readOnly={!isOnEditMode}
                            required
                          />
                        }
                        position="bottom"
                        withArrow
                      >
                        <Group>
                          <CircleX color="red" />
                          <Text color="red" size="sm">
                            {popoverNumberText}
                          </Text>
                        </Group>
                      </Popover>
                      <Popover
                        className="w-full"
                        opened={popoverTitleVisible}
                        onClose={() => setPopoverTitleVisible(false)}
                        target={
                          <TextInput
                            value={title}
                            size="xl"
                            placeholder="Lesson title"
                            onChange={onTitleChange}
                            readOnly={!isOnEditMode}
                            required
                          />
                        }
                        position="bottom"
                        withArrow
                      >
                        <Group>
                          <CircleX color="red" />
                          <Text color="red" size="sm">
                            Lesson title is required.
                          </Text>
                        </Group>
                      </Popover>
                    </Stack>
                  )}
                  {!isMobile && (
                    <Group spacing={4} noWrap>
                      <Popover
                        opened={popoverNumberVisible}
                        onClose={() => setPopoverNumberVisible(false)}
                        target={
                          <TextInput
                            value={lessonNumber}
                            size="xl"
                            placeholder="Lesson number"
                            onChange={onLessonNumberChange}
                            readOnly={!isOnEditMode}
                            required
                          />
                        }
                        position="bottom"
                        withArrow
                      >
                        <Group>
                          <CircleX color="red" />
                          <Text color="red" size="sm">
                            {popoverNumberText}
                          </Text>
                        </Group>
                      </Popover>

                      <Popover
                        className="w-full"
                        opened={popoverTitleVisible}
                        onClose={() => setPopoverTitleVisible(false)}
                        target={
                          <TextInput
                            value={title}
                            size="xl"
                            placeholder="Lesson title"
                            onChange={onTitleChange}
                            readOnly={!isOnEditMode}
                            required
                          />
                        }
                        position="bottom"
                        withArrow
                      >
                        <Group>
                          <CircleX color="red" />
                          <Text color="red" size="sm">
                            Lesson title is required.
                          </Text>
                        </Group>
                      </Popover>
                    </Group>
                  )}
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    ref={richTextEditorRef}
                    controls={[
                      ['bold', 'italic', 'underline', 'strike'],
                      ['h1', 'h2', 'h3', 'orderedList', 'unorderedList'],
                      ['sup', 'sub'],
                      ['alignLeft', 'alignCenter', 'alignRight'],
                      ['blockquote', 'codeBlock'],
                    ]}
                    className="text-lg"
                    sticky
                    readOnly={!isOnEditMode}
                    placeholder="Write something for this lesson."
                    style={{
                      minHeight: '250px',
                      maxHeight: '300px',
                      overflowY: 'auto',
                    }}
                  />

                  {id && (
                    <Attachments lessonId={id} lessonIsNew={lessonIsNew} />
                  )}
                </div>
              </ScrollArea>
            </Card.Section>
          </Card>
          {!lessonIsNew && id && <CommentSection lessonId={id} />}
        </Group>
      </Stack>
    </Modal>
  );
}
