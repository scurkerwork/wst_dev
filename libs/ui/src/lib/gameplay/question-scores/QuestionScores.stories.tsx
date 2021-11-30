import { ScoreboardEntry } from '@whosaidtrue/app-interfaces';
import QuestionResultsComponent from './QuestionScores';
import QuestionCard from '../QuestionCard';
import ScoreBoard from '../scoreboard/Scoreboard';

export default {
    component: QuestionResultsComponent,
    title: 'Gameplay/Question Scores'
}

const scores: ScoreboardEntry[] = [
    {
        rank: 1,
        score: 12000,
        player_name: 'Mystic racoon',
        rankDifference: 0
    },
    {
        rank: 2,
        score: 11000,
        player_name: 'Chuffed Caterpillarrrrrr',
        rankDifference: 2
    },
    {
        rank: 3,
        score: 10000,
        player_name: 'Massive Rodent',
        rankDifference: 0
    },
    {
        rank: 4,
        score: 9000,
        player_name: 'Psycho Giraffe',
        rankDifference: -2
    },
    {
        rank: 5,
        score: 8000,
        player_name: 'Angelic Nerd',
        rankDifference: 0
    }
]

export const WithoutTiedScores = () => (
    <QuestionCard totalQuestions={9} questionNumber={5} category="Entertainment">
        <QuestionResultsComponent hasGuessed={true} guess='4' correctAnswer='3' pointsEarned={1250}>
            <ScoreBoard currentPlayerScore={{ rank: 8, player_name: 'The Hammer', score: 7000, rankDifference: 0 }} scores={scores} />
        </QuestionResultsComponent>
    </QuestionCard>
)