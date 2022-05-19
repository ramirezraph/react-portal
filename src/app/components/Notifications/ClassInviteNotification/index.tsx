import { Button, Group, Stack, Text } from '@mantine/core';
import { UserAvatar } from 'app/components/UserAvatar/Loadable';
import * as React from 'react';
import { getNameAndPicture } from 'utils/userUtils';
import moment from 'moment';
import { getClassNameAndCode } from 'utils/types/classUtils';

interface Props {
  fromUserId: string;
  classId: string;
  createdAt: string;
}

export function ClassInviteNotification(props: Props) {
  const { fromUserId, classId, createdAt } = props;

  const [fullname, setFullname] = React.useState('');
  const [classInfo, setClassInfo] = React.useState('');

  React.useEffect(() => {
    const fetchInfo = async () => {
      const nameAndPicture = await getNameAndPicture(fromUserId);
      if (nameAndPicture) {
        const { fullname } = nameAndPicture;
        setFullname(fullname);
      }

      const nameAndCode = await getClassNameAndCode(classId);
      if (nameAndCode) {
        const { name, code } = nameAndCode;
        setClassInfo(`${code}: ${name}`);
      }
    };

    fetchInfo();
  }, [classId, fromUserId]);

  return (
    <Group className="items-start py-3" noWrap>
      <UserAvatar userId={fromUserId} size="md" radius="xl" />
      <Stack spacing={5}>
        <Text size="md">{fullname}</Text>

        <Text size="sm">
          invited you to join the class:{' '}
          <span className="font-bold">{classInfo}</span>
        </Text>
        <Text className="text-gray-400" size="xs">
          {moment(createdAt).fromNow()}
        </Text>
        <Group className="mt-3">
          <Button color="primary">
            <Text size="sm" weight={400}>
              Accept
            </Text>
          </Button>
          <Button color="gray">
            <Text size="sm" weight={400}>
              Decline
            </Text>
          </Button>
        </Group>
      </Stack>
    </Group>
  );
}
