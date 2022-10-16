import {
  Group,
  Text,
  Modal,
  Button,
  Divider,
  TextInput,
  Stack,
  useMantineTheme,
} from '@mantine/core';
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import { showNotification, updateNotification } from '@mantine/notifications';
import { selectClassroom } from 'app/pages/Class/slice/selectors';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { db, usersColRef } from 'services/firebase';
import { selectUser } from 'store/userSlice/selectors';
import { NotificationType } from 'store/userSlice/types';
import { Check, UserSearch, X } from 'tabler-icons-react';
import { SearchResultItem } from './SearchResultItem/Loadable';
import { SelectedUserItem } from './SelectedUserItem/Loadable';
import { v4 as uuidv4 } from 'uuid';

export interface SearchResult {
  userId: string;
  email: string;
  picture: string;
  fullname: string;
}

interface Props {
  visible: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SendClassInviteModal(props: Props) {
  const { visible, onToggle } = props;

  const { activeClass } = useSelector(selectClassroom);
  const { currentUser } = useSelector(selectUser);

  const [searchTextValue, setSearchTextValue] = React.useState('');
  const [debouncedSearchValue] = useDebouncedValue(searchTextValue, 500);
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [selected, setSelected] = React.useState<SearchResult[]>([]);
  const [inviteLoading, setInviteLoading] = React.useState(false);
  const [inviteCodeCopied, setInviteCodeCopied] = React.useState(false);

  const theme = useMantineTheme();
  const isTablet = useMediaQuery(`(min-width: ${theme.breakpoints.md}px)`);

  const onSearchTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTextValue(event.target.value);
  };

