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
    embed: {
      toolboxTitle: 'Embed',
      urlPlaceholder: (services) => `Paste a ${services} URL`,
      hint: 'Press Enter to create an embed block.',
      supportedServices: (services) => `Supported services: ${services}.`,
      readError: 'Image file could not be read.',
    },
    quote: {
      quotePlaceholder: 'Enter a quote',
      captionPlaceholder: 'Quote caption',
    },
  },
  inlineTools: {
    textColor: 'Text color',
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
  },
  validation: {
    fieldLabels: {
      noticeTitle: 'Title',
      noticeText: 'Text',
      sectionIntroTitle: 'Title',
      galleryId: 'Gallery ID',
      mediaAlt: 'Alt text',
      mediaCaption: 'Caption',
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
