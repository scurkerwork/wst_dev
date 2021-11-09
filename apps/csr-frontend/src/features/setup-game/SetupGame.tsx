import { Title1, Button } from '@whosaidtrue/ui';
import React from 'react';
import { useHistory, Link } from 'react-router-dom';

const SetUpGame: React.FC = () => {
    const history = useHistory();

    const handler = () => {
        history.push('/decks')
    }
    // link is here in button so that web crawlers follow it and go to /decks
    return (
        <section className="text-center w-full self-stretch py-8 px-6 select-none">
            <Title1 className="mb-7">Host a Game</Title1>
            <div className="flex justify-center">
                <Button type="button" onClick={handler}><Link to="/decks">Get Started!</Link></Button>
            </div>
        </section>
    )
}

export default SetUpGame