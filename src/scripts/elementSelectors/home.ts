const modifyItems = {
  gridContent: "div.ytd-rich-grid-renderer#contents",
  expandedGuide: "ytd-guide-renderer",
  miniGuide: "ytd-mini-guide-renderer",
  guideBtn: "yt-icon-button#guide-button",
  logoSvg: "yt-icon#logo-icon svg",
  videoItemGeneric: "ytd-rich-item-renderer"
};

const removeItems = {
  categories: "ytd-rich-grid-renderer.style-scope > div:nth-child(1)",
  voiceBtn: "[aria-label=\"Search with your voice\"]",
  createBtn: "[aria-label=\"Create\"]",
  notifsBtn: "[aria-label=\"Notifications\"]",
  perVideoMenus: "#details > #menu",
  nonVideoSections: "ytd-rich-section-renderer",
  nonVideoShelves: "ytd-rich-shelf-renderer",
  countryIndicator: "#country-code"
};

export {
  modifyItems,
  removeItems
};
