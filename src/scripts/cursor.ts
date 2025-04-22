import { cleanupObservers, createElementObserver } from "./utils/elementObserver";
import { modifyItems } from "./elementSelectors/home";

enum CursorInput {
  left = "ArrowLeft",
  right = "ArrowRight",
  up = "ArrowUp",
  down = "ArrowDown",
  select = "Enter"
}

const SELECTED = "YTBP_selected";

function go() {
  return createElementObserver(modifyItems.gridContent, (grid) => {
    if (!grid.checkVisibility()) {
      return;
    }

    let selectedItem: Element;

    const arrowRightHandler = () => {
      selectedItem = selectedItem.nextElementSibling ?? selectedItem;
      if (!selectedItem.matches(modifyItems.videoItemGeneric)) {
        arrowRightHandler();
      }
    };

    const arrowLeftHandler = () => {
      selectedItem = selectedItem.previousElementSibling ?? selectedItem;
      if (!selectedItem.matches(modifyItems.videoItemGeneric)) {
        arrowLeftHandler();
      }
    };

    const arrowUpHandler = (itemsPerRow: number) => {
      for (let i = 0; i < itemsPerRow; i++) {
        arrowLeftHandler();
      }
    };

    const arrowDownHandler = (itemsPerRow: number) => {
      for (let i = 0; i < itemsPerRow; i++) {
        arrowRightHandler();
      }
    };

    const enterHandler = () => {
      const clickableElement = selectedItem.querySelector("#details");
      console.log(`detected enter on element ${clickableElement?.tagName ?? ""}`);
      (clickableElement as HTMLElement).dispatchEvent(new Event("click"));
    };

    const firstItem = grid.querySelector(modifyItems.videoItemGeneric);
    if (firstItem) {
      console.log("found grid items");
      const itemsPerRow = 3;

      selectedItem = grid.querySelector(`.${SELECTED}`) ?? firstItem;

      if (selectedItem === firstItem) {
        firstItem.classList.add(SELECTED);
      }

      const getCallback = (key: CursorInput) => {
        const callback = {
          ArrowRight: () => {
            arrowRightHandler();
          },
          ArrowLeft: () => {
            arrowLeftHandler();
          },
          ArrowUp: () => {
            arrowUpHandler(itemsPerRow);
          },
          ArrowDown: () => {
            arrowDownHandler(itemsPerRow);
          },
          Enter: enterHandler
        }[ key ];

        return callback;
      };

      const moveCursor = (input: CursorInput) => {
        if (!grid.checkVisibility()) {
          return;
        }

        selectedItem.classList.remove(SELECTED);

        const callback = getCallback(input);
        callback();

        selectedItem.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        selectedItem.classList.add(SELECTED);
      };

      window.addEventListener("keydown", (event) => {
        if (Object.values(CursorInput).includes(event.key as CursorInput)) {
          event.preventDefault();
          event.stopPropagation();

          moveCursor(event.key as CursorInput);
        }
      });

      window.addEventListener("YTBP_direction-input", (event: CustomEventInit<string>) => {
        if (event.detail) {
          moveCursor(event.detail as CursorInput);
        }
      });
    }
  });
}

function monitorYouTubeNavigation() {
  go();
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      console.log("URL changed - starting grid observer");
      cleanupObservers();
      go();
    }
  }).observe(document, { subtree: true,
    childList: true });
}


monitorYouTubeNavigation();
