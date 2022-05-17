import { Avatar, DefaultMantineColor, MantineNumberSize } from '@mantine/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'store/userSlice/selectors';
import { Auth0User } from 'store/userSlice/types';

interface Props {
  currentUser?: boolean;
  userId?: string;
  size?: MantineNumberSize;
  radius?: MantineNumberSize;
  alt?: string;
  color?: DefaultMantineColor;
}

export function UserAvatar(props: Props) {
  const { currentUser, size, radius, color } = props;

  const currentLoggedInUser = useSelector(selectUser);

  const [user, setUser] = React.useState<Auth0User | null>(null);

  React.useEffect(() => {
    if (currentUser) {
      setUser(currentLoggedInUser.currentUser);
    }
  }, [currentLoggedInUser.currentUser, currentUser]);

  return (
    <Avatar
      size={size ? size : 'lg'}
      src={user?.picture}
      radius={radius ? radius : 'lg'}
      alt={user?.name}
      color={color ? color : 'primary'}
    />
  );
}
