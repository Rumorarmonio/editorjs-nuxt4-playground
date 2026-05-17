# Plugin Preview Images

Tooltip preview images live in this directory.

Current temporary placeholder:

- `placeholder.svg`

To add one shared image for all locales:

1. Put the image file in this directory, for example `notice.png` or `media-gallery.webp`.
2. In `editor/admin/tooltips/plugin-info-metadata.ts`, update `editorPluginInfoPreviewImageSrcByKey`:

```ts
notice: '/plugin-previews/notice.png',
```

Root-relative preview paths are resolved through Nuxt `app.baseURL`, so GitHub
Pages deployments under a project path keep the repository segment in image
URLs.

To override the image for one locale only, add `previewImage` to the matching `pluginInfo` entry in `i18n/editor/en.ts`, `i18n/editor/ru.ts`, or `i18n/editor/es.ts`:

```ts
previewImage: {
  src: '/plugin-previews/notice.png',
  alt: 'Notice block preview',
},
```

Locale-level `previewImage.src` wins over the shared registry image. `alt` can be localized even when the shared image is reused.

If neither `editorPluginInfoPreviewImageSrcByKey` nor the current locale metadata provides an image for a tool, the tooltip renders without a preview image.
