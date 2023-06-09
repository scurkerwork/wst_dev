import { useState } from 'react';
import { SubmitRating } from '@whosaidtrue/ui';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { UserRating } from '@whosaidtrue/app-interfaces';
import { selectGameToken } from '../game/gameSlice';
import { selectQuestionId } from '../question/questionSlice';
import { showSuccess, showError } from '../modal/modalSlice';
import { api } from '../../api';

const RateQuestion: React.FC = () => {
  const dispatch = useAppDispatch();
  const questionId = useAppSelector(selectQuestionId);
  const gameToken = useAppSelector(selectGameToken);
  const [hasRated, setHasRated] = useState(false);

  const submitHandler = (rating: UserRating) => {
    api
      .post(`ratings/question`, { gameToken, questionId, rating })
      .then((_) => {
        dispatch(showSuccess('Thanks for the feedback!'));
        setHasRated(true);
      })
      .catch((err) => {
        dispatch(showError('Oops, something went wrong...'));
      });
  };

  // Show question rating buttons. Hide after successful submission.
  return !hasRated ? (
    <SubmitRating submitRatingHandler={submitHandler} />
  ) : null;
};

export default RateQuestion;
