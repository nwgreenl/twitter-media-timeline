export const APP_NAME = 'Twitter Media Timeline';
export const TWITTER_TIMELINE_PATH = '/home';
export const SELECTORS = {
  timelineContainer: 'div[aria-label*="Timeline"]',
  tweet: 'div[data-testid="tweet"]',
};

const MEDIA_CONSTRUCTORS = ['HTMLImageElement', 'HTMLVideoElement'];
export const MEDIA_CONSTRUCTORS_REGEX = new RegExp(
  MEDIA_CONSTRUCTORS.join('|'),
  'i'
);
