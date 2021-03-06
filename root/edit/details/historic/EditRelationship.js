/*
 * @flow
 * Copyright (C) 2020 MetaBrainz Foundation
 *
 * This file is part of MusicBrainz, the open internet music database,
 * and is licensed under the GPL version 2, or (at your option) any
 * later version: http://www.gnu.org/licenses/gpl-2.0.txt
 */

import * as React from 'react';

import linkedEntities from '../../../static/scripts/common/linkedEntities';
import DescriptiveLink
  from '../../../static/scripts/common/components/DescriptiveLink';
import DiffSide from '../../../static/scripts/edit/components/edit/DiffSide';
import relationshipDateText from '../../../utility/relationshipDateText';
import {INSERT, DELETE} from '../../../static/scripts/edit/utility/editDiff';
import {interpolateText}
  from '../../../static/scripts/edit/utility/linkPhrase';

type EditRelationshipEditT = {
  ...EditT,
  +display_data: {
    +relationship: CompT<$ReadOnlyArray<RelationshipT>>,
  },
};

type Props = {
  +edit: EditRelationshipEditT,
};

const EditRelationship = ({edit}: Props): React.Element<'table'> => (
  <table className="details edit-relationship">
    <tr>
      <th rowSpan="2">{l('Old relationships:')}</th>
    </tr>
    <tr>
      <td>
        <ul>
          {edit.display_data.relationship.old.map((oldRel, index) => {
            const newRel = edit.display_data.relationship.new[index];
            const oldLinkType = linkedEntities.link_type[oldRel.linkTypeID];
            const newLinkType = linkedEntities.link_type[newRel.linkTypeID];
            const oldSource =
              linkedEntities[oldLinkType.type0][oldRel.entity0_id];
            const newSource =
              linkedEntities[newLinkType.type0][newRel.entity0_id];
            return (
              <li key={oldRel.id}>
                <span
                  className={oldSource.id === newSource.id
                    ? null
                    : 'diff-only-a'}
                >
                  <DescriptiveLink entity={oldSource} />
                </span>
                {' '}
                <DiffSide
                  filter={DELETE}
                  newText={interpolateText(
                    newRel,
                    'link_phrase',
                    false, /* forGrouping */
                  )}
                  oldText={interpolateText(
                    oldRel,
                    'link_phrase',
                    false, /* forGrouping */
                  )}
                  split="\s+"
                />
                {' '}
                <span
                  className={oldRel.target.id === newRel.target.id
                    ? null
                    : 'diff-only-a'}
                >
                  <DescriptiveLink entity={oldRel.target} />
                </span>
                {' '}
                <DiffSide
                  filter={DELETE}
                  newText={relationshipDateText(newRel)}
                  oldText={relationshipDateText(oldRel)}
                />
              </li>
            );
          })}
        </ul>
      </td>
    </tr>

    <tr>
      <th rowSpan="2">{l('New relationships:')}</th>
    </tr>
    <tr>
      <td>
        <ul>
          {edit.display_data.relationship.new.map((newRel, index) => {
            const oldRel = edit.display_data.relationship.old[index];
            const oldLinkType = linkedEntities.link_type[oldRel.linkTypeID];
            const newLinkType = linkedEntities.link_type[newRel.linkTypeID];
            const oldSource =
              linkedEntities[oldLinkType.type0][oldRel.entity0_id];
            const newSource =
              linkedEntities[newLinkType.type0][newRel.entity0_id];
            return (
              <li key={newRel.id}>
                <span
                  className={oldSource.id === newSource.id
                    ? null
                    : 'diff-only-b'}
                >
                  <DescriptiveLink entity={newSource} />
                </span>
                {' '}
                <DiffSide
                  filter={INSERT}
                  newText={interpolateText(
                    newRel,
                    'link_phrase',
                    false, /* forGrouping */
                  )}
                  oldText={interpolateText(
                    oldRel,
                    'link_phrase',
                    false, /* forGrouping */
                  )}
                  split="\s+"
                />
                {' '}
                <span
                  className={oldRel.target.id === newRel.target.id
                    ? null
                    : 'diff-only-b'}
                >
                  <DescriptiveLink entity={newRel.target} />
                </span>
                {' '}
                <DiffSide
                  filter={INSERT}
                  newText={relationshipDateText(newRel)}
                  oldText={relationshipDateText(oldRel)}
                />
              </li>
            );
          })}
        </ul>
      </td>
    </tr>
  </table>
);

export default EditRelationship;
