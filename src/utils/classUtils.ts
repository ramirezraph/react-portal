import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
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

export const admitUserToClass = async (userId: string, classId: string) => {
  const classDocRef = doc(db, 'classes', classId);
  await updateDoc(classDocRef, {
    usersList: arrayUnion(userId),
  });

  await setDoc(doc(db, `${classDocRef.path}/people`, userId), {
    type: 'Student',
  });
};

export const removeFromClassPendingInvites = async (
  userId: string,
  classId: string,
) => {
  const classDocRef = doc(db, 'classes', classId);

  await updateDoc(classDocRef, {
    pendingInvites: arrayRemove(userId),
  });
};
