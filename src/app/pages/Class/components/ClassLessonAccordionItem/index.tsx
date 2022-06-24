import { Collapse, Divider, Group, Stack, Text } from '@mantine/core';
import { AttachedFile } from 'app/components/LessonModal/components/AttachedFile/Loadable';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { lessonFilesColRef } from 'services/firebase';
import { ChevronDown, ChevronUp } from 'tabler-icons-react';
import { selectClassroom } from '../../slice/selectors';
import { ClassRole, Lesson, LessonFile, LessonLink } from '../../slice/types';
import { ClassAccordionControl } from '../ClassAccordionControl/Loadable';
import { ClassAccordionHeader } from '../ClassAccordionHeader';
import parse from 'html-react-parser';

export enum ClassAccordionType {
  Unit,
  Lesson,
}

interface Props {
  unitId: string;
  unitNumber: string;
  lesson: Lesson;
}

export function ClassLessonAccordionItem(props: Props) {
  const { lesson, unitId, unitNumber } = props;

  const [isOpened, setIsOpened] = React.useState(false);
  const [files, setFiles] = React.useState<(LessonFile | LessonLink)[]>([]);

  const { activeClassRole } = useSelector(selectClassroom);

  React.useEffect(() => {
    if (!isOpened) {
      return;
    }

    // fetch files
    console.log('onSnapshot: Lesson Files');
    const q = query(
      lessonFilesColRef,
      where('lessonId', '==', lesson.id),
      orderBy('createdAt'),
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const list: (LessonFile | LessonLink)[] = [];
      const sourceList: string[] = [];
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
          sourceList.push(file.downloadUrl);
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
      console.log('onSnapshot: Lesson Files - unsubscribe');
      unsubscribe();
    };
  }, [isOpened, lesson.id]);

  return (
    <Stack className="outline outline-1 outline-stone-200" spacing={0}>
      <Group
        onClick={() => setIsOpened(x => !x)}
        className="cursor-pointer bg-slate-800 p-4"
        noWrap
      >
        <ClassAccordionHeader
          live={lesson.isLive}
          title={lesson.title}
          number={lesson.number}
          type={ClassAccordionType.Lesson}
        />
        {isOpened ? (
          <ChevronUp size={20} color="white" />
        ) : (
          <ChevronDown size={20} color="white" />
        )}
      </Group>
      <Collapse in={isOpened} transitionDuration={500}>
        <Stack className="p-4">
          {lesson.content !== '<p><br></p>' && lesson.content !== '<p></p>' && (
            <div
              style={{
                maxHeight: 150,
                overflowY: 'clip',
              }}
            >
              {parse(lesson.content)}
            </div>
          )}
          {files.length > 0 && (
            <Stack className="w-full" spacing="xs">
              {files.map((file, index) => {
                if (file.kind === 'link') {
                  return (
                    <Group key={file.id}>
                      <Text>This is a link</Text>
                    </Group>
                  );
                }

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
                    viewOnly={activeClassRole !== ClassRole.Teacher}
                    compact
                  />
                );
              })}
            </Stack>
          )}
          <Divider className="mt-3" />
          <ClassAccordionControl
            unitId={unitId}
            lessonId={lesson.id}
            live={lesson.isLive}
            type={ClassAccordionType.Lesson}
            unitNumber={unitNumber}
            numberOfComments={lesson.numberOfComments}
          />
        </Stack>
      </Collapse>
    </Stack>
  );
}
