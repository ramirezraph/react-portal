import { Modal, Text } from '@mantine/core';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

interface Prop {}

export function LessonModal(props: Prop) {
  let navigate = useNavigate();

  const onClose = () => {
    navigate(-1);
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      withCloseButton={false}
      centered
      radius={'md'}
      size="full"
    >
      <Text>Hello, World</Text>
    </Modal>
  );
}
