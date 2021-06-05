Emotion.injectGlobal(
  `
  :root {
    --page-background-color: #fff;
    --page-slightly-accented-background-color: #F9F6F6;
    --page-accented-background-color: #E4EBEE;
    --page-text-color: #46515B;
    --link-text-color: #E51D58;
    --gradient-red-top: #E51D58;
    --gradient-red-bottom: #CC0613;
    --code-background-color: #FAF3E1;
    --one-percent-contrast-color: rgba(0, 0, 0, 0.1);
    --half-percent-contrast-color: rgba(0, 0, 0, 0.05);
  }


  @media (prefers-color-scheme: dark) {
    :root {
      --page-background-color: #222;
      --page-slightly-accented-background-color: #171717;
      --page-accented-background-color: #111;
      --page-text-color: #ddd;
      --link-text-color: #F87098;
      --gradient-red-top: #E51D58;
      --gradient-red-bottom: #CC0613;
      --code-background-color: #4F3804;
      --one-percent-contrast-color: rgba(255, 255, 255, 0.1);
      --half-percent-contrast-color: rgba(255, 255, 255, 0.05);
    }
  }

  body {
    padding: 0;
    margin: 0;
    background-color: var(--page-background-color);
    color: var(--page-text-color);
    font-family: ${Theme.defaultTextFontFamily};
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow-x: hidden;
  }

  html {
    font-size: 1em;
    line-height: 1.4;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: 100%;
  }

  a {
    color: var(--link-text-color);
    text-decoration: underline;
  }

  a:hover {
    text-decoration: none;
  }

  #root {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex-grow: 1;
  }

  *, *:before, *:after {
    box-sizing: border-box;
  }
`,
)

Emotion.injectGlobal(`pre, .hljs {
  color: #adbac7;
  background: #22272e;
}

.hljs-doctag,
.hljs-keyword,
.hljs-meta .hljs-keyword,
.hljs-template-tag,
.hljs-template-variable,
.hljs-type,
.hljs-variable.language_ {
  /* prettylights-syntax-keyword */
  color: #f47067;
}

.hljs-title,
.hljs-title.class_,
.hljs-title.class_.inherited__,
.hljs-title.function_ {
  /* prettylights-syntax-entity */
  color: #dcbdfb;
}

.hljs-attr,
.hljs-attribute,
.hljs-literal,
.hljs-meta,
.hljs-number,
.hljs-operator,
.hljs-variable,
.hljs-selector-attr,
.hljs-selector-class,
.hljs-selector-id {
  /* prettylights-syntax-constant */
  color: #6cb6ff;
}

.hljs-regexp,
.hljs-string,
.hljs-meta .hljs-string {
  /* prettylights-syntax-string */
  color: #96d0ff;
}

.hljs-built_in,
.hljs-symbol {
  /* prettylights-syntax-variable */
  color: #f69d50;
}

.hljs-comment,
.hljs-code,
.hljs-formula {
  /* prettylights-syntax-comment */
  color: #768390;
}

.hljs-name,
.hljs-quote,
.hljs-selector-tag,
.hljs-selector-pseudo {
  /* prettylights-syntax-entity-tag */
  color: #8ddb8c;
}

.hljs-subst {
  /* prettylights-syntax-storage-modifier-import */
  color: #adbac7;
}

.hljs-section {
  /* prettylights-syntax-markup-heading */
  color: #316dca;
  font-weight: bold;
}

.hljs-bullet {
  /* prettylights-syntax-markup-list */
  color: #eac55f;
}

.hljs-emphasis {
  /* prettylights-syntax-markup-italic */
  color: #adbac7;
  font-style: italic;
}

.hljs-strong {
  /* prettylights-syntax-markup-bold */
  color: #adbac7;
  font-weight: bold;
}

.hljs-addition {
  /* prettylights-syntax-markup-inserted */
  color: #b4f1b4;
  background-color: #1b4721;
}

.hljs-deletion {
  /* prettylights-syntax-markup-deleted */
  color: #ffd8d3;
  background-color: #78191b;
}

.hljs-char.escape_,
.hljs-link,
.hljs-params,
.hljs-property,
.hljs-punctuation,
.hljs-tag {
  /* purposely ignored */
}`)
