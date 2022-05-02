import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Group,
  ScrollArea,
  Text,
} from '@mantine/core';
import { AttachedFile } from 'app/components/LessonModal/components/AttachedFile/Loadable';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Pencil,
  Send,
} from 'tabler-icons-react';
import { StudentsListItem } from '../StudentsListItem/Loadable';

interface Props {}

export function StudentWork(props: Props) {
  // const {  } = props;

  const navigate = useNavigate();

  return (
    <Group className="my-3 w-2/5 bg-document p-4" direction="column">
      <Group className="w-full items-center" position="apart">
        <Button
          variant="subtle"
          color="dark"
          leftIcon={<ChevronLeft size={16} />}
          compact
          onClick={() => navigate(-1)}
        >
          Back to list
        </Button>
        <Group spacing="xs">
          <ActionIcon>
            <ArrowLeft />
          </ActionIcon>
          <ActionIcon>
            <ArrowRight />
          </ActionIcon>
        </Group>
      </Group>
      <ScrollArea
        className="w-full"
        style={{
          height: '60vh',
        }}
        scrollbarSize={7}
        offsetScrollbars
      >
        <Group direction="column" spacing="xs">
          <Box className="w-full rounded-md bg-white p-4">
            <StudentsListItem
              id="123"
              studentImageUrl="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
              studentName="John D. Doe"
              gradeText="89/100"
              status="Graded"
            />
          </Box>
          <Box className="w-full rounded-md bg-white p-4">
            <Text className="font-semibold">John's work</Text>
            <Group position="apart" className="mt-3">
              <Text size="xs">Name</Text>
              <Text className="w-12" size="xs">
                Actions
              </Text>
            </Group>
            <Group direction="column" className="mt-3" spacing="md">
              <AttachedFile name="Introduction.pdf" compact />
              <AttachedFile name="Welcome to the class.mp4" compact />
            </Group>
          </Box>
          <Box className="w-full rounded-md bg-white p-4">
            <Group position="apart">
              <Text className="font-semibold">Grade</Text>
              <Group>
                <Group spacing={4}>
                  <Text className="font-semibold">?/100</Text>
                  <ActionIcon>
                    <Pencil size={19} />
                  </ActionIcon>
                </Group>
                <Button>
                  <Text size="sm" weight={400}>
                    Return
                  </Text>
                </Button>
              </Group>
            </Group>
          </Box>
          <Group direction="column" className="w-full">
            <Text className="w-full font-semibold" size="sm">
              Private comments
            </Text>
            <Box className="w-full rounded-md bg-white p-4">
              <Group className="w-full">
                <Avatar
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
                  radius="xl"
                  size="sm"
                />
                <Text size="sm" className="font-semibold">
                  John D. Doe
                </Text>
              </Group>
              <Text className="mt-3" size="sm">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa
                sunt maxime excepturi inventore nesciunt, amet eius facilis
                unde. Eligendi, debitis.
              </Text>
            </Box>
            <Box className="w-full cursor-pointer rounded-md bg-white px-3 py-2">
              <Group position="apart">
                <Text weight={400} size="sm" className="text-gray-500">
                  Write a comment here
                </Text>
                <ActionIcon className="text-gray-500">
                  <Send />
                </ActionIcon>
              </Group>
            </Box>
          </Group>
        </Group>
      </ScrollArea>
    </Group>
  );
}
