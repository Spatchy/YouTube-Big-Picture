import { modifyItems, removeItems } from "./elementSelectors/home";

const activeObservers: MutationObserver[] = [];

function createElementObserver(selector: string, callback: (element: Element) => void, timeoutInMs = 10000) {
  const elements = document.querySelectorAll(selector);
  [ ...elements ].forEach((element) => {
    callback(element);
  });

  const observer = new MutationObserver(() => {
    const elements = document.querySelectorAll(selector);
    [ ...elements ].forEach((element) => {
      callback(element);
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  activeObservers.push(observer);

  // Safety timeout to prevent potential memory leaks
  setTimeout(() => {
    const index = activeObservers.indexOf(observer);
    if (index > -1) {
      observer.disconnect();
      activeObservers.splice(index, 1);
    }
  }, timeoutInMs);

  return observer;
}

// Function to monitor URL changes
function monitorPageChanges() {
  let lastUrl = location.href;

  // Create an observer that watches for URL changes
  const urlObserver = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      console.log("YouTube page navigation detected:", lastUrl);

      cleanupObservers();
      initializeElementWatchers();
      forceSidebarCollapse();
    }
  });

  // Observe document for changes that might indicate navigation
  urlObserver.observe(document, {
    childList: true,
    subtree: true
  });

  // Also listen for YouTube's navigation events (which might not change the URL)
  document.addEventListener("yt-navigate-finish", () => {
    console.log("YouTube navigation event detected");

    cleanupObservers();
    initializeElementWatchers();
    forceSidebarCollapse();
  });
}

function cleanupObservers() {
  activeObservers.forEach((observer) => {
    observer.disconnect();
  });
  activeObservers.length = 0;
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

// Initialize watchers for all selectors we want to modify
function initializeElementWatchers() {
  Object.values(removeItems).forEach((sel) => {
    createElementObserver(sel, (element) => {
      if (!element.classList.contains("YTBP_hidden")) {
        element.classList.add("YTBP_hidden");
      }
    });
  });
}

monitorPageChanges();
initializeElementWatchers();
forceSidebarCollapse();
