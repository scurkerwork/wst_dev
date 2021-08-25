import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectPlayerName, selectAccessCode } from '../game/gameSlice';
import { Button } from '@whosaidtrue/ui';

// TODO: What does the game options button do?
const InGameNav: React.FC = () => {
    const name = useAppSelector(selectPlayerName);
    const accessCode = useAppSelector(selectAccessCode)

    // if there is a name, then shot it. Otherwise show the game code
    return (
        <>
            <h2 className="text-basic-black font-extrabold relative mx-auto text-2xl leading-tight">{name ? name : `Game Code: ${accessCode}`}</h2>
            <Button type="button" buttonStyle='small' $secondary >Game Options</Button>
        </>
    )
}

export default InGameNav;