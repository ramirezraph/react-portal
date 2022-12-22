import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ClassMaterials } from '../ClassMaterials/Loadable';

interface Props {}

export function ClassMaterialsTab(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useMantineTheme();
  const isLargeScreen = useMediaQuery(`(min-width: ${theme.breakpoints.xl}px)`);

  React.useEffect(() => {
    const isInMaterialsTab = location.pathname.split('/')[3] === 'materials';
    if (isLargeScreen && isInMaterialsTab) {
      const classId = location.pathname.split('/')[2];
      navigate(`/class/${classId}`);
    }
  }, [isLargeScreen, location.pathname, navigate]);

  return (
    <div
      className="w-full bg-transparent py-3"
      style={{
        minHeight: 500,
      }}
    >
      <ClassMaterials />
    </div>
  );
}
