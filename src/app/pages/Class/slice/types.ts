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
  title: string;
  downloadUrl: string;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  content: string;
  isLive: boolean;
  files: LessonFile[];
}
