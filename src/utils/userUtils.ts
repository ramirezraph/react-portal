import { doc, getDoc } from 'firebase/firestore';
import { db } from 'services/firebase';

const getFullname = async (userId: string) => {
  if (!userId) return null;

  const userDocRef = doc(db, 'users', userId);
  const user = await getDoc(userDocRef);

  if (user.exists()) {
    return `${user.data().firstName} ${user.data().lastName}`;
  }

  return null;
};

const getNameAndPicture = async (userId: string) => {
  if (!userId) return null;

  const userDocRef = doc(db, 'users', userId);

  const user = await getDoc(userDocRef);
  if (user.exists()) {
    const data = user.data();
    return {
      fullname: `${data.firstName} ${data.lastName}`,
      picture: data.picture,
    };
  }

  return null;
};

export { getFullname, getNameAndPicture };
