const modifyItems = {
  gridOuter: "ytd-rich-grid-renderer.style-scope",
  gridContent: "div.ytd-rich-grid-renderer > #contents",
  expandedGuide: "ytd-guide-renderer",
  guideBtn: "#guide-button button, ytd-masthead button[aria-label*=\"Guide\"]"
};

const removeItems = {
  categories: "ytd-rich-grid-renderer.style-scope > div:nth-child(1)",
  voiceBtn: "[aria-label=\"Search with your voice\"]",
  createBtn: "[aria-label=\"Create\"]",
  notifsBtn: "[aria-label=\"Notifications\"]",
  perVideoMenus: "#details > #menu",
  nonVideoSections: "ytd-rich-section-renderer",
  nonVideoShelves: "ytd-rich-shelf-renderer"
};

export {
  modifyItems,
  removeItems
};
