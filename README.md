# Nenofolio

A responsive, static creative portfolio for GitHub Pages. The visual theme uses a light background with neon-green accents.

## Features

- Responsive layout for desktop and mobile
- MP4 and WebM video gallery with category filters
- YouTube and Instagram embeds
- Optional ambient audio with a manual play/pause control
- About and contact sections
- No click sound effects and no autoplay audio

## Add video projects

1. Add your video files to `assets/videos/`.
2. Open `script.js`.
3. Add entries to the `SITE_CONTENT.videos` array:

```js
{
  title: "My edit",
  category: "AMV",
  src: "assets/videos/my-edit.mp4",
  poster: "assets/thumbnails/my-edit.jpg",
  description: "A short description of the project."
}
```

The `poster` field is optional. Supported video formats are MP4 and WebM.

## Add YouTube or Instagram embeds

Add entries to `SITE_CONTENT.embeds` in `script.js`:

```js
{ platform: "youtube", title: "My video", url: "https://youtu.be/VIDEO_ID" },
{ platform: "instagram", title: "My reel", url: "https://www.instagram.com/reel/SHORTCODE/" }
```

## Add social/contact links

Edit `SITE_CONTENT.socials` in `script.js`. Leave a value as an empty string to hide that link.

## Ambient audio

Put an audio file in `assets/audio/`, then set the `ambientAudio` value in `script.js`, for example:

```js
ambientAudio: "assets/audio/ambient.mp3"
```

Ambient audio never starts automatically. Visitors must press the audio control. No click SFX are included.

## Publish with GitHub Pages

In the repository, open **Settings → Pages** and set the source to **Deploy from a branch**, choose **main** and **/(root)**, then save.

The site should be available at:

https://jahid10s.github.io/NenoFolio/

GitHub Pages is static hosting. To add or replace portfolio media, upload the files to the repository and update `script.js`. There is no visitor-facing server upload panel.
