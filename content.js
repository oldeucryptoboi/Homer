(function () {
  "use strict";

  const STYLE_ID = "focus-yt-styles";

  const RULES = {
    hideShorts: [
      "ytd-rich-shelf-renderer[is-shorts] { display: none !important }",
      "ytd-reel-shelf-renderer { display: none !important }",
      "ytm-shorts-lockup-view-model { display: none !important }",
      "yt-lockup-view-model { display: none !important }",
      'ytd-guide-entry-renderer a[title="Shorts"] { display: none !important }',
      'ytd-mini-guide-entry-renderer a[title="Shorts"] { display: none !important }',
    ],
    hideSidebar: [
      "#secondary { display: none !important }",
      "ytd-watch-flexy[flexy] #primary { max-width: 100% !important }",
    ],
    hideTopics: [
      "ytd-feed-filter-chip-bar-renderer { display: none !important }",
    ],
    hideExplorePanels: [
      "ytd-chips-shelf-with-video-shelf-renderer { display: none !important }",
    ],
    hideGhostGrid: ["ytd-ghost-grid-renderer { display: none !important }"],
    hideEndCards: [
      ".ytp-ce-element { display: none !important }",
      ".ytp-endscreen-content { display: none !important }",
    ],
    hideComments: ["#comments { display: none !important }"],
  };

  const DEFAULT_SETTINGS = {
    hideShorts: true,
    hideSidebar: true,
    hideTopics: true,
    hideExplorePanels: true,
    hideGhostGrid: true,
    hideEndCards: false,
    hideComments: false,
    blockShortsPage: true,
  };

  function buildCSS(settings) {
    let css = "";
    for (const [key, rules] of Object.entries(RULES)) {
      if (settings[key]) {
        css += rules.join("\n") + "\n";
      }
    }
    return css;
  }

  function injectStyles(settings) {
    let el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement("style");
      el.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(el);
    }
    el.textContent = buildCSS(settings);
  }

  function blockShortsPage() {
    if (window.location.pathname.startsWith("/shorts")) {
      document.body.textContent = "";
      const msg = document.createElement("div");
      msg.style.cssText =
        "display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:system-ui;color:#888;gap:24px;";
      const title = document.createElement("div");
      title.style.cssText = "font-size:1.25rem;";
      title.textContent = "Shorts blocked by Focus for YouTube";
      const quote = document.createElement("div");
      quote.style.cssText =
        "font-size:0.9rem;font-style:italic;max-width:420px;text-align:center;color:#666;";
      quote.textContent =
        '\u201CIt\u2019s not easy to juggle a pregnant wife and a troubled child, but somehow I managed to fit in eight hours of TV a day.\u201D \u2014Homer Simpson';
      msg.appendChild(title);
      msg.appendChild(quote);
      document.body.appendChild(msg);
    }
  }

  function applySettings(settings) {
    injectStyles(settings);
    if (settings.blockShortsPage) {
      blockShortsPage();
    }
  }

  // Load settings and apply immediately
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    applySettings(settings);
  });

  // Re-apply on YouTube SPA navigation
  window.addEventListener("yt-navigate-finish", () => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
      applySettings(settings);
    });
  });

  // Listen for settings changes from popup
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync") {
      chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
        applySettings(settings);
      });
    }
  });
})();
