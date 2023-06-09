import { Button } from '@whosaidtrue/ui';
import { useHistory, useLocation } from 'react-router-dom';
import { setFullModal } from '../modal/modalSlice';
import useSocket from '../socket/useSocket'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectGameStatus } from '../game/gameSlice';

const HostGameOptionsButtons: React.FC = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const history = useHistory();
    const gameStatus = useAppSelector(selectGameStatus);
    const { setShouldBlock } = useSocket()

    const isPostGame = gameStatus === 'postGame';

    const confEndGame = () => {
        if (location.pathname.includes('/game/')) {
            history.push('/')
        } if (!isPostGame) {
            setShouldBlock(false);
            dispatch(setFullModal('confirmEndGame'))
        } else {
            history.push('/')
        }

    }
    return (
        <div className="flex flex-col gap-4 px-6 mb-6">
            {!isPostGame && <Button type="button" onClick={() => dispatch(setFullModal('removePlayers'))} buttonStyle="big-text" $secondary>Remove Player(s)</Button>}
            <Button type="button" onClick={confEndGame} buttonStyle="big-text" $secondary>{!isPostGame ? 'End Game' : 'Leave Game'}</Button>
        </div>
    )
}

export default HostGameOptionsButtons;
