import * as React from 'react';
import { Box, Group, Space, Text } from '@mantine/core';
import { Compass, User } from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  className: string;
  classCode: string;
  teacherName: string;
  color: CardColor;
}

export enum CardColor {
  Slate = 'bg-slate-500 hover:bg-slate-600',
  Gray = 'bg-gray-500 hover:bg-gray-600',
  Zinc = 'bg-zinc-500 hover:bg-zinc-600',
  Stone = 'bg-stone-600 hover:bg-stone-700',
  Red = 'bg-red-400 hover:bg-red-500',
  Orange = 'bg-orange-300 hover:bg-orange-400',
  Lime = 'bg-lime-600 hover:bg-lime-700',
  Green = 'bg-green-600 hover:bg-green-700',
  Sky = 'bg-sky-600 hover:bg-sky-700',
  Volet = 'bg-violet-500 hover:bg-violet-600',
}

export function ClassCard(props: Props) {
  const { className, classCode, teacherName, color } = props;

  const navigate = useNavigate();

  const cardBgColor = color ? color : CardColor.Sky;

  const onClicked = () => {
    navigate('/class/1');
  };

  return (
    <Box
      component="button"
      className={`cursor-pointer rounded-md border-none px-6 py-6 text-white ${cardBgColor}`}
      onClick={onClicked}
    >
      <Group position="apart">
        <Text weight={'bold'}>{className}</Text>
        <Compass size={20} />
      </Group>
      <Space h={80} />
      <Group position="apart">
        <Text size="xl" weight={'lighter'}>
          {classCode}
        </Text>
        <Group className="rounded-md bg-white px-3 py-1 text-black">
          <User size={20} />
          <Text size="sm">{teacherName}</Text>
        </Group>
      </Group>
    </Box>
  );
}
