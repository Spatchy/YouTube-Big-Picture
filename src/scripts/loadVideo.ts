import { modifyItems } from "./elementSelectors/video";

function createLoadingBanner() {
  const banner = document.createElement("div");
  banner.id = "YTBP_loading_banner";
  banner.className = "YTBP_fullscreen_banner";

  const spinner = document.createElement("div");
  spinner.className = "YTBP_spinner";
  banner.appendChild(spinner);

  const loadingText = document.createElement("div");
  loadingText.className = "YTBP_loading_text";
  loadingText.textContent = "Loading video...";
  banner.appendChild(loadingText);

  document.body.appendChild(banner);
}

function removeLoadingBanner() {
  const banner = document.querySelector("#YTBP_loading_banner");
  banner?.remove();
}

function handleVideoPage() {
  if (!location.pathname.startsWith("/watch")) {
    removeLoadingBanner();

    return;
  }

  createLoadingBanner();

  function setupVideo(video: HTMLVideoElement) {
    if (video.readyState >= 1) {
      triggerFullscreen();
    } else {
      video.addEventListener("loadedmetadata", () => {
        triggerFullscreen();
      }, { once: true });
    }

    video.autoplay = true;

    if (video.paused) {
      const playPromise = video.play();

      playPromise.catch((error: unknown) => {
        console.log("Autoplay prevented:", error);
      });
    }
  }

  function triggerFullscreen() {
    const fullscreenButton: HTMLElement | null = document.querySelector(modifyItems.fullscreenBtn);
    if (fullscreenButton) {
      fullscreenButton.click();
      removeLoadingBanner();
    }
  }

  // Try to find the video element
  const maxAttempts = 20;
  let attempts = 0;

  function findAndSetupVideo() {
    const video = document.querySelector(modifyItems.video);
    if (video) {
      setupVideo(video as HTMLVideoElement);
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(findAndSetupVideo, 250);
    } else {
      console.log("Could not find video after maximum attempts");
      removeLoadingBanner();
    }
  }

  findAndSetupVideo();
}

function monitorYouTubeNavigation() {
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      console.log("URL changed - checking for video");
      handleVideoPage();
    }
  }).observe(document, { subtree: true,
    childList: true });
}

monitorYouTubeNavigation();
