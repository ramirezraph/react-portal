import {
  Popover,
  Group,
  Button,
  Divider,
  Text,
  Stack,
  Indicator,
} from '@mantine/core';
import { ClassInviteNotification } from 'app/components/Notifications';
import { doc, updateDoc } from 'firebase/firestore';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { db } from 'services/firebase';
import { selectUser } from 'store/userSlice/selectors';
import { AppNotification, NotificationType } from 'store/userSlice/types';
import { Bell } from 'tabler-icons-react';

interface Prop {
  notifications: AppNotification[];
}

export function PopoverNotification(props: Prop) {
  const { notifications } = props;

  const { currentUser } = useSelector(selectUser);

  const [notificationModalVisible, setNotificationModalVisible] =
    React.useState(false);
  const [notificationsList, setNotificationsList] = React.useState<
    AppNotification[]
  >([]);
  const [numberOfUnreadNotifications, setNumberOfUnreadNotifications] =
    React.useState(0);

  React.useEffect(() => {
    setNotificationsList(notifications);

    const unreads = notifications.filter(n => !n.read).length;
    setNumberOfUnreadNotifications(unreads);
  }, [notifications]);

  React.useEffect(() => {
    if (!currentUser?.sub) return;
    if (!notificationModalVisible) return;

    const setNotificationsAsRead = async () => {
      const unreadNotifications = notificationsList.filter(n => !n.read);
      for (const notification of unreadNotifications) {
        const notificationDocRef = doc(
          db,
          `users/${currentUser.sub}/notifications`,
          notification.id,
        );
        await updateDoc(notificationDocRef, {
          read: true,
        });
      }
    };

    setNotificationsAsRead();
  }, [currentUser?.sub, notificationModalVisible, notificationsList]);

  return (
    <Popover
      opened={notificationModalVisible}
      onClose={() => setNotificationModalVisible(false)}
      target={
        <Indicator
          inline
          label={numberOfUnreadNotifications}
          size={16}
          disabled={numberOfUnreadNotifications === 0}
        >
          <Bell
            size={24}
            onClick={() => setNotificationModalVisible(o => !o)}
          />
        </Indicator>
      }
      width={400}
      position="top"
      placement="end"
      gutter={30}
      withArrow
      styles={{
        inner: {
          overflowY: 'auto',
          maxHeight: 600,
        },
      }}
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
                id={notification.id}
                fromUserId={notification.fromUserId}
                classId={notification.classId!}
                createdAt={notification.createdAt}
                result={notification.result}
              />
            );
          }

          return (
            <ClassInviteNotification
              key={index}
              id={notification.id}
              fromUserId={notification.fromUserId}
              classId={notification.classId!}
              createdAt={notification.createdAt}
              result={notification.result}
            />
          );
        })}
      </Stack>
    </Popover>
  );
}
