import { Popover, Group, Button, Divider, Text } from '@mantine/core';
import * as React from 'react';
import { useState } from 'react';
import { Bell } from 'tabler-icons-react';
import { NotificationItems } from '../NotificationItems/loadable';

interface Prop {}

export function PopoverNotification(props: Prop) {
  const [notificationModalVisible, setNotificationModalVisible] =
    useState(false);
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
      <Divider />
      <NotificationItems
        name="Genesis Diaz"
        imageUrl="https://i.pravatar.cc/150"
        subject="Python"
        date="10 months ago"
      />
      <NotificationItems
        name="Hanz Cruz"
        imageUrl="https://scontent.fmnl17-3.fna.fbcdn.net/v/t39.30808-6/275215941_5295957080448286_5224006195072843048_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=09cbfe&_nc_eui2=AeFB46Q75bZBa0lwGxi0ESEc4ukXJUc7J8Di6RclRzsnwF7O92Butm3Wu_QY5_jkB5bN_Zj_bBCjfeOcSyZj_5x-&_nc_ohc=fzGRQj-i_0AAX86DogB&_nc_ht=scontent.fmnl17-3.fna&oh=00_AT8sUufdW3eUGcB7mKAa4z7w4JkXk4_SwCCQ0Sq6sAsNug&oe=62767843"
        subject="Recess"
        date="10 months ago"
      />
    </Popover>
  );
}
