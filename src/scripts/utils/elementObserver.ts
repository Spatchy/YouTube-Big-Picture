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

function cleanupObservers() {
  activeObservers.forEach((observer) => {
    observer.disconnect();
  });
  activeObservers.length = 0;
}

export {
  createElementObserver,
  cleanupObservers
};
