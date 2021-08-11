# Twitter Media Timeline 
<p align="center">
  <img src="https://github.com/nwgreenl/twitter-media-timeline/blob/main/public/images/icon-128.png?raw=true">
</p>

This is a simple chrome extension that hides tweets that do not contain either an image or a video from your timeline, similar to the "Media" tab on a user's profile.

Icon by [Sohyun Kim](https://sohyun.kim/)

## Install
1. Navigate to the [releases page](https://github.com/nwgreenl/twitter-media-timeline/releases/).
2. Download the newest release's attached `.crx` file.
3. Open the Extension Management page by navigating to `chrome://extensions`.
4. Drag and drop the release's `.crx` file.


## Dev

### Setup

Note that this project uses [gts](https://www.npmjs.com/package/gts) for Typescript things and [copyfiles](https://www.npmjs.com/package/copyfiles) for os-agnostic copying (when building).

```
npm i
```

### Build

```
npm run build
```

### Load/Install

1. Build the extension.
2. Open the Extension Management page by navigating to `chrome://extensions`.
3. Enable Developer Mode by clicking the toggle switch next to Developer mode.
4. Click the Load unpacked button and select the `dist` directory.
