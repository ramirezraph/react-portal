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

export const getUserRole = async (
  userId: string,
  classId: string,
): Promise<string | null> => {
  const userDocRef = doc(db, `classes/${classId}/people`, userId);
  const userDocSnap = await getDoc(userDocRef);
  if (userDocSnap.exists()) {
    const data = userDocSnap.data();
    const role = data.type;
    return role;
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

const permissionsThatCanPost = ['Students can post and comment'];
export const canUserPost = (
  userRole?: String,
  classPermissions?: Map<String, String>,
) => {
  if (!classPermissions) return false;
  if (!classPermissions['postAndComment']) return false;
  if (!userRole) return false;

  const postAndCommentPermission = classPermissions['postAndComment'];
  if (userRole === 'Teacher') {
    return true;
  }
  if (userRole === 'Student') {
    if (permissionsThatCanPost.includes(postAndCommentPermission)) {
      return true;
    }
    return false;
  }
  return false;
};

const permissionsThatCanComment = [
  'Students can only comment',
  'Students can post and comment',
];
export const canUserComment = (
  userRole?: String,
  classPermissions?: Map<String, String>,
) => {
  if (!classPermissions) return false;
  if (!classPermissions['postAndComment']) return false;
  if (!userRole) return false;

  const postAndCommentPermission = classPermissions['postAndComment'];
  if (userRole === 'Teacher') {
    return true;
  }
  if (userRole === 'Student') {
    if (permissionsThatCanComment.includes(postAndCommentPermission)) {
      return true;
    }
    return false;
  }
  return false;
};
