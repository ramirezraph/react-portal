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

export interface LessonFile {
  id: string;
  name: string;
  size: number;
  type: string;
  downloadUrl: string;
  lessonId: string;
  createdAt: string;
  updatedAt: string;
  fullPath: string;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  content: string;
  isLive: boolean;
  files: LessonFile[];
}
