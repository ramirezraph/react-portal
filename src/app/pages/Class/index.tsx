import { Group, Skeleton, Text, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { PageContainer } from 'app/components/PageContainer/Loadable';
import { doc, getDoc } from 'firebase/firestore';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { db } from 'services/firebase';
import { selectUser } from 'store/userSlice/selectors';
import { canUserComment, canUserPost } from 'utils/classUtils';
import { CardColor, ClassCard } from '../../components/ClassCard';
import { selectClasses } from '../Classes/slice/selectors';
import { Class as IClass } from '../Classes/slice/types';
import { ClassMaterials } from './components/ClassMaterials/Loadable';
import { ClassTabs } from './components/ClassTabs/Loadable';
import { SettingsDrawer } from './components/SettingsDrawer/Loadable';
import { useClassroomSlice } from './slice';
import { selectClassroom } from './slice/selectors';

export function Class() {
  let { id } = useParams();

  const dispatch = useDispatch();
  const classroom = useSelector(selectClassroom);
  const classes = useSelector(selectClasses);
  const { currentUser } = useSelector(selectUser);
  const { actions: classroomActions } = useClassroomSlice();

  const [openedClass, setOpenedClass] = React.useState<IClass | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [classSettingsDrawerVisible, setClassSettingsDrawerVisible] =
    React.useState(false);

  const theme = useMantineTheme();
  const isLargeScreen = useMediaQuery(`(min-width: ${theme.breakpoints.xl}px)`);

  React.useEffect(() => {
    setLoading(true);
    const fetchClassData = () => {
      if (!id) return;
      const search = classes.classes.find(c => c.id === id);
      if (!search) return;

      dispatch(classroomActions.setActiveClass({ activeClass: search }));

      const unitsSubColPath = `classes/${search.id}/units`;
      dispatch(classroomActions.updateUnitPath({ path: unitsSubColPath }));
      setOpenedClass(search);
    };

    fetchClassData();
    setLoading(false);
  }, [classes.classes, classroomActions, dispatch, id]);

  React.useEffect(() => {
    const getUserRole = async () => {
      if (!openedClass?.id) return;
      if (!currentUser?.sub) return;

      const peopleColPath = `classes/${openedClass.id}/people`;
      const docRef = doc(db, peopleColPath, currentUser.sub);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        dispatch(classroomActions.setActiveClassRole({ role: data.type }));
      }
    };

    getUserRole();
  }, [classroomActions, currentUser?.sub, dispatch, openedClass?.id]);

  React.useEffect(() => {
    const canPostResult = canUserPost(
      classroom?.activeClassRole,
      classroom.activeClass?.permissions,
    );
    const canCommentResult = canUserComment(
      classroom?.activeClassRole,
      classroom.activeClass?.permissions,
    );

    dispatch(classroomActions.setCanPost({ value: canPostResult }));
    dispatch(classroomActions.setCanComment({ value: canCommentResult }));
  }, [
    classroom.activeClass?.permissions,
    classroom?.activeClassRole,
    classroomActions,
    dispatch,
  ]);

  return (
    <>
      <Helmet>
        <title>{openedClass?.code}</title>
      </Helmet>
      <PageContainer>
        {openedClass && (
          <>
            <SettingsDrawer
              visible={classSettingsDrawerVisible}
              onToggle={setClassSettingsDrawerVisible}
              id={openedClass.id}
              classTitle={openedClass.name}
              classCode={openedClass.code}
              classShortDescription={openedClass.shortDescription}
              ownerId={openedClass.ownerId}
              inviteCode={openedClass.inviteCode}
              permissions={openedClass.permissions}
            />
            <Text size="lg" weight={'bold'}>
              Class
            </Text>
            <Group
              noWrap
              position="apart"
              direction={isLargeScreen ? 'row' : 'column'}
              className="mt-3 h-full items-start"
            >
              <Group
                spacing={'md'}
                className="w-full xl:w-1/3"
                direction="column"
              >
                <Skeleton visible={loading} className="w-full">
                  <ClassCard
                    id={openedClass.id}
                    classTitle={openedClass.name}
                    classCode={openedClass.code}
                    teacherId={openedClass.ownerId}
                    color={CardColor.Sky}
                    onClick={() => setClassSettingsDrawerVisible(true)}
                    inClass
                  />
                </Skeleton>
                {isLargeScreen && <ClassMaterials />}
              </Group>
              <Skeleton visible={loading} className="w-full xl:w-2/3">
                <ClassTabs />
              </Skeleton>
            </Group>
          </>
        )}
      </PageContainer>
    </>
  );
}
