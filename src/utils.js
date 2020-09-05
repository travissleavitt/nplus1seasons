import engine from "store/src/store-engine";
import lsStorage from "store/storages/localStorage";
import expirePlugin from "store/plugins/expire";

export const store = engine.createStore([lsStorage], [expirePlugin]);

/**
 * Gets user list from N+1 Seasons
 */
export const getUserList = async () => {
  try {
    const response = await fetch("/api/get-users");
    const data = await response.json();

    return data;
  } catch (error) {
    return [];
  }
};
