import type {
  AnimationTuneValue,
  EmbedDisplayTuneMode,
  SpacingTuneValue,
} from '~~/editor/shared'

export type SupportedLocale = 'ru' | 'en' | 'es'
export type AppLocalePreference = 'system' | SupportedLocale

export interface EditorValidationMessages {
  fieldLabels: {
    noticeTitle: string
    noticeText: string
    sectionIntroTitle: string
    galleryId: string
    mediaAlt: string
    mediaCaption: string
    ctaLabel: string
    ctaIcon: string
    ctaEventName: string
    ctaEventPayloadJson: string
    codeSnippetCode: string
    codeSnippetCaption: string
    rawHtml: string
    accordionHeader: string
  }
  contentValidationFallback: string
  contentValidationSummary: (count: number) => string
  noticeContentRequired: string
  sectionIntroContentRequired: string
  twoColumnsContentRequired: string
  mediaCardsRequired: string
  galleryIdPattern: string
  mediaUrlRequired: string
  mediaUrlInvalid: string
  mediaAltRequired: string
  ctaLabelRequired: string
  ctaUrlRequired: string
  ctaUrlInvalid: string
  ctaIconRequired: string
  ctaIconInvalid: string
  ctaEventNameRequired: string
  ctaEventNameInvalid: string
  ctaEventPayloadJsonInvalid: string
  ctaEventPayloadJsonObjectRequired: string
  codeSnippetCodeRequired: string
  rawHtmlRequired: string
  accordionItemsRequired: string
  accordionItemContentRequired: string
  maxLength: (label: string, maxLength: number) => string
}

