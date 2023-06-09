import {
    FactsCarousel,
    MostSimilar,
    NoOneSimilar
} from '@whosaidtrue/ui';
import { useAppSelector } from "../../app/hooks";
import { selectSequenceIndex } from '../question/questionSlice';
import {
    selectMostSimilarPlayer
} from './funFactsSlice';

/**
 * Show player's "most similar to you" stat. Only on the results for the 4th question.
 *
 * If there is no most similar player, display the 'NoOneSimilar' component instead.
 */
const MostSimilarToYou: React.FC = () => {
    const sequenceIndex = useAppSelector(selectSequenceIndex);
    const mostSimilarToPlayer = useAppSelector(selectMostSimilarPlayer);
    const shouldShow = mostSimilarToPlayer.numSameAnswer;

    return (
        <FactsCarousel>
            {shouldShow ? <MostSimilar
                groupWide={false}
                totalQuestions={sequenceIndex}
                totalCommon={mostSimilarToPlayer.numSameAnswer}
                heading={mostSimilarToPlayer.name}
            /> : <NoOneSimilar />}

        </FactsCarousel>
    )
}

export default MostSimilarToYou;