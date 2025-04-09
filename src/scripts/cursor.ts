import { createElementObserver } from "./utils/elementObserver";
import { modifyItems } from "./elementSelectors/home";

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
    selectedItemIndex = targetSelectedItemIndex;
    selectedItem = grid.children.item(selectedItemIndex) ?? selectedItem;
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

    document.addEventListener("keydown", (event) => {
      event.preventDefault();
      event.stopPropagation();

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
        }
      }[ event.key ];

      selectedItem.classList.remove("YTBP_selected");
      callback?.();
      selectedItem.classList.add("YTBP_selected");
    });
  }
});
