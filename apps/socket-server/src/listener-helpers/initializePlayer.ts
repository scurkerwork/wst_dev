import { Socket } from 'socket.io';
import { pubClient } from '../redis';
import { gamePlayers } from '../db';
import { playerValueString } from '../util';
import { ONE_DAY } from '../constants';
import sendPlayerList from './sendPlayerList';
import Keys from '../keys';

const initializePlayer = async (socket: Socket) => {
  const playersKey = socket.keys.currentPlayers;

  // change player status in DB
  await gamePlayers.setStatus(socket.playerId, 'connected');

  const isPlayerRecentlyDisconnected = await pubClient.get(
    Keys.recentlyDisconnected(socket.gameId, socket.playerId)
  );

  if (isPlayerRecentlyDisconnected) {
    await pubClient.del(
      Keys.recentlyDisconnected(socket.gameId, socket.playerId)
    );
  } else {
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
