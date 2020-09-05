import { useEffect, useState } from 'react';
import { store, getUserList } from 'utils';

const STORE_EXPIRE = 604800000; // 1 week
const LS_KEY = process.env.NEXT_PUBLIC_LS_KEY;
const SLACKBOT_ID = 'USLACKBOT';

const initialState = {
  isLoading: true,
  users: [],
};

const useGetUserList = () => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const userListFromCache = store.get(LS_KEY);

    if (userListFromCache) {
      setState({
        isLoading: false,
        users: userListFromCache,
      });
    } else {
      getUserList().then((users) => {
        // Filter out bots, disabled, etc...
        const filteredUsers = users.filter((user) => {
          return user.is_bot === false && user.id !== SLACKBOT_ID && user.deleted === false;
        });

        store.set(LS_KEY, filteredUsers, new Date().getTime() + STORE_EXPIRE);
        setState({
          isLoading: false,
          users: filteredUsers,
        });
      });
    }
  }, [setState]);

  return state;
};

export default useGetUserList;
