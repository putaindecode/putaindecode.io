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
