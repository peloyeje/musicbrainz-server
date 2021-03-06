/*
 * @flow
 * Copyright (C) 2018 Shamroy Pellew
 *
 * This file is part of MusicBrainz, the open internet music database,
 * and is licensed under the GPL version 2, or (at your option) any
 * later version: http://www.gnu.org/licenses/gpl-2.0.txt
 */

import * as React from 'react';

import {CatalystContext} from '../context';
import Layout from '../layout';

type Props = {
  +children: React.Node,
  +title: string,
};

const StatusPage = ({title, children}: Props): React.MixedElement => (
  <CatalystContext.Consumer>
    {$c => (
      <Layout $c={$c} fullWidth title={title}>
        <h1>{title}</h1>
        {children}
      </Layout>
    )}
  </CatalystContext.Consumer>
);

export default StatusPage;
