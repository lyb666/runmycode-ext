'use strict';

((window, document) => {
  const rmc = window.runmycode
  const $ = rmc.$
  const $$ = rmc.$$
  const buildDomElement = rmc.buildDomElement
  const getLangFromFileName = rmc.getLangFromFileName
  const langExtMap = rmc.langExtMap
  const getJavaPublicClassFileName = rmc.getJavaPublicClassFileName
  let xlang, lang

  // platform name should match whatever is defined in locationMap in common-utils.js
  rmc.platforms.xahlee = {}
  const xahlee = rmc.platforms.xahlee

  xahlee.languages = {
    python: 'python',
    python3: 'python3',
    ruby: 'ruby',
    php: 'php',
    java: 'java',
    golang: 'go'
  }

  xahlee.getPage = () => {
    const langSelector = 'pre.' + Object.keys(xahlee.languages).join(',pre.')
    if ($(langSelector)) return 'show' // if any of the supported languages exist on page
  }

  const getFileName = (codeContainer, pageLang) => {
    if (pageLang === 'java') {
      const fname = getJavaPublicClassFileName(codeContainer.textContent)
      if (fname) return fname
    }
    // if not Java, or everything else failed, return default filename
    return pageLang + '.' + langExtMap[pageLang]
  }

  const injectRunButton = (btnContainer, fileName) => {
    if (btnContainer.nextElementSibling.classList && btnContainer.nextElementSibling.classList.contains('runmycode-popup-runner')) return
    // insert after the pre node
    btnContainer.parentNode.insertBefore(
      buildDomElement(
        ['a',
          {
            'class': 'runmycode-popup-runner',
            'style': 'padding: .5rem; margin: .5rem; border: solid thin grey; border-radius: 0.5rem; background-color: pink; cursor: pointer; width: 150px; text-align: center;',
            'data-filename': fileName,
            'data-lang': getLangFromFileName(fileName)
          },
          '▶ Run'
        ]
      ),
      btnContainer.nextElementSibling
    )
  }

  xahlee.pages = {}
  xahlee.pages.show = {
    // run button is added just after the pre for code
    getCodeContainer: (openRunnerBtn) => openRunnerBtn.previousElementSibling,
    hasSupportedLang: () => true, // always true for show page
    injectRunButtons: () => {
      $$('pre').forEach((codeContainer) => {
        xlang = codeContainer.classList[0]
        lang = xahlee.languages[xlang]
        if (!lang) return
        injectRunButton(codeContainer, getFileName(codeContainer, lang))
      })
    },
    getCode: (codeContainer) => codeContainer.textContent
  }
})(window, document)
