import { modifyItems, removeItems } from "./elementSelectors/home";
import wordmark from "../assets/Wordmark Logo.svg";
import { createElementObserver, cleanupObservers } from "./utils/elementObserver";

// Monitor navigation changes
function monitorPageChanges() {
  let lastUrl = location.href;

  const urlObserver = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      console.log("YouTube page navigation detected:", lastUrl);

      cleanupObservers();
      initializeElementWatchers();
      forceSidebarCollapse();
    }
  });

  urlObserver.observe(document, {
    childList: true,
    subtree: true
  });

  document.addEventListener("yt-navigate-finish", () => {
    console.log("YouTube navigation event detected");

    cleanupObservers();
    initializeElementWatchers();
    forceSidebarCollapse();
  });
}

function forceSidebarCollapse() {
  const expandedGuide = document.querySelector(modifyItems.expandedGuide);
  if (expandedGuide && window.getComputedStyle(expandedGuide).display !== "none") {
    const guideButton = document.querySelector(modifyItems.guideBtn);
    (guideButton as HTMLElement).click();
  }


  createElementObserver(modifyItems.guideBtn, (element) => {
    if (!element.classList.contains("YTBP_hidden")) {
      element.classList.add("YTBP_hidden");
    }
  });
}

function initializeElementWatchers() {
  Object.values(removeItems).forEach((sel) => {
    createElementObserver(sel, (element) => {
      if (!element.classList.contains("YTBP_hidden")) {
        element.classList.add("YTBP_hidden");
      }
    });
  });

  createElementObserver(modifyItems.logoSvg, (element) => {
    const replacement = new Image();
    replacement.src = wordmark;
    replacement.classList.add("YTBP_wordmark");
    element.replaceWith(replacement);
  });
}

monitorPageChanges();
initializeElementWatchers();
forceSidebarCollapse();
