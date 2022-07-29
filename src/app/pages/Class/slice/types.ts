import { Class } from 'app/pages/Classes/slice/types';
import { Location } from 'react-router-dom';

/* --- STATE --- */
export interface ClassroomState {
  activeClass: Class | null;
  units: Unit[];
  lessons: Lesson[];
  unitPath: string;
  classworkModalBackground: Location | undefined;
  lessonModalBackground: Location | undefined;
  activeClassRole: ClassRole | undefined;
  canPost: boolean;
  canComment: boolean;
}

export enum ClassRole {
  Student = 'Student',
  Teacher = 'Teacher',
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  content: string;
  isLive: boolean;
  lessons: Lesson[];
}

export interface ClassFile {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  lessonId: string;
}

export interface LessonFile extends ClassFile {
  kind: 'file';
  size: number;
  downloadUrl: string;
  fullPath: string;
}

export interface LessonLink extends ClassFile {
  kind: 'link';
  url: string;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  content: string;
  numberOfComments: number;
  isLive: boolean;
  files: LessonFile[];
}
