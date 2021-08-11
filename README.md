# Twitter Media Timeline

[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

This is a simple chrome extension that hides tweets that do not contain either an image or a video from your timeline, similar to the "Media" tab on a user's profile.

Icon by [Sohyun Kim](https://sohyun.kim/)

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

### Load

1. Build the extension.
2. Open the Extension Management page by navigating to `chrome://extensions`.
3. Enable Developer Mode by clicking the toggle switch next to Developer mode.
4. Click the Load unpacked button and select the `dist` directory.
