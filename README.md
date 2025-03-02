# Twitter Media Timeline

<p align="center">
  <img src="https://github.com/nwgreenl/twitter-media-timeline/blob/main/public/images/icon-128.png?raw=true">
</p>

This is a simple chrome extension that hides tweets that do not contain either an image or a video from your timeline, similar to the "Media" tab on a user's profile.

- Note that this was intended as a personal project without any sort of long-term support plan, but I decided it was worth atleast posting publicly in case others have the same desire to have a media timeline. Please check the last working date on the releases page.

Icon by [Sohyun Kim](https://sohyun.kim/)

## Setup

Note that this project uses [gts](https://www.npmjs.com/package/gts) for Typescript things and [copyfiles](https://www.npmjs.com/package/copyfiles) for os-agnostic copying (when building).

```
npm i
```

## Build

```
npm run build
```

## Load/Install

1. Build the extension.
2. Open the Extension Management page by navigating to `chrome://extensions`.
3. Enable Developer Mode by clicking the toggle switch next to Developer mode.
4. Click the Load unpacked button and select the `dist` directory.
