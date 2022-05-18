import { Avatar, DefaultMantineColor, MantineNumberSize } from '@mantine/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'store/userSlice/selectors';
import { getNameAndPicture } from 'utils/userUtils';

interface Props {
  currentUser?: boolean;
  userId?: string;
  size?: MantineNumberSize;
  radius?: MantineNumberSize;
  alt?: string;
  color?: DefaultMantineColor;
}

export function UserAvatar(props: Props) {
  const { currentUser, size, radius, color, userId } = props;

  const { currentUser: CurrentAuthUser } = useSelector(selectUser);

  const [fullname, setFullname] = React.useState('');
  const [picture, setPicture] = React.useState('');

  React.useEffect(() => {
    const getUserInfo = async () => {
      if (currentUser && CurrentAuthUser?.sub) {
        const result = await getNameAndPicture(CurrentAuthUser.sub);
        if (result) {
          const { fullname, picture } = result;
          setFullname(fullname);
          setPicture(picture);
          return;
        }
      }

      if (!currentUser && userId) {
        const result = await getNameAndPicture(userId);
        if (result) {
          const { fullname, picture } = result;
          setFullname(fullname);
          setPicture(picture);
          return;
        }
      }
    };

    getUserInfo();
  }, [CurrentAuthUser?.sub, currentUser, userId]);

  return (
    <Avatar
      size={size ? size : 'lg'}
      src={picture}
      radius={radius ? radius : 'lg'}
      alt={fullname}
      color={color ? color : 'primary'}
    />
  );
}
