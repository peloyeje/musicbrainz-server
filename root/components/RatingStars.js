/*
 * @flow
 * Copyright (C) 2017 MetaBrainz Foundation
 *
 * This file is part of MusicBrainz, the open internet music database,
 * and is licensed under the GPL version 2, or (at your option) any
 * later version: http://www.gnu.org/licenses/gpl-2.0.txt
 */

import * as React from 'react';

import {CatalystContext} from '../context';
import ratingTooltip from '../utility/ratingTooltip';

const ratingURL = (entity: RatableT, rating) => (
  '/rating/rate/?entity_type=' +
  encodeURIComponent(entity.entityType) +
  '&entity_id=' +
  encodeURIComponent(String(entity.id)) +
  '&rating=' +
  encodeURIComponent(String(rating * 20))
);

const ratingInts = [1, 2, 3, 4, 5];

type Props = {
  +entity: RatableT,
};

const RatingStars = ({entity}: Props): React.Element<'span'> => {
  const currentStarRating =
    entity.user_rating ? (5 * entity.user_rating / 100) : 0;

  return (
    <span className="inline-rating">
      <span className="star-rating" tabIndex="-1">
        {entity.user_rating ? (
          <span
            className="current-user-rating"
            style={{width: `${entity.user_rating}%`}}
          >
            {currentStarRating}
          </span>
        ) : (
          entity.rating ? (
            <span
              className="current-rating"
              style={{width: `${entity.rating}%`}}
            >
              {5 * entity.rating / 100}
            </span>
          ) : null
        )}

        <CatalystContext.Consumer>
          {$c => $c.user?.has_confirmed_email_address ? (
            ratingInts.map(rating => {
              const isCurrentRating = rating === currentStarRating;
              const newRating = isCurrentRating ? 0 : rating;

              return (
                <a
                  className={`stars-${rating} ${isCurrentRating
                    ? 'remove-rating'
                    : 'set-rating'}`}
                  href={ratingURL(entity, newRating)}
                  key={rating}
                  title={ratingTooltip(newRating)}
                >
                  {rating}
                </a>
              );
            })
          ) : null}
        </CatalystContext.Consumer>
      </span>
    </span>
  );
};

export default RatingStars;
