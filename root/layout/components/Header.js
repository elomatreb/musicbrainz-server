/*
 * @flow strict
 * Copyright (C) 2015 MetaBrainz Foundation
 *
 * This file is part of MusicBrainz, the open internet music database,
 * and is licensed under the GPL version 2, or (at your option) any
 * later version: http://www.gnu.org/licenses/gpl-2.0.txt
 */

import * as React from 'react';

import {SanitizedCatalystContext} from '../../context.mjs';
import {capitalize} from '../../static/scripts/common/utility/strings.js';
import {returnToCurrentPage} from '../../utility/returnUri.js';
import manifest from '../../static/manifest.mjs';

import BottomMenu from './BottomMenu.js';
import HeaderLogo from './HeaderLogo.js';
import Search from './Search.js';
import TopMenu from './TopMenu.js';


function languageName(
  language: ?ServerLanguageT,
  selected: boolean,
) {
  if (!language) {
    return '';
  }

  const {
    id,
    native_language: nativeLanguage,
    native_territory: nativeTerritory,
  } = language;

  let text = `[${id}]`;

  if (nativeLanguage) {
    text = capitalize(nativeLanguage);

    if (nativeTerritory) {
      text += ' (' + capitalize(nativeTerritory) + ')';
    }
  }

  if (selected) {
    text += ' \u25be';
  }

  return text;
}

component LanguageLink(language: ServerLanguageT) {
  const $c = React.useContext(SanitizedCatalystContext);
  return (
    <a
      href={
        '/set-language/' + encodeURIComponent(language.name) +
        '?' + returnToCurrentPage($c)
      }
    >
      {languageName(language, false)}
    </a>
  );
}

component LanguageMenu(
  currentBCP47Language: string,
  serverLanguages: $ReadOnlyArray < ServerLanguageT >,
) {
  const $c = React.useContext(SanitizedCatalystContext);
  return (
    <ul class="menu language-menu">
      <li className="language-selector" tabIndex={-1}>
        <span className="menu-header">
          {languageName(
            serverLanguages.find(x => x.name === currentBCP47Language),
            true,
          )}
        </span>
        <ul>
          {serverLanguages.map(function (language, index) {
            let inner: React.MixedElement =
              <LanguageLink language={language} />;

            if (language.name === currentBCP47Language) {
              inner = <strong>{inner}</strong>;
            }

            return <li key={index}>{inner}</li>;
          })}
          <li>
            <a href={'/set-language/unset?' + returnToCurrentPage($c)}>
              {l('(reset language)')}
            </a>
          </li>
          <li className="separator">
            <a href="https://translations.metabrainz.org/projects/musicbrainz/">
              {l('Help translate')}
            </a>
          </li>
        </ul>
      </li>
    </ul>
  );
}

component Header() {
  const $c = React.useContext(SanitizedCatalystContext);
  const serverLanguages = $c.stash.server_languages;
  return (
    <div className="header">
      <div class="logo-container">
        <a href="/" title="MusicBrainz">
          <HeaderLogo />
        </a>
      </div>
      <TopMenu />
      <div class="search-container">
        <Search />
      </div>
      <BottomMenu />
      {serverLanguages && serverLanguages.length > 1 ? (
        <LanguageMenu
          currentBCP47Language={$c.stash.current_language.replace('_', '-')}
          serverLanguages={serverLanguages}
        />
      ) : null}
      {manifest('common/MB/Control/Menu', { async: true })}
    </div>
  );
}

export default Header;