  React.useEffect(() => {
    const performUserSearch = async () => {
      console.log('performing search');

      const q = query(
        usersColRef,
        where('email', '>=', debouncedSearchValue),
        where('email', '<=', debouncedSearchValue + '\uf8ff'),
      );

      const searchSnapshot = await getDocs(q);
      const list: SearchResult[] = [];
      searchSnapshot.forEach(searchItem => {
        const data = searchItem.data();
        const searchResult: SearchResult = {
          userId: searchItem.id,
          email: data.email,
          picture: data.picture,
          fullname: `${data.firstName} ${data.lastName}`,
        };
        list.push(searchResult);
      });
      setSearchResults(list);
    };

    if (debouncedSearchValue.length >= 4) {
      performUserSearch();
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchValue]);

  const checkIfUserIsAlreadyInClass = (userId: string) => {
    if (!activeClass?.usersList) return;

    const test = activeClass.usersList.includes(userId);
    if (test) {
      return true;
    }

    return false;
  };

  const checkIfUserHasPendingInvite = (userId: string) => {
    if (!activeClass?.pendingInvites) return;

    const test = activeClass.pendingInvites.includes(userId);
    if (test) {
      return true;
    }

    return false;
  };

  const onSelectUser = (user: SearchResult) => {
    const isAlreadySelected = selected.includes(user);
    if (isAlreadySelected) {
      return;
    }

    // check if the person is already in the class
    const isAlreadyInClass = checkIfUserIsAlreadyInClass(user.userId);
    if (isAlreadyInClass) {
      console.log('isAlreadyInClass');
      showNotification({
        title: 'Cannot be added',
        message: `User is already in the class.`,
        color: 'red',
        icon: <X />,
      });
      return;
    }

    // check if the person have a pending invitation from this class
    const hasPendingInvite = checkIfUserHasPendingInvite(user.userId);
    if (hasPendingInvite) {
      console.log('hasPendingInvite');
      showNotification({
        title: 'Cannot be added',
        message: `User has already been invited.`,
        color: 'red',
        icon: <X />,
      });
      return;
    }

    setSelected(prev => [...prev, user]);
  };

  const onRemoveSelectedUser = (user: SearchResult) => {
    setSelected(prev => [...prev.filter(x => x.userId !== user.userId)]);
  };

  const onSendInvite = async () => {
    if (!activeClass?.id) return;
    if (!currentUser?.sub) return;

    try {
      setInviteLoading(true);

      const notificationId = uuidv4();
      showNotification({
        id: notificationId,
        loading: true,
        title: 'In progress',
        message: `Sending class invitation ...`,
        autoClose: false,
        disallowClose: true,
      });

      for (const user of selected) {
        // invite selected users
        const newNotification = {
          classId: activeClass.id,
          type: NotificationType.ClassInvite,
          createdAt: serverTimestamp(),
          read: false,
          fromUserId: currentUser.sub,
        };

        await addDoc(
          collection(db, `users/${user.userId}/notifications`),
          newNotification,
        );

        const classDocRef = doc(db, 'classes', activeClass.id);
        await updateDoc(classDocRef, {
          pendingInvites: arrayUnion(user.userId),
        });
      }

      // cleanup
      onToggle(false);
      setSearchTextValue('');
      setSelected([]);

      updateNotification({
        id: notificationId,
        title: 'Success',
        message: `Class invite sent successfully.`,
        color: 'green',
        icon: <Check />,
      });
    } catch (e) {
      showNotification({
        title: 'Failed',
        message: `Sending class invite failed. \n${e}`,
        color: 'red',
        icon: <X />,
      });
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <Modal
      withCloseButton={false}
      opened={visible}
      onClose={() => onToggle(false)}
      centered
      size={500}
    >
      <Group position="apart">
        <Text size="xl" weight={600}>
          Send Invite
        </Text>
        <Group>
          {isTablet && (
            <Button
              variant="light"
              color={inviteCodeCopied ? 'green' : 'primary'}
              leftIcon={inviteCodeCopied ? <Check size={18} /> : null}
              onClick={() => {
                if (activeClass?.inviteCode) {
                  navigator.clipboard.writeText(activeClass.inviteCode);

                  navigator.clipboard.readText().then(clipText => {
                    if (clipText) {
                      setInviteCodeCopied(true);
                    }
                  });
                }
              }}
            >
              Copy Invite Code
            </Button>
          )}

          <Button variant="default" onClick={() => onToggle(false)}>
            Close
          </Button>
        </Group>
      </Group>
      {!isTablet && (
        <Button
          variant="light"
          color={inviteCodeCopied ? 'green' : 'primary'}
          leftIcon={inviteCodeCopied ? <Check size={18} /> : null}
          className="mt-3"
          onClick={() => {
            if (activeClass?.inviteCode) {
              navigator.clipboard.writeText(activeClass.inviteCode);

              navigator.clipboard.readText().then(clipText => {
                if (clipText) {
                  setInviteCodeCopied(true);
                }
              });
            }
          }}
        >
          Copy Invite Code
        </Button>
      )}
      <Divider my="sm" />
      <Stack className="mt-6">
        {selected.length > 0 && (
          <Stack>
            <Group>
              <Text color="gray" size="xs">
                Selected:
              </Text>
              <Text color="gray" size="xs">
                {searchResults.length}
              </Text>
            </Group>
            <Group>
              {selected.map(item => (
                <SelectedUserItem
                  key={item.userId}
                  user={item}
                  onRemove={onRemoveSelectedUser}
                />
              ))}
            </Group>
          </Stack>
        )}
        <TextInput
          value={searchTextValue}
          className="w-full"
          placeholder="Search people by email"
          variant="default"
          icon={<UserSearch size={18} />}
          size="md"
          onChange={onSearchTextChanged}
        ></TextInput>
        <Group>
          <Text color="gray" size="xs">
            Search Result:
          </Text>
          <Text color="gray" size="xs">
            {searchResults.length}
          </Text>
        </Group>
      </Stack>
      <Stack className="mt-3">
        {searchResults.map(item => (
          <SearchResultItem
            key={item.userId}
            user={item}
            onSelectUser={onSelectUser}
            selected={selected.includes(item)}
          />
        ))}
      </Stack>

      <Button
        loading={inviteLoading}
        size="sm"
        className="mt-6 w-full"
        disabled={selected.length <= 0}
        onClick={onSendInvite}
      >
        SEND INVITE
      </Button>
    </Modal>
  );
}
