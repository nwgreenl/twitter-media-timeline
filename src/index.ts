type EventListenerCallback = (this: Document, ev: Event) => any;

const APP_NAME = 'Twitter Media Timeline';
const TWITTER_TIMELINE_PATH = '/home';
const SELECTORS = {
  timelineContainer: 'div[aria-label*="Timeline"]',
  tweet: 'div[data-testid="tweet"]',
};
const MEDIA_CONSTRUCTORS = ['HTMLImageElement', 'HTMLVideoElement'];
const MEDIA_CONSTRUCTORS_REGEX = new RegExp(MEDIA_CONSTRUCTORS.join('|'), 'i');

// dfs helpers
const tweetContainsMedia = (tweet: Element): Boolean => {
  for (let i = 0; i < tweet.childNodes.length; i++) {
    let child = tweet.children[i];
    if (!child) break;

    const childConstructor = child.constructor.name;

    if (childConstructor.match(MEDIA_CONSTRUCTORS_REGEX)) {
      if (childConstructor === 'HTMLImageElement') {
        return (child as HTMLImageElement).src.toLowerCase().includes('media');
      }
      return true;
    } else if (tweetContainsMedia(child)) return true;
  }

  return false;
};

const findTweetContainer = (
  tweet: Element | HTMLElement,
  timelineContainerChildren: HTMLCollection | Element[]
): HTMLElement | void => {
  let parent = tweet.parentElement;

  if (!parent) return;

  for (let i = 0; i < timelineContainerChildren.length; i++) {
    if (parent.parentElement == timelineContainerChildren[i]) {
      return parent;
    }
  }

  return findTweetContainer(parent, timelineContainerChildren);
};

// path helper
const onTimelinePage = (path: string) => {
  return path.endsWith(TWITTER_TIMELINE_PATH);
};

// main
const hideNonMediaTweetsFromDom = () => {
  if (!onTimelinePage(location.pathname)) return;

  // find the timeline container and it's immediate children (if any)
  // so that we know where to stop when looking for tweet containers
  const timelineContainer = document.querySelector(SELECTORS.timelineContainer);

  if (!timelineContainer) {
    console.error(
      `[${APP_NAME}] Fatal: Could not find the timeline container using selector ${SELECTORS.timelineContainer}`
    );
    return;
  }

  const timelineContainerChildren = timelineContainer?.children.length
    ? timelineContainer?.children
    : [timelineContainer];
  const tweets = document.querySelectorAll(SELECTORS.tweet);

  let removedTweetCount = 0;

  tweets.forEach(tweet => {
    if (tweetContainsMedia(tweet)) return;

    const tweetContainer = findTweetContainer(tweet, timelineContainerChildren);

    // set display to none instead of removing to avoid lazy load errors
    if (tweetContainer && tweetContainer.style.display !== 'none') {
      removedTweetCount++;
      tweetContainer.style.display = 'none';
    }
  });

  if (removedTweetCount) {
    const pluralizedDebugStr = `${removedTweetCount} ${
      removedTweetCount === 1 ? 'tweet' : 'tweets'
    }`;
    console.log(`[${APP_NAME}]: Hid ${pluralizedDebugStr} from your timeline.`);
  }
};

// timing and run helpers
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

// run once tweets have loaded and then trigger every 500ms on scroll
waitForElement(SELECTORS.tweet).then(_element => {
  hideNonMediaTweetsFromDom();
  document.addEventListener('scroll', throttle(hideNonMediaTweetsFromDom, 500));
});
