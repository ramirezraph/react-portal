import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { AssignmentModal } from '../AssignmentModal/Loadable';
import { QuizAssignmentModal } from '../QuizAssignmentModal/Loadable';

interface Props {}

export function ClassworkModal(props: Props) {
  let [searchParams] = useSearchParams();

  let type = searchParams.get('type');

  if (type === 'assignment') {
    return <AssignmentModal />;
  } else if (type === 'quiz') {
    return <QuizAssignmentModal />;
  } else {
    return null;
  }
}
