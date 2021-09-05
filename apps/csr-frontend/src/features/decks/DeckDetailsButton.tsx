import { Deck } from '@whosaidtrue/app-interfaces'
import { Button } from '@whosaidtrue/ui';
import { api } from '../../api'
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { isLoggedIn, selectIsGuest } from '../auth/authSlice';
import { createGame, setGameStatus, setGameDeck } from '../game/gameSlice';
import { setFullModal } from '../modal/modalSlice';
import { addToCart } from '../cart/cartSlice';
import { clearSelectedDeck } from '..';
import { useHistory } from 'react-router';
import { CreateGameRequest, CreateGameResponse } from '@whosaidtrue/api-interfaces';

export interface DeckDetailsButtonProps {
    deck: Deck;
    isOwned: boolean;
}

const DeckDetailsButton: React.FC<DeckDetailsButtonProps> = ({ isOwned, deck }) => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const loggedIn = useAppSelector(isLoggedIn)
    const isGuest = useAppSelector(selectIsGuest);
    const buttonText = isOwned ? 'Play Deck' : deck.purchase_price

    // add to cart before opening log in so
    // that user can go straight to checkout after logging in
    const addToCartThenGoToAuth = () => {
        dispatch(addToCart(deck))
        dispatch(setFullModal('login'))
    }

    const addToCartThenGoToCheckout = () => {
        // open redirect modal if guest
        // this prevents guest users from buying
        // decks if they ever go here.
        if (isGuest) {
            dispatch(clearSelectedDeck())
            dispatch(setFullModal('guestAccountRedirect'))
        } else {
            // go to cart if signed in and not guest
            dispatch(addToCart(deck))
            dispatch(setFullModal("choosePaymentMethod"))
        }
    }

    // set deck, send create request
    const initializeGameCreate = async () => {
        try {
            const response = await api.post<CreateGameResponse>('/games/create', { deckId: deck.id } as CreateGameRequest)
            dispatch(createGame(response.data))
            dispatch(setGameStatus('gameCreateSuccess'))
            dispatch(setGameDeck(deck))
            history.push(`/game/invite`)
        } catch (e) {
            // TODO: add error message modal
            console.error(e)
            dispatch(setGameStatus('gameCreateError'))
            history.push('/')
        }
    }

    let handler: (e: React.MouseEvent) => void;
    if (isOwned) {
        handler = () => {
            // if user is logged in and deck is owned or free, create game, else send to auth
            loggedIn ? initializeGameCreate() : dispatch(setFullModal('preGameAuth'))
        }
    } else {
        handler = () => {
            loggedIn ? addToCartThenGoToCheckout() : addToCartThenGoToAuth()
        }
    }
    return (
        loggedIn ? <Button type="button" onClick={handler}>{buttonText}</Button> : <Button type="button" onClick={handler}>{buttonText}</Button>
    )

}

export default DeckDetailsButton;