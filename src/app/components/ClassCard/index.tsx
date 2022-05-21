import * as React from 'react';
import { Box, Group, Space, Text } from '@mantine/core';
import { Compass, Settings, User } from 'tabler-icons-react';
import { useNavigate } from 'react-router-dom';
import { db } from 'services/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Props {
  id: string;
  classTitle: string;
  classCode: string;
  teacherId: string;
  color: CardColor;
  inClass?: boolean;
  onClick?: () => void;
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
  const { id, classTitle, classCode, teacherId, color, inClass, onClick } =
    props;

  const navigate = useNavigate();

  const cardBgColor = color ? color : CardColor.Sky;

  const [teacherName, setTeacherName] = React.useState('');
  React.useEffect(() => {
    const getTeacherName = async () => {
      const docRef = doc(db, 'users', teacherId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTeacherName(`${data.firstName} ${data.lastName}`);
      }
    };

    getTeacherName();
  }, [teacherId]);

  const onClicked = () => {
    navigate(`/class/${id}`);
  };

  return (
    <Box
      component="button"
      className={`w-full cursor-pointer rounded-md border-none px-6 py-6 text-white ${cardBgColor}`}
      onClick={inClass ? onClick : onClicked}
    >
      <Group position="apart" noWrap>
        <Text weight={'bold'}>{classTitle}</Text>

        {inClass ? <Settings size={20} /> : <Compass size={20} />}
      </Group>
      <Space h={80} />
      <Group position="apart" noWrap>
        <Text size="xl" weight={'lighter'}>
          {classCode}
        </Text>
        <Group noWrap className="rounded-md bg-white px-3 py-1 text-black">
          <User size={20} />
          <Text
            size="sm"
            style={{
              maxWidth: '20ch',
            }}
            lineClamp={1}
          >
            {teacherName}
          </Text>
        </Group>
      </Group>
    </Box>
  );
}
