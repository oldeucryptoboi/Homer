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

const checkboxes = document.querySelectorAll("input[data-key]");

// Load current settings into checkboxes
chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
  checkboxes.forEach((cb) => {
    cb.checked = settings[cb.dataset.key];
  });
});

// Save on toggle
checkboxes.forEach((cb) => {
  cb.addEventListener("change", () => {
    chrome.storage.sync.set({ [cb.dataset.key]: cb.checked });
  });
});
