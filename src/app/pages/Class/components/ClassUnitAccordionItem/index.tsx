import { Collapse, Divider, Group, Stack, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { EditUnitModal } from 'app/components/EditUnitModal/Loadable';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { ChevronDown, ChevronUp } from 'tabler-icons-react';
import { selectClassroom } from '../../slice/selectors';
import { Unit } from '../../slice/types';
import { ClassAccordionControl } from '../ClassAccordionControl/Loadable';
import { ClassAccordionHeader } from '../ClassAccordionHeader';
import { v4 as uuidv4 } from 'uuid';

export enum ClassAccordionType {
  Unit,
  Lesson,
}

interface Props {
  unit: Unit;
}

export function ClassUnitAccordionItem(props: Props) {
  const { unit } = props;

  const modals = useModals();
  const classroom = useSelector(selectClassroom);

  const [isOpened, setIsOpened] = React.useState(false);
  const [editUnitModalVisible, setEditUnitModalVisible] = React.useState(false);

  const displayDeleteUnitModal = () => {
    const unitToBeDeleted = unit;
    if (!unitToBeDeleted) return;

    return modals.openConfirmModal({
      title: <Text weight="bold">Are you absolutely sure?</Text>,
      centered: true,
      closeOnClickOutside: false,
      trapFocus: true,
      children: (
        <Text size="sm">
          This action cannot be undone. This will permanently delete{' '}
          <span className="font-bold">
            Unit {unitToBeDeleted.number}: {unitToBeDeleted.title}
          </span>
          , along with other data associated with it.
        </Text>
      ),
      labels: { confirm: 'Delete unit', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteUnit(),
    });
  };

  const deleteUnit = async () => {
    const path = classroom.unitPath;
    if (!path) return;

    const unitToBeDeleted = unit;
    if (!unitToBeDeleted) return;

    const notificationId = uuidv4();
    showNotification({
      id: notificationId,
      loading: true,
      title: 'In progress',
      message: `Deleting Unit ${unitToBeDeleted.number}: ${unitToBeDeleted.title} ...`,
      autoClose: false,
      disallowClose: true,
    });
  };

  const prepareEditUnitModal = () => {
    setEditUnitModalVisible(true);
  };

  return (
    <>
      <EditUnitModal
        visible={editUnitModalVisible}
        onToggle={setEditUnitModalVisible}
        unitId={unit.id}
        unitNumber={unit.number}
        unitTitle={unit.title}
        unitContent={unit.content}
      />
      <Stack className="outline outline-1 outline-stone-200" spacing={0}>
        <Group
          onClick={() => setIsOpened(x => !x)}
          className="cursor-pointer bg-slate-800 p-4"
          noWrap
        >
          <ClassAccordionHeader
            live={unit.isLive}
            title={unit.title}
            number={unit.number}
            type={ClassAccordionType.Unit}
          />
          {isOpened ? (
            <ChevronUp size={20} color="white" />
          ) : (
            <ChevronDown size={20} color="white" />
          )}
        </Group>
        <Collapse
          in={isOpened}
          transitionTimingFunction="linear"
          transitionDuration={150}
        >
          <div className="p-4">
            {/* Text Content */}
            {unit.content && (
              <Text className="mt-3 w-full" size="sm">
                {unit.content}
              </Text>
            )}
            <Divider className="mt-6" />
            <ClassAccordionControl
              unitId={unit.id}
              unitNumber={`Unit ${unit.number}`}
              live={unit.isLive}
              type={ClassAccordionType.Unit}
              openDeleteModal={displayDeleteUnitModal}
              openEditModal={prepareEditUnitModal}
            />
          </div>
        </Collapse>
      </Stack>
    </>
  );
}
