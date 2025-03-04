import {
  LOG_PREFIX,
  MEDIA_CONSTRUCTORS_REGEX,
  SELECTORS,
  TWITTER_TIMELINE_PATH,
} from "./consts.js";

type EventListenerCallback = (this: Document, ev: Event) => any;

const tweetContainsMedia = (tweet: Element): Boolean => {
  for (let i = 0; i < tweet.childNodes.length; i++) {
    const child = tweet.children[i];
    if (!child) break;

    const childConstructor = child.constructor.name;
    if (childConstructor.match(MEDIA_CONSTRUCTORS_REGEX)) {
      if (childConstructor === "HTMLImageElement") {
        return (child as HTMLImageElement).src.toLowerCase().includes("media");
      }
      return true;
    } else if (tweetContainsMedia(child)) {
      return true;
    }
  }
  return false;
};

const findTweetContainer = (
  tweet: Element | HTMLElement,
  timelineContainerChildren: HTMLCollection | Element[]
): HTMLElement | void => {
  const parent = tweet.parentElement;
  if (!parent) return;

  for (let i = 0; i < timelineContainerChildren.length; i++) {
    if (parent.parentElement == timelineContainerChildren[i]) {
      return parent;
    }
  }

  return findTweetContainer(parent, timelineContainerChildren);
};

const onTimelinePage = (url: string) => {
  return (
    url.endsWith(TWITTER_TIMELINE_PATH) ||
    url.endsWith(TWITTER_TIMELINE_PATH + "/")
  );
};

const hideNonMediaTweetsFromDom = () => {
  if (!onTimelinePage(location.href)) return;

  // find the timeline container and it's immediate children (if any)
  // so that we know where to stop when looking for tweet containers
  const timelineContainer = document.querySelector(SELECTORS.timelineContainer);
  if (!timelineContainer) {
    console.error(
      `${LOG_PREFIX} Fatal: Could not find the timeline container using selector ${SELECTORS.timelineContainer}`
    );
    return;
  }

  const timelineContainerChildren = timelineContainer?.children.length
    ? timelineContainer.children
    : [timelineContainer];
  const tweets = document.querySelectorAll(SELECTORS.tweet);
  let removedTweetCount = 0;

  tweets.forEach(tweet => {
    if (tweetContainsMedia(tweet)) return;

    const tweetContainer = findTweetContainer(tweet, timelineContainerChildren);

    // set display to none instead of removing to avoid lazy load errors
    if (tweetContainer && tweetContainer.style.display !== "none") {
      removedTweetCount++;
      tweetContainer.style.display = "none";
    }
  });

  if (removedTweetCount > 0) {
    const pluralizedTweet = removedTweetCount === 1 ? "tweet" : "tweets";
    console.log(
      `${LOG_PREFIX}: Hid ${removedTweetCount} ${pluralizedTweet} from your timeline.`
    );
  }
};

const waitForElement = (selector: string) => {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(_mutations => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};

const throttle = (func: Function, timeFrame: number): EventListenerCallback => {
  var lastCalledAt = 0;
  return function () {
    const now = Date.now();

    if (timeFrame < now - lastCalledAt) {
      func();
      lastCalledAt = now;
    }
  };
};

// content script
export const init = async () => {
  const throttledHideNonMediaTweetsFromDom = throttle(
    hideNonMediaTweetsFromDom,
    500
  );

  const removeScrollListener = () => {
    document.removeEventListener("scroll", throttledHideNonMediaTweetsFromDom);
  };
  const addScrollListener = () => {
    removeScrollListener();
    document.addEventListener("scroll", throttledHideNonMediaTweetsFromDom);
  };
  const updateNavText = () => {
    const navLink = document.querySelector(SELECTORS.homeNavLink);
    const navText = navLink?.querySelector("span");

    // hidden on smaller screens
    if (navText?.innerText) navText.innerText = "Media Timeline";
  };
  const addExtensionIndicators = () => {
    if (!onTimelinePage(location.href)) return updateNavText();

    if (document.title.includes("Home")) {
      document.title = document.title.replace("Home", "Media Timeline");
      updateNavText();
    } else {
      setTimeout(addExtensionIndicators, 250);
    }
  };
  const run = () => {
    hideNonMediaTweetsFromDom();
    addExtensionIndicators();
    addScrollListener();
  };

  // run once tweets have loaded
  await waitForElement(SELECTORS.tweet);
  run();

  // listen for path changes to run and remove scroll listener appropriately
  document.body.addEventListener(
    "click",
    () => {
      requestAnimationFrame(() => {
        if (onTimelinePage(location.href)) {
          run();
        } else {
          removeScrollListener();
        }
      });
    },
    true
  );
};
