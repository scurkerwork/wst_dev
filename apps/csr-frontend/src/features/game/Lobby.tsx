import { types } from '@whosaidtrue/api-interfaces';
import { PlayerRef } from '@whosaidtrue/app-interfaces';
import { Lobby as LobbyUi } from "@whosaidtrue/ui";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectIsHost, selectPlayerName, selectPlayerId, selectPlayerList, removePlayer } from "./gameSlice";
import useSocket from '../socket/useSocket';
import { showPlayerRemoved } from '../modal/modalSlice';

const Lobby: React.FC = () => {
    const dispatch = useAppDispatch();
    const { sendMessage } = useSocket();
    const isHost = useAppSelector(selectIsHost);
    const playerId = useAppSelector(selectPlayerId)
    const players = useAppSelector(selectPlayerList);
    const playerName = useAppSelector(selectPlayerName)

    // get all players other than current user. Current user's name is displayed differently
    const otherPlayers = () => players.filter(p => p.id !== playerId)
    // Creates buttons to remove players if a player is host
    const handlerFactory = (player: PlayerRef) => {
        if (isHost) {

            return () => {
                sendMessage(types.REMOVE_PLAYER, player, () => {
                    // on ack, remove player
                    dispatch(removePlayer(player.id));
                    dispatch(showPlayerRemoved(player.player_name))
                })
            }
        } else {
            return () => null;
        }
    }

    return (
        <LobbyUi
            isHost={isHost}
            otherPlayers={otherPlayers()}
            playerName={playerName}
            footerMessage={'The host will start the game once all players have joined.'}
            handlerFactory={handlerFactory} />
    )
}

export default Lobby;