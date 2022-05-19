import { Popover, Group, Button, Divider, Text, Stack } from '@mantine/core';
import { ClassInviteNotification } from 'app/components/Notifications';
import * as React from 'react';
import { AppNotification, NotificationType } from 'store/userSlice/types';
import { Bell } from 'tabler-icons-react';

interface Prop {
  notifications: AppNotification[];
}

export function PopoverNotification(props: Prop) {
  const { notifications } = props;

  const [notificationModalVisible, setNotificationModalVisible] =
    React.useState(false);
  const [notificationsList, setNotificationsList] = React.useState<
    AppNotification[]
  >([]);

  React.useEffect(() => {
    setNotificationsList(notifications);
  }, [notifications]);

  return (
    <Popover
      opened={notificationModalVisible}
      onClose={() => setNotificationModalVisible(false)}
      target={
        <Bell size={24} onClick={() => setNotificationModalVisible(o => !o)} />
      }
      width={400}
      position="top"
      placement="end"
      gutter={30}
      withArrow
    >
      <Group position="apart">
        <Text>Earlier</Text>
        <Button size="xs" variant="subtle">
          VIEW ALL
        </Button>
      </Group>
      <Divider className="mt-1" />
      <Stack>
        {notificationsList.length === 0 && (
          <div className="py-3">
            <Text size="sm" color="gray">
              You have no notifications.
            </Text>
          </div>
        )}
        {notificationsList.map((notification, index) => {
          if (notification.type === NotificationType.ClassInvite) {
            return (
              <ClassInviteNotification
                key={index}
                fromUserId={notification.fromUserId}
                classId={notification.classId!}
                createdAt={notification.createdAt}
              />
            );
          }

          return (
            <ClassInviteNotification
              key={index}
              fromUserId={notification.fromUserId}
              classId={notification.classId!}
              createdAt={notification.createdAt}
            />
          );
        })}
      </Stack>
    </Popover>
  );
}
