import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Deck, UserGameStatus, PlayerRef } from '@whosaidtrue/app-interfaces';
import { api } from '../../api';

// local imports
import { RootState } from "../../app/store";

export interface GameState {
    status: UserGameStatus;
    hasPassed: boolean;
    gameToken: string,
    game_id: number;
    deck: Deck;
    totalQuestions: number;
    isHost: boolean;
    currentHostName: string;
    players: PlayerRef[];
    access_code: string;
    playerId: number;
    playerName: string;

}

export const initialState: GameState = {
    status: 'notInGame',
    gameToken: '',
    hasPassed: false,
    game_id: 0,
    deck: {
        id: 0,
        name: '',
        sort_order: 0,
        clean: false,
        age_rating: 0,
        status: 'active',
        description: '',
        movie_rating: 'PG',
        sfw: true,
        thumbnail_url: '',
        purchase_price: ''
    },
    totalQuestions: 0,
    isHost: false,
    access_code: '',
    players: [],
    currentHostName: '',
    playerName: '',
    playerId: 0
}

export const sendEndGameSignal = createAsyncThunk(
    'game/sendEndGameSignal',
    async (_, thunkApi) => {
        // TODO: finish
        console.log('game over')
    }
)

export const sendRemovePlayerSignal = createAsyncThunk(
    'game/sendRemovePlayerSignal',
    async (playerId: number, thunkApi) => {
        // TODO: finish
        console.log(`kick player: ${playerId}`)
    }
)

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        clearGame: () => {
            return initialState
        },
        setGameStatus: (state, action) => {
            state.status = action.payload;
        },
        setGameDeck: (state, action) => {
            state.deck = action.payload
        },
        setPlayerName: (state, action) => {
            state.playerName = action.payload;
        },

        initialRequest: (state, action) => {
            state.access_code = action.payload;
            state.status = 'choosingName' as UserGameStatus;
        },
        addPlayer: (state, action) => {
            state.players = [...state.players, action.payload];
        },
        removePlayer: (state, action) => {
            state.players = state.players.filter(p => p.id !== action.payload)
        },
        createGame: (state, action) => {
            state.access_code = action.payload.access_code
            state.game_id = action.payload.game_id
            state.isHost = true
            state.status = 'gameCreateSuccess'
        },
        joinGame: (state, action) => {
            const {
                status,
                game_id,
                deck,
                totalQuestions,
                currentHostName,
                players,
                access_code,
                playerId,
                player_name,
                gameToken
            } = action.payload;

            state.status = status;
            state.gameToken = gameToken;
            state.game_id = game_id;
            state.deck = deck;
            state.totalQuestions = totalQuestions;
            state.currentHostName = currentHostName;
            state.players = players;
            state.access_code = access_code;
            state.playerId = playerId;
            state.playerName = player_name
        }
    }
})

export const {
    setPlayerName,
    initialRequest,
    setGameStatus,
    clearGame,
    setGameDeck,
    createGame,
    addPlayer,
    removePlayer,
    joinGame
} = gameSlice.actions;

// selectors
export const selectPlayerName = (state: RootState) => state.game.playerName;
export const selectIsHost = (state: RootState) => state.game.isHost;
export const selectGameId = (state: RootState) => state.game.game_id;
export const selectGameToken = (state: RootState) => state.game.gameToken;
export const selectGameStatus = (state: RootState) => state.game.status;
export const selectAccessCode = (state: RootState) => state.game.access_code;
export const selectGameDeck = (state: RootState) => state.game.deck;
export const selectPlayers = (state: RootState) => state.game.players;

export default gameSlice.reducer;
