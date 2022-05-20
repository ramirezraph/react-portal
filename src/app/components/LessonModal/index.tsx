import {
  ActionIcon,
  Button,
  Card,
  Collapse,
  Divider,
  Group,
  Menu,
  Modal,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import {
  addDoc,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import * as React from 'react';
import {
  Location,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  db,
  lessonFilesColRef,
  lessonsColRef,
  storage,
} from 'services/firebase';
import {
  ArrowForward,
  ArrowNarrowRight,
  BrandGoogleDrive,
  Check,
  ChevronRight,
  Download,
  Link,
  Minus,
  Pencil,
  Plus,
  Settings,
  Trash,
  Upload,
  X,
} from 'tabler-icons-react';
import { LiveSwitch } from '../LiveSwitch/Loadable';
import { PostCard } from '../PostCard';
import { getLessonNumber, testForDuplicateLessonNumber } from './utils';
import { v4 as uuidv4 } from 'uuid';
import { useModals } from '@mantine/modals';
import { useSelector } from 'react-redux';
import { selectClassroom } from 'app/pages/Class/slice/selectors';
import { FileDropzone } from './components/FileDropzone/Loadable';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { ClassRole, LessonFile } from 'app/pages/Class/slice/types';
import { AttachedFile } from './components/AttachedFile/Loadable';
import RichTextEditor, { Editor } from '@mantine/rte';

interface Prop {}

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
  const [uploadFileMode, setUploadFileMode] = React.useState(false);
  const [lessonNumber, setLessonNumber] = React.useState('Lesson 1');
  const [title, setTitle] = React.useState('Why we program?');
  const [content, setContent] = React.useState('');
  const [files, setFiles] = React.useState<LessonFile[]>([]);
  const [classId, setClassId] = React.useState('');
  const [unitId, setUnitId] = React.useState('');
  const [isLive, setIsLive] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setPostsNeedsUpdate] = React.useState(true);

  // header
  const [unitNumber, setUnitNumber] = React.useState('');
  const [classCode, setClassCode] = React.useState('');

  const classroom = useSelector(selectClassroom);

  const richTextEditorRef = React.useRef<Editor>(null);

  interface LocationState {
    backgroundLocation: Location;
    unitId: string;
    classId: string;
    unitNumber: string;
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

  React.useEffect(() => {
    const locState = location.state as LocationState;
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
      isLive: isLive,
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

  const onFileUpload = (files: File[]) => {
    for (const file of files) {
      const storageRef = ref(storage, `lessons/${id}/${file.name}`);

      const notificationId = uuidv4();
      showNotification({
        id: notificationId,
        loading: true,
        title: 'In progress',
        message: `Uploading ${file.name} ...`,
        autoClose: false,
        disallowClose: true,
      });

      uploadBytes(storageRef, file).then(snapshot => {
        const data = snapshot.ref;
        getDownloadURL(ref(storage, data.fullPath))
          .then(url => {
            // store data to firestore
            addDoc(lessonFilesColRef, {
              name: file.name,
              type: file.type,
              size: file.size,
              lessonId: id,
              fullPath: data.fullPath,
              downloadUrl: url,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
              deletedAt: null,
            })
              .then(() => {
                updateNotification({
                  id: notificationId,
                  title: 'Success',
                  message: `File ${file.name} uploaded successfully.`,
                  color: 'green',
                  icon: <Check />,
                });
              })
              .catch(e => {
                updateNotification({
                  id: notificationId,
                  title: 'Failed',
                  message: `File ${file.name} upload failed.`,
                  color: 'red',
                  icon: <X />,
                });
              });
          })
          .catch(e => {
            updateNotification({
              id: notificationId,
              title: 'Failed',
              message: `File ${file.name} upload failed.`,
              color: 'red',
              icon: <X />,
            });
          });
      });
    }
  };

  React.useEffect(() => {
    if (!id) return;

    // fetch files
    console.log('onSnapshot: LessonModal Lesson Files');
    const q = query(
      lessonFilesColRef,
      where('lessonId', '==', id),
      orderBy('createdAt'),
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const list: LessonFile[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const file = {
          id: doc.id,
          name: data.name,
          size: data.size,
          type: data.type,
          downloadUrl: data.downloadUrl,
          lessonId: data.lessonId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          fullPath: data.fullPath,
        };
        list.push(file);
      });

      setFiles(list);
    });

    return () => {
      console.log('onSnapshot: LessonModal Lesson Files - unsubscribe');
      unsubscribe();
    };
  }, [id]);

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
                {classCode}
              </Text>
              <ChevronRight size={16} />
              <Text size="sm">{unitNumber}</Text>
              <ChevronRight size={16} />
              <Text size="sm">
                Lesson 1 <span className="opacity-50">of 4</span>
              </Text>
              <ActionIcon>
                <ArrowNarrowRight />
              </ActionIcon>
            </Group>
            {classroom.activeClassRole === ClassRole.Teacher && (
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
        <Group className="w-full rounded-md" direction="row" spacing={0} grow>
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

                    <LiveSwitch live={isLive} onToggle={onLiveToggle} />
                  </Group>
                  {!lessonIsNew && (
                    <ActionIcon
                      size="lg"
                      variant="filled"
                      color="red"
                      onClick={displayDeleteLessonModal}
                    >
                      <Trash size={18} />
                    </ActionIcon>
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

                  <Group position="apart" className="mt-6">
                    <Group>
                      <Text size="lg" className="font-semibold">
                        Attachments
                      </Text>
                      {classroom.activeClassRole === ClassRole.Teacher && (
                        <Menu
                          control={
                            <Button
                              disabled={lessonIsNew}
                              variant="outline"
                              leftIcon={<Plus />}
                            >
                              Add
                            </Button>
                          }
                          position="right"
                          placement="center"
                        >
                          <Menu.Item
                            icon={<Upload size={16} />}
                            onClick={() => setUploadFileMode(true)}
                          >
                            Upload file
                          </Menu.Item>
                          <Menu.Item icon={<Link size={16} />}>Link</Menu.Item>
                          <Menu.Item icon={<BrandGoogleDrive size={16} />}>
                            Google Drive
                          </Menu.Item>
                          <Menu.Item icon={<BrandGoogleDrive size={16} />}>
                            OneDrive
                          </Menu.Item>
                          <Menu.Item icon={<BrandGoogleDrive size={16} />}>
                            Dropbox
                          </Menu.Item>
                        </Menu>
                      )}
                    </Group>
                    <Button
                      disabled={lessonIsNew}
                      variant="outline"
                      color={'gray'}
                      leftIcon={<Download />}
                    >
                      Download All
                    </Button>
                  </Group>
                  <Collapse in={uploadFileMode}>
                    <Group className="w-full items-center" direction="column">
                      <FileDropzone
                        visible={true}
                        onFileUpload={onFileUpload}
                        className="mt-6 w-full"
                      />
                      <Button
                        className="w-1/3"
                        color="gray"
                        onClick={() => setUploadFileMode(false)}
                      >
                        Close
                      </Button>
                    </Group>
                  </Collapse>
                  <Group position="apart" className="mt-3">
                    <Text size="sm">Name</Text>
                    <Text
                      className={
                        classroom.activeClassRole !== ClassRole.Teacher
                          ? 'w-14'
                          : 'w-24'
                      }
                      size="sm"
                    >
                      Actions
                    </Text>
                  </Group>
                  <Stack className="mt-6" spacing="sm">
                    {files.map(file => {
                      return (
                        <AttachedFile
                          key={file.id}
                          id={file.id}
                          name={file.name}
                          size={file.size}
                          type={file.type}
                          downloadUrl={file.downloadUrl}
                          lessonId={file.lessonId}
                          fullPath={file.fullPath}
                          createdAt={file.createdAt}
                          updatedAt={file.updatedAt}
                          textClassName="w-[55ch] 2xl:w-[65ch]"
                          viewOnly={
                            classroom.activeClassRole !== ClassRole.Teacher
                          }
                        />
                      );
                    })}
                  </Stack>
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
                      {classroom.activeClassRole === ClassRole.Teacher && (
                        <ActionIcon size="lg">
                          <Settings />
                        </ActionIcon>
                      )}
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
                        ownerId="John Doe"
                        content="Hello, World!"
                        classId={''}
                        numberOfComments={0}
                        createdAt={''}
                        updatedAt={''}
                        files={[]}
                        images={[]}
                        likes={0}
                        requestForUpdate={setPostsNeedsUpdate}
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
