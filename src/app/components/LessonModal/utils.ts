import { getDocs, query, where } from 'firebase/firestore';
import { lessonsColRef } from 'services/firebase';

const getLessonNumber = (unitTitle: string) => {
  return unitTitle.substring(7);
};

const testForDuplicateLessonNumber = async (
  unitId: string,
  lessonNumber: string,
  exceptLessonId?: string,
) => {
  let searchQuery = query(lessonsColRef, where('number', '==', lessonNumber));
  const searchQueryResult = await getDocs(searchQuery);
  let testResult = true;
  searchQueryResult.forEach(doc => {
    if (doc.data().unitId === unitId) {
      testResult = false;

      if (exceptLessonId) {
        if (doc.id === exceptLessonId) {
          testResult = true;
        }
      }
    }
  });

  return Promise.resolve(testResult);
};

export { getLessonNumber, testForDuplicateLessonNumber };