export interface EditorUiMessages {
  core: {
    placeholder: string
    loading: string
    initError: string
    unknownBlocksError: string
    duplicateAnchorsError: (anchors: string) => string
    validationSaveError: string
    saveError: string
  }
  tools: {
    notice: {
      toolboxTitle: string
      titleLabel: string
      titlePlaceholder: string
      textLabel: string
      textPlaceholder: string
      typeLabel: string
      typeOptions: {
        info: string
        success: string
        warning: string
      }
    }
    sectionIntro: {
      toolboxTitle: string
      titleLabel: string
      titlePlaceholder: string
      descriptionLabel: string
      descriptionPlaceholder: string
    }
    twoColumns: {
      toolboxTitle: string
      layoutLabel: string
      reverseLabel: string
      leftColumnLabel: string
      rightColumnLabel: string
      placeholder: string
      layoutOptions: {
        equal: string
        leftWide: string
        rightWide: string
      }
    }
    mediaGallery: {
      toolboxTitle: string
      modeLabel: string
      galleryIdLabel: string
      galleryIdPlaceholder: string
      enableViewerLabel: string
      syncUrlLabel: string
      addCardButton: string
      cardTitle: (index: number) => string
      moveUpButton: string
      moveDownButton: string
      removeButton: string
      mediaTypeLabel: string
      mediaUrlLabel: string
      mediaUrlPlaceholder: string
      altLabel: string
      altPlaceholder: string
      captionLabel: string
      captionPlaceholder: string
      descriptionLabel: string
      descriptionPlaceholder: string
      modeOptions: {
        gallery: string
        slider: string
      }
      itemTypeOptions: {
        image: string
        video: string
      }
    }
    maskedFieldsDemo: {
      toolboxTitle: string
      fields: {
        phone: string
        date: string
        time: string
        price: string
        card: string
        email: string
      }
    }
    cta: {
      toolboxTitle: string
      labelLabel: string
      labelPlaceholder: string
      urlLabel: string
      urlPlaceholder: string
      variantLabel: string
      contentModeLabel: string
      leftIconLabel: string
      rightIconLabel: string
      iconLabel: string
      noIconOption: string
      iconSearchPlaceholder: string
      iconNoResults: string
      iconNoChoices: string
      targetLabel: string
      actionTypeLabel: string
      eventNameLabel: string
      eventNamePlaceholder: string
      eventPayloadJsonLabel: string
      eventPayloadJsonPlaceholder: string
      variantOptions: {
        primary: string
        secondary: string
        ghost: string
      }
      actionTypeOptions: {
        link: string
        event: string
      }
      contentModeOptions: {
        text: string
        iconOnly: string
      }
      targetOptions: {
        sameTab: string
        newTab: string
      }
    }
    codeSnippet: {
      toolboxTitle: string
      languageLabel: string
      codeLabel: string
      codePlaceholder: string
      captionLabel: string
      captionPlaceholder: string
      languageOptions: Record<string, string>
    }
    rawHtml: {
      toolboxTitle: string
      htmlPlaceholder: string
    }
    accordionGroup: {
      toolboxTitle: string
      closeOthersLabel: string
      addItemButton: string
      itemTitle: (index: number) => string
      moveUpButton: string
      moveDownButton: string
      removeButton: string
      initialOpenLabel: string
      headerLabel: string
      headerPlaceholder: string
      bodyLabel: string
      bodyPlaceholder: string
    }
    embed: {
      toolboxTitle: string
      urlPlaceholder: (services: string) => string
      hint: string
      supportedServices: (services: string) => string
      captionPlaceholder: string
      editUrlButton: string
      applyUrlButton: string
      cancelEditButton: string
      readError: string
    }
    quote: {
      quotePlaceholder: string
      captionPlaceholder: string
    }
    tableControls: {
      addColumn: string
      addRow: string
      columnMenu: string
      rowMenu: string
    }
    editorToolbar: {
      addBlock: string
      tuneBlock: string
    }
  }
  inlineTools: {
    textColor: string
    textColorOptions: {
      blue: string
      green: string
      danger: string
      warning: string
      muted: string
    }
    textBackground: string
    textBackgroundOptions: {
      blue: string
      green: string
      danger: string
      warning: string
      muted: string
    }
  }
  pluginInfo: {
    standardTools: {
      paragraph: EditorPluginInfoMessagesWithTitle
      header: EditorPluginInfoMessagesWithTitle
      list: EditorPluginInfoMessagesWithTitle
      unorderedList: EditorPluginInfoMessagesWithTitle
      orderedList: EditorPluginInfoMessagesWithTitle
      checklist: EditorPluginInfoMessagesWithTitle
      quote: EditorPluginInfoMessagesWithTitle
      delimiter: EditorPluginInfoMessagesWithTitle
      table: EditorPluginInfoMessagesWithTitle
      embed: EditorPluginInfoMessagesWithTitle
      image: EditorPluginInfoMessagesWithTitle
      rawHtml: EditorPluginInfoMessagesWithTitle
    }
    tools: {
      notice: EditorPluginInfoMessages
      sectionIntro: EditorPluginInfoMessages
      twoColumns: EditorPluginInfoMessages
      mediaGallery: EditorPluginInfoMessages
      maskedFieldsDemo: EditorPluginInfoMessages
      cta: EditorPluginInfoMessages
      codeSnippet: EditorPluginInfoMessages
      accordionGroup: EditorPluginInfoMessages
    }
  }
  tunes: {
    anchor: {
      title: string
      label: string
      placeholder: string
      duplicateError: string
    }
    label: {
      title: string
      label: string
      placeholder: string
    }
    spacing: {
      title: string
      topLabel: string
      bottomLabel: string
      options: Record<SpacingTuneValue, string>
    }
    animation: {
      title: string
      label: string
      options: Record<AnimationTuneValue, string>
    }
    embedDisplay: {
      title: string
      label: string
      options: Record<EmbedDisplayTuneMode, string>
    }
  }
  validation: EditorValidationMessages
  editorJs: {
    messages: Record<string, unknown>
  }
}

export interface EditorPluginInfoMessages {
  description: string
  preview: string
  previewImage?: {
    src: string
    alt: string
  }
}

export interface EditorPluginInfoMessagesWithTitle
  extends EditorPluginInfoMessages {
  title: string
}
