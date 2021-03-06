/*
 * @flow
 * Copyright (C) 2017 MetaBrainz Foundation
 *
 * This file is part of MusicBrainz, the open internet music database
 * and is licensed under the GPL version 2, or (at your option) any
 * later version: http://www.gnu.org/licenses/gpl-2.0.txt
 */

import URL from 'url';

import * as React from 'react';
import _ from 'lodash';

import EntityLink from '../../static/scripts/common/components/EntityLink';
import {FAVICON_CLASSES} from '../../static/scripts/common/constants';
import {compare, l} from '../../static/scripts/common/i18n';
import linkedEntities from '../../static/scripts/common/linkedEntities';

function faviconClass(urlEntity) {
  let matchingClass;
  const urlObject = URL.parse(urlEntity.name, false, true);

  for (const key in FAVICON_CLASSES) {
    if ((key.indexOf('/') >= 0 && urlEntity.name.indexOf(key) >= 0) ||
        (urlObject.host?.indexOf(key) ?? -1) >= 0) {
      matchingClass = FAVICON_CLASSES[key];
      break;
    }
  }

  return (matchingClass || 'no') + '-favicon';
}

type ExternalLinkProps = {
  +className?: string,
  +editsPending: boolean,
  +text?: string,
  +url: UrlT,
};

const ExternalLink = ({
  className,
  editsPending,
  text,
  url,
}: ExternalLinkProps) => {
  let element = <a href={url.href_url}>{text || url.sidebar_name}</a>;

  if (editsPending) {
    element = <span className="mp mp-rel">{element}</span>;
  }

  if (url.editsPending) {
    element = <span className="mp">{element}</span>;
  }

  return (
    <li className={className || faviconClass(url)}>
      {element}
    </li>
  );
};

type Props = {
  empty: boolean,
  entity: CoreEntityT,
  heading?: string,
};

const ExternalLinks = ({
  entity,
  empty,
  heading,
}: Props): React.MixedElement | null => {
  const relationships = entity.relationships;
  if (!relationships) {
    return null;
  }

  const links = [];
  const blogLinks = [];
  const otherLinks: Array<{
    +editsPending: boolean,
    +id: number,
    +url: UrlT,
  }> = [];

  for (let i = 0; i < relationships.length; i++) {
    const relationship = relationships[i];
    const target = relationship.target;

    if (relationship.ended || target.entityType !== 'url') {
      continue;
    }

    const linkType =
      linkedEntities.link_type[relationship.linkTypeID];
    if (/^official (?:homepage|site)$/.test(linkType.name)) {
      links.push(
        <ExternalLink
          className="home-favicon"
          editsPending={relationship.editsPending}
          key={relationship.id}
          text={l('Official homepage')}
          url={target}
        />,
      );
    } else if (/^blog$/.test(linkType.name)) {
      blogLinks.push(
        <ExternalLink
          className="blog-favicon"
          editsPending={relationship.editsPending}
          key={relationship.id}
          text={l('Blog')}
          url={target}
        />,
      );
    } else if (target.show_in_external_links) {
      otherLinks.push({
        editsPending: relationship.editsPending,
        id: relationship.id,
        url: target,
      });
    }
  }

  if (!(links.length || blogLinks.length || otherLinks.length)) {
    return null;
  }

  otherLinks.sort(function (a, b) {
    return (
      compare(
        a.url.sidebar_name ?? '',
        b.url.sidebar_name ?? '',
      ) ||
      compare(a.url.href_url, b.url.href_url)
    );
  });

  const uniqueOtherLinks = _.sortedUniqBy(otherLinks, x => x.url.href_url);

  // We ensure official sites are listed above blogs, and blogs above others
  links.push.apply(links, blogLinks);
  links.push.apply(links, uniqueOtherLinks.map(({id, ...props}) => (
    <ExternalLink key={id} {...props} />
  )));

  const entityType = entity.entityType;

  return (
    <>
      <h2 className="external-links">
        {heading || l('External links')}
      </h2>
      <ul className="external_links">
        {links}
        {(empty && (entityType === 'artist' || entityType === 'label')) ? (
          <li className="all-relationships">
            <EntityLink
              content={l('View all relationships')}
              entity={entity}
              subPath="relationships"
            />
          </li>
        ) : null}
      </ul>
    </>
  );
};

export default ExternalLinks;
