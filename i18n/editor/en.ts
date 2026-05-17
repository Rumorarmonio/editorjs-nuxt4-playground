import type { EditorUiMessages } from './types'

export const editorEn: EditorUiMessages = {
  core: {
    placeholder: 'Write content or press Tab to open the block toolbar',
    loading: 'Loading editor',
    initError: 'Editor.js could not be initialized.',
    unknownBlocksError: 'Saved data contains block types that are not registered.',
    duplicateAnchorsError: (anchors) => `Anchor values must be unique: ${anchors}.`,
    validationSaveError: 'Editor content has validation errors.',
    saveError: 'Editor content could not be saved.',
  },
  tools: {
    notice: {
      toolboxTitle: 'Notice',
      titleLabel: 'Title',
      titlePlaceholder: 'Notice title',
      textLabel: 'Text',
      textPlaceholder: 'Notice text',
      typeLabel: 'Type',
      typeOptions: {
        info: 'Info',
        success: 'Success',
        warning: 'Warning',
      },
    },
    sectionIntro: {
      toolboxTitle: 'Section intro',
      titleLabel: 'Title',
      titlePlaceholder: 'Section title',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'Write an introductory paragraph',
    },
    twoColumns: {
      toolboxTitle: 'Two columns',
      layoutLabel: 'Layout',
      reverseLabel: 'Reverse on render',
      leftColumnLabel: 'Left column',
      rightColumnLabel: 'Right column',
      placeholder: 'Add paragraph, heading, or list',
      layoutOptions: {
        equal: 'Equal columns',
        leftWide: 'Left wide',
        rightWide: 'Right wide',
      },
    },
    mediaGallery: {
      toolboxTitle: 'Media gallery',
      modeLabel: 'Mode',
      galleryIdLabel: 'Gallery ID',
      galleryIdPlaceholder: 'project-gallery',
      enableViewerLabel: 'Enable viewer',
      syncUrlLabel: 'Sync URL',
      addCardButton: 'Add card',
      cardTitle: (index) => `Card ${index + 1}`,
      moveUpButton: 'Move up',
      moveDownButton: 'Move down',
      removeButton: 'Remove',
      mediaTypeLabel: 'Media type',
      mediaUrlLabel: 'Media URL',
      mediaUrlPlaceholder: 'https://example.com/media.jpg',
      altLabel: 'Alt text',
      altPlaceholder: 'Describe the image',
      captionLabel: 'Caption',
      captionPlaceholder: 'Short visible caption',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'Optional rich description',
      modeOptions: {
        gallery: 'Gallery grid',
        slider: 'Slider',
      },
      itemTypeOptions: {
        image: 'Image',
        video: 'Video',
      },
    },
    maskedFieldsDemo: {
      toolboxTitle: 'Masked fields demo',
      fields: {
        phone: 'Phone',
        date: 'Date',
        time: 'Time',
        price: 'Price',
        card: 'Card',
        email: 'Email',
      },
    },
    cta: {
      toolboxTitle: 'CTA button',
      labelLabel: 'Button label',
      labelPlaceholder: 'Start a project',
      urlLabel: 'URL',
      urlPlaceholder: 'https://example.com/contact',
      variantLabel: 'Variant',
      targetLabel: 'Target',
      actionTypeLabel: 'Action',
      eventNameLabel: 'Event name',
      eventNamePlaceholder: 'open-demo-modal',
      eventPayloadJsonLabel: 'Payload JSON',
      eventPayloadJsonPlaceholder:
        '{\n  "modalText": "Text for the modal window"\n}',
      variantOptions: {
        primary: 'Primary',
        secondary: 'Secondary',
        ghost: 'Ghost',
      },
      actionTypeOptions: {
        link: 'Open link',
        event: 'Emit event',
      },
      targetOptions: {
        sameTab: 'Same tab',
        newTab: 'New tab',
      },
    },
    codeSnippet: {
      toolboxTitle: 'Code snippet',
      languageLabel: 'Language',
      codeLabel: 'Code',
      codePlaceholder: 'Paste a code example',
      captionLabel: 'Caption',
      captionPlaceholder: 'Optional code caption',
      languageOptions: {
        plain: 'Plain text',
        typescript: 'TypeScript',
        javascript: 'JavaScript',
        vue: 'Vue',
        html: 'HTML',
        css: 'CSS',
        json: 'JSON',
        bash: 'Bash',
      },
    },
    rawHtml: {
      toolboxTitle: 'Raw HTML',
      htmlPlaceholder:
        '<section><h3>Custom markup</h3><p>Trusted HTML.</p></section>',
    },
    embed: {
      toolboxTitle: 'Embed',
      urlPlaceholder: (services) => `Paste a ${services} URL`,
      hint: 'Press Enter to create an embed block.',
      supportedServices: (services) => `Supported services: ${services}.`,
      captionPlaceholder: 'Caption',
      editUrlButton: 'Edit URL',
      applyUrlButton: 'Apply',
      cancelEditButton: 'Cancel',
      readError: 'Image file could not be read.',
    },
    quote: {
      quotePlaceholder: 'Enter a quote',
      captionPlaceholder: 'Quote caption',
    },
    tableControls: {
      addColumn: 'Add table column',
      addRow: 'Add table row',
      columnMenu: 'Open table column menu',
      rowMenu: 'Open table row menu',
    },
    editorToolbar: {
      addBlock: 'Add block',
      tuneBlock: 'Open block settings',
    },
  },
  inlineTools: {
    textColor: 'Text color',
  },
  pluginInfo: {
    standardTools: {
      paragraph: {
        title: 'Text',
        description: 'Basic rich text paragraph for regular body copy.',
        preview:
          'Renders as a paragraph with inline marks, links, and text color support.',
      },
      header: {
        title: 'Heading',
        description:
          'Section heading block for structuring page content and navigation.',
        preview:
          'Renders as a semantic heading and can appear in heading-based sidebar navigation.',
      },
      list: {
        title: 'List',
        description:
          'Ordered, unordered, or checklist-style list for grouped content.',
        preview:
          'Renders as a list with nested items according to the selected style.',
      },
      unorderedList: {
        title: 'Unordered List',
        description: 'Bulleted list for related items without a fixed order.',
        preview:
          'Renders as a nested bullet list with inline text formatting.',
      },
      orderedList: {
        title: 'Ordered List',
        description: 'Numbered list for steps, rankings, or ordered content.',
        preview:
          'Renders as a nested numbered list with the selected counter style.',
      },
      checklist: {
        title: 'Checklist',
        description:
          'Task-style list with checkable items for progress or requirements.',
        preview:
          'Renders as a checklist preserving each item checked state.',
      },
      quote: {
        title: 'Quote',
        description: 'Quotation block with quote text and optional caption.',
        preview:
          'Renders as a styled quote with caption below the quoted text.',
      },
      delimiter: {
        title: 'Delimiter',
        description: 'Simple visual separator between content sections.',
        preview: 'Renders as a horizontal divider in the preview layer.',
      },
      table: {
        title: 'Table',
        description: 'Simple table block for compact row and column data.',
        preview:
          'Renders as a responsive table using the saved Editor.js table data.',
      },
      embed: {
        title: 'Embed',
        description:
          'Embedded media block for supported services such as YouTube, Vimeo, Rutube, VK Video, Twitch, and Coub.',
        preview:
          'Renders as an inline iframe or Fancybox opener depending on block tunes.',
      },
      image: {
        title: 'Image',
        description:
          'Image block for URL or local draft images with caption support.',
        preview:
          'Renders as an image with optional caption and safe alt text fallback.',
      },
      rawHtml: {
        title: 'Raw HTML',
        description:
          'Trusted admin-only escape hatch for custom HTML markup.',
        preview:
          'Renders raw markup through the configured safe or unsafe renderer mode.',
      },
    },
    tools: {
      notice: {
        description:
          'Short callout for info, success, or warning messages inside content.',
        preview:
          'Renders as an accented notice panel with optional title and text.',
      },
      sectionIntro: {
        description:
          'Introductory section block with a plain title and rich paragraph description.',
        preview:
          'Renders as a compact heading group before a larger content section.',
      },
      twoColumns: {
        description:
          'Composite block with two independent rich text columns and layout controls.',
        preview:
          'Renders as responsive equal, left-wide, or right-wide columns.',
      },
      mediaGallery: {
        description:
          'Media collection for image or video cards, displayed as a grid or slider.',
        preview:
          'Renders gallery cards with optional Fancybox viewer and URL sync.',
      },
      maskedFieldsDemo: {
        description:
          'Demo-only block that shows masked plain fields for common input formats.',
        preview:
          'Renders saved phone, date, time, price, card, and email values.',
      },
      cta: {
        description:
          'Standalone button block for safe links or typed custom events.',
        preview:
          'Renders as a primary, secondary, or ghost call-to-action button.',
      },
      codeSnippet: {
        description:
          'Typed code block with language selection and optional caption.',
        preview:
          'Renders as highlighted code in the preview layer when language is supported.',
      },
    },
  },
  tunes: {
    anchor: {
      title: 'Anchor',
      label: 'Anchor',
      placeholder: 'section-anchor',
      duplicateError: 'This anchor is already used in another block.',
    },
    label: {
      title: 'Label',
      label: 'Label',
      placeholder: 'Sidebar title',
    },
    spacing: {
      title: 'Spacing',
      topLabel: 'Top',
      bottomLabel: 'Bottom',
      options: {
        none: 'None',
        small: 'Small',
        medium: 'Medium',
        large: 'Large',
      },
    },
    animation: {
      title: 'Animation',
      label: 'Reveal animation',
      options: {
        none: 'None',
        'fade-up': 'Fade up',
        'fade-left': 'Fade from left',
        'fade-right': 'Fade from right',
      },
    },
    embedDisplay: {
      title: 'Embed display',
      label: 'In Fancybox',
      options: {
        inline: 'On page',
        fancybox: 'In Fancybox',
      },
    },
  },
  validation: {
    fieldLabels: {
      noticeTitle: 'Title',
      noticeText: 'Text',
      sectionIntroTitle: 'Title',
      galleryId: 'Gallery ID',
      mediaAlt: 'Alt text',
      mediaCaption: 'Caption',
      ctaLabel: 'Button label',
      ctaEventName: 'Event name',
      ctaEventPayloadJson: 'Payload JSON',
      codeSnippetCode: 'Code',
      codeSnippetCaption: 'Caption',
      rawHtml: 'HTML',
    },
    contentValidationFallback: 'Content has validation errors.',
    contentValidationSummary: (count) => `Content has ${count} validation errors.`,
    noticeContentRequired: 'Add a title or text.',
    sectionIntroContentRequired: 'Add a title or description.',
    twoColumnsContentRequired: 'Add content to at least one column.',
    mediaCardsRequired: 'Add at least one media card.',
    galleryIdPattern: 'Use only letters, numbers, dashes, and underscores.',
    mediaUrlRequired: 'Media URL is required.',
    mediaUrlInvalid:
      'Use a valid http, relative, blob, image data, or video data URL.',
    mediaAltRequired: 'Alt text is required for images.',
    ctaLabelRequired: 'Button label is required.',
    ctaUrlRequired: 'URL is required.',
    ctaUrlInvalid:
      'Use an http, https, mailto, root-relative, or anchor URL.',
    ctaEventNameRequired: 'Event name is required.',
    ctaEventNameInvalid:
      'Use only letters, numbers, dashes, underscores, and colons.',
    ctaEventPayloadJsonInvalid: 'Enter valid JSON.',
    ctaEventPayloadJsonObjectRequired:
      'The payload root value must be a JSON object.',
    codeSnippetCodeRequired: 'Code is required.',
    rawHtmlRequired: 'HTML is required.',
    maxLength: (label, maxLength) =>
      `${label} must be ${maxLength} characters or fewer.`,
  },
  editorJs: {
    messages: {
      ui: {
        blockTunes: {
          toggler: {
            'Click to tune': 'Click to tune',
            'or drag to move': 'or drag to move',
          },
        },
        inlineToolbar: {
          converter: {
            'Convert to': 'Convert to',
          },
        },
        toolbar: {
          toolbox: {
            Add: 'Add',
          },
        },
      },
      toolNames: {
        Text: 'Text',
        Heading: 'Heading',
        List: 'List',
        'Ordered List': 'Ordered List',
        'Unordered List': 'Unordered List',
        Checklist: 'Checklist',
        Quote: 'Quote',
        Delimiter: 'Delimiter',
        Table: 'Table',
        Image: 'Image',
        Embed: 'Embed',
        'Raw HTML': 'Raw HTML',
      },
      tools: {
        warning: {
          Title: 'Title',
          Message: 'Message',
        },
        link: {
          'Add a link': 'Add a link',
        },
        List: {
          Unordered: 'Unordered',
          Ordered: 'Ordered',
          Checklist: 'Checklist',
          'Start with': 'Start with',
          'Counter type': 'Counter type',
          Numeric: 'Numeric',
          'Lower Roman': 'Lower Roman',
          'Upper Roman': 'Upper Roman',
          'Lower Alpha': 'Lower Alpha',
          'Upper Alpha': 'Upper Alpha',
        },
        stub: {
          'The block can not be displayed correctly.':
            'The block can not be displayed correctly.',
        },
      },
      blockTunes: {
        delete: {
          Delete: 'Delete',
          'Click to delete': 'Click to delete',
        },
        moveUp: {
          'Move up': 'Move up',
        },
        moveDown: {
          'Move down': 'Move down',
        },
      },
    },
  },
}
