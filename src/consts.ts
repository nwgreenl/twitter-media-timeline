export const LOG_PREFIX = "[Twitter Media Timeline]";
export const TWITTER_TIMELINE_PATH = "x.com/home";
export const SELECTORS = {
  homeNavLink: 'a[data-testid="AppTabBar_Home_Link"]',
  timelineContainer: 'div[aria-label*="Timeline"]',
  tweet: 'article[data-testid="tweet"]',
};

const MEDIA_CONSTRUCTORS = ["HTMLImageElement", "HTMLVideoElement"];
export const MEDIA_CONSTRUCTORS_REGEX = new RegExp(
  MEDIA_CONSTRUCTORS.join("|"),
  "i"
);
