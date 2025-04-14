import { createElementObserver } from "./utils/elementObserver";
import { modifyItems } from "./elementSelectors/home";

enum CursorInput {
  left = "ArrowLeft",
  right = "ArrowRight",
  up = "ArrowUp",
  down = "ArrowDown",
  select = "Enter"
}

createElementObserver(modifyItems.gridContent, (grid) => {
  console.log("creating element observer for grid content");

  let selectedItemIndex: number;
  let selectedItem: Element;

  const arrowRightHandler = () => {
    const nextSelectedItemIndex = selectedItemIndex + 1;
    const nextSelectedItem = grid.children.item(nextSelectedItemIndex) ?? selectedItem;
    if (
      !nextSelectedItem.classList.contains("YTBP_hidden")
      && nextSelectedItem.getAttribute("is-in-first-column") === null
    ) {
      selectedItemIndex = nextSelectedItemIndex;
    }
    selectedItem = grid.children.item(selectedItemIndex) ?? selectedItem;
  };

  const arrowLeftHandler = (firstItemIndex: number) => {
    const prevSelectedItemIndex = (selectedItemIndex > firstItemIndex)
      ? selectedItemIndex - 1
      : selectedItemIndex;
    const prevSelectedItem = grid.children.item(prevSelectedItemIndex) ?? selectedItem;
    if (
      !prevSelectedItem.classList.contains("YTBP_hidden")
      && selectedItem.getAttribute("is-in-first-column") === null
    ) {
      selectedItemIndex = prevSelectedItemIndex;
      selectedItem = grid.children.item(selectedItemIndex) ?? selectedItem;
    }
  };

  const arrowUpHandler = (firstItemIndex: number, itemsPerRow: number) => {
    let targetSelectedItemIndex = (selectedItemIndex - itemsPerRow >= firstItemIndex)
      ? selectedItemIndex - itemsPerRow
      : selectedItemIndex;

    let currentMovingItemIndex = selectedItemIndex;

    while (currentMovingItemIndex != targetSelectedItemIndex) {
      const currentMovingItem = grid.children.item(currentMovingItemIndex - 1) ?? selectedItem;
      if (currentMovingItem.classList.contains("YTBP_hidden")) {
        targetSelectedItemIndex--;
      }
      currentMovingItemIndex--;
    }
    selectedItemIndex = targetSelectedItemIndex;
    selectedItem = grid.children.item(selectedItemIndex) ?? selectedItem;
  };

  const arrowDownHandler = (itemsPerRow: number) => {
    let targetSelectedItemIndex = selectedItemIndex + itemsPerRow;
    let currentMovingItemIndex = selectedItemIndex;

    while (currentMovingItemIndex != targetSelectedItemIndex) {
      const currentMovingItem = grid.children.item(currentMovingItemIndex + 1) ?? selectedItem;
      if (currentMovingItem.classList.contains("YTBP_hidden")) {
        targetSelectedItemIndex++;
      }
      currentMovingItemIndex++;
    }
    selectedItemIndex = Math.min(targetSelectedItemIndex, grid.children.length - 1);
    selectedItem = grid.children.item(selectedItemIndex) ?? selectedItem;
  };

  const enterHandler = () => {
    const clickableElement = selectedItem.querySelector("#details");
    console.log(`detected enter on element ${clickableElement?.tagName ?? ""}`);
    (clickableElement as HTMLElement).dispatchEvent(new Event("click"));
  };

  const firstItem = grid.querySelector(modifyItems.videoItemGeneric);
  if (firstItem) {
    console.log("found grid items");
    const itemsPerRow = parseInt(firstItem.getAttribute("items-per-row") ?? "");

    if (!itemsPerRow) {
      throw new Error("Could not get items per row value");
    }

    firstItem.classList.add("YTBP_selected");

    let firstItemIndex = 0;
    let child: Element | null = firstItem;
    while ((child = child.previousElementSibling) != null) {
      firstItemIndex++;
    }

    selectedItemIndex = firstItemIndex;
    selectedItem = firstItem;

    const getCallback = (key: CursorInput) => {
      const callback = {
        ArrowRight: arrowRightHandler,
        ArrowLeft: () => {
          arrowLeftHandler(firstItemIndex);
        },
        ArrowUp: () => {
          arrowUpHandler(firstItemIndex, itemsPerRow);
        },
        ArrowDown: () => {
          arrowDownHandler(itemsPerRow);
        },
        Enter: enterHandler
      }[ key ];

      return callback;
    };

    const moveCursor = (input: CursorInput) => {
      const callback = getCallback(input);

      selectedItem.classList.remove("YTBP_selected");

      callback();

      selectedItem.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      selectedItem.classList.add("YTBP_selected");
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
