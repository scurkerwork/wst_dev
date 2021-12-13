import { Socket } from 'socket.io';
import { pubClient } from '../redis';
import { gamePlayers, oneLiners } from '../db';
import { playerValueString } from '../util';
import { ONE_DAY } from '../constants';
import sendPlayerList from './sendPlayerList';
import Keys from '../keys';
import sendOneLiners from './sendOneLiners';

function getDomainSocket(origin: string) {
  if (!origin) return;

  if (origin.includes('whosaidtrue.com')) {
    return 'www.whosaidtrue.com';
  } else if (origin.includes('whosaidtrueforschools.com')) {
    return 'www.whosaidtrueforschools.com';
  } else {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('unknown origin');
    } else {
      return origin;
    }
  }
}

const initializePlayer = async (socket: Socket) => {
  const playersKey = socket.keys.currentPlayers;

  const lock = await pubClient.set(
    Keys.oneLiners(socket.gameId),
    1,
    'EX',
    10,
    'NX'
  );

  if (lock) {
    const domain = getDomainSocket(socket.request.headers.origin);

    const oneLinersList = await oneLiners.getSelection(
      domain === process.env.FOR_SCHOOLS_DOMAIN
    );

    await pubClient.set(
        Keys.oneLiners(socket.gameId),
        JSON.stringify(oneLinersList.rows.map((row) => row.text)),
        'EX',
        ONE_DAY
    );
  }

  sendOneLiners(socket);

  // change player status in DB
  await gamePlayers.setStatus(socket.playerId, 'connected');

  const deletedKeyCount = await pubClient.del(
    Keys.recentlyDisconnected(socket.gameId, socket.playerId)
  );

  if (deletedKeyCount === 0) {
    // add player to redis
    await pubClient
      .pipeline()
      .sadd(playersKey, playerValueString(socket))
      .expire(playersKey, ONE_DAY)
      .exec();
  }

  // send list of current players back to connecting client
  sendPlayerList(socket);
};

export default initializePlayer;
