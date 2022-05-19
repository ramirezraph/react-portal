import { doc, getDoc } from 'firebase/firestore';
import { db } from 'services/firebase';

export const getClassNameAndCode = async (classId: string) => {
  if (!classId) return null;

  const classDocRef = doc(db, 'classes', classId);

  const classDoc = await getDoc(classDocRef);
  if (classDoc.exists()) {
    const data = classDoc.data();
    return {
      name: data.name,
      code: data.code,
    };
  }

  return null;
};
