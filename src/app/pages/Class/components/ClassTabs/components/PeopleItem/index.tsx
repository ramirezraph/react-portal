import { Group, Avatar, ActionIcon, Text, Checkbox } from '@mantine/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'store/userSlice/selectors';
import { Mail, UserCircle, UserX } from 'tabler-icons-react';
import { getNameAndPicture } from 'utils/userUtils';

interface Prop {
  userId: string;
}

export function PeopleItem(props: Prop) {
  const { userId } = props;

  const { currentUser } = useSelector(selectUser);

  const [fullname, setFullname] = React.useState('');
  const [picture, setPicture] = React.useState('');

  const [isCurrentUser, setIsCurrentUser] = React.useState(false);

  React.useEffect(() => {
    const fetchInfo = async () => {
      const result = await getNameAndPicture(userId);
      if (result) {
        const { fullname, picture } = result;
        setFullname(fullname);
        setPicture(picture);
      }
    };

    fetchInfo();

    if (userId === currentUser?.sub) {
      setIsCurrentUser(true);
    }
  }, [currentUser?.sub, userId]);

  return (
    <Group position="apart" className="mt-4 w-full">
      <Group>
        <Checkbox />
        <Avatar radius="xl" src={picture} size="md" />
        <Text size="md">{fullname}</Text>
      </Group>
      {!isCurrentUser && (
        <Group>
          <ActionIcon>
            <Mail />
          </ActionIcon>
          <ActionIcon>
            <UserCircle />
          </ActionIcon>
          <ActionIcon>
            <UserX />
          </ActionIcon>
        </Group>
      )}
    </Group>
  );
}
