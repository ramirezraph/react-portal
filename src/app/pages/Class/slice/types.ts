/* --- STATE --- */
export interface ClassroomState {
  units: Unit[];
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
