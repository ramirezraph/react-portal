import { Group, Text, Button, Menu, Collapse, Stack } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { selectClassroom } from 'app/pages/Class/slice/selectors';
import { ClassRole, LessonFile, LessonLink } from 'app/pages/Class/slice/types';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { lessonFilesColRef, storage } from 'services/firebase';
import { Plus, Upload, Link, Check, X } from 'tabler-icons-react';
import { AttachedFile } from './components/AttachedFile/Loadable';
import { FileDropzone } from './components/FileDropzone/Loadable';
import { v4 as uuidv4 } from 'uuid';
import {
  addDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import { AddLinkModal } from '../AddLinkModal/Loadable';

interface Props {
  lessonId: string;
  lessonIsNew: boolean;
}

export function Attachments(props: Props) {
  const { lessonId, lessonIsNew } = props;

  const { activeClassRole } = useSelector(selectClassroom);

  const [uploadFileMode, setUploadFileMode] = React.useState(false);
  const [files, setFiles] = React.useState<(LessonFile | LessonLink)[]>([]);
  const [addLinkModalVisible, setAddLinkModalVisible] = React.useState(false);

  React.useEffect(() => {
    if (!lessonId) return;

    // fetch files
    console.log('onSnapshot: LessonModal Lesson Files');
    const q = query(
      lessonFilesColRef,
      where('lessonId', '==', lessonId),
      orderBy('createdAt'),
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const list: (LessonFile | LessonLink)[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();

        let file: LessonFile | LessonLink;
        if (data.downloadUrl) {
          file = {
            kind: 'file',
            id: doc.id,
            name: data.name,
            size: data.size,
            type: data.type,
            downloadUrl: data.downloadUrl,
            lessonId: data.lessonId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt,
            fullPath: data.fullPath,
          };
          list.push(file);
        } else {
          file = {
            kind: 'link',
            id: doc.id,
            name: data.name,
            url: data.url,
            type: data.type,
            lessonId: data.lessonId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt,
          };
          list.push(file);
        }
      });

      setFiles(list);
    });

    return () => {
      console.log('onSnapshot: LessonModal Lesson Files - unsubscribe');
      unsubscribe();
    };
  }, [lessonId]);

  const onFileUpload = (files: File[]) => {
    for (const file of files) {
      const storageRef = ref(storage, `lessons/${lessonId}/${file.name}`);

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
              lessonId: lessonId,
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

  return (
    <>
      <AddLinkModal
        lessonId={lessonId}
        visible={addLinkModalVisible}
        onToggle={setAddLinkModalVisible}
      />
      <Group position="apart" className="mt-6">
        <Group>
          <Text size="lg" className="font-semibold">
            Attachments
          </Text>
          {activeClassRole === ClassRole.Teacher && (
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
              <Menu.Item
                icon={<Link size={16} />}
                onClick={() => setAddLinkModalVisible(true)}
              >
                Link
              </Menu.Item>
              {/* <Menu.Item icon={<BrandGoogleDrive size={16} />}>
                Google Drive
              </Menu.Item>
              <Menu.Item icon={<BrandGoogleDrive size={16} />}>
                OneDrive
              </Menu.Item>
              <Menu.Item icon={<BrandGoogleDrive size={16} />}>
                Dropbox
              </Menu.Item> */}
            </Menu>
          )}
        </Group>
        {/* <Button
          disabled={lessonIsNew}
          variant="outline"
          color={'gray'}
          leftIcon={<Download />}
        >
          Download All
        </Button> */}
      </Group>
      <Collapse in={uploadFileMode}>
        <Group className="w-full items-center" direction="column">
          <FileDropzone
            visible={true}
            onFileUpload={onFileUpload}
            className="mt-6 w-full"
            onClose={() => setUploadFileMode(false)}
          />
        </Group>
      </Collapse>
      <Group position="apart" className="mt-3">
        <Text size="sm">Name</Text>
        <Text
          className={activeClassRole !== ClassRole.Teacher ? 'w-14' : 'w-24'}
          size="sm"
        >
          Actions
        </Text>
      </Group>
      <Stack className="mt-6" spacing="sm">
        {files.map(file => {
          if (file.kind === 'link') {
            return (
              <AttachedFile
                kind="link"
                key={file.id}
                id={file.id}
                url={file.url}
                name={file.name}
                type={file.type}
                lessonId={file.lessonId}
                createdAt={file.createdAt}
                updatedAt={file.updatedAt}
                viewOnly={activeClassRole !== ClassRole.Teacher}
              />
            );
          }

          return (
            <AttachedFile
              kind="file"
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
              viewOnly={activeClassRole !== ClassRole.Teacher}
            />
          );
        })}
      </Stack>
    </>
  );
}
