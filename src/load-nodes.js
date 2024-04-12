import localForage from "localforage";

import { fetchAllGames } from "./fetches/chesscom";

export default async (username) => {
  const lastUpdatedDate = await localForage.getItem(
    `${username}_lastUpdatedDate`
  );

  if (lastUpdatedDate) {
    return Promise.resolve();
  } else {
    const games = await fetchAllGames(username);

    return new Promise((resolve, reject) => {
      const worker = new Worker(
        new URL("./workers/build-graph", import.meta.url)
      );

      worker.postMessage({ username, games });
      worker.onmessage = async ({ data: { whiteNodes, blackNodes } }) => {
        for (const [key, value] of Object.entries(whiteNodes)) {
          await localForage.setItem(`${username}_white_${key}`, value);
        }
        for (const [key, value] of Object.entries(blackNodes)) {
          await localForage.setItem(`${username}_black_${key}`, value);
        }
        localForage.setItem(
          `${username}_lastUpdatedDate`,
          new Date().toString()
        );

        resolve();
      };
    });
  }
};
