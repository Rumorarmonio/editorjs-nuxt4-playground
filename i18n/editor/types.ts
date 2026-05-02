import type { SpacingTuneValue } from '~~/editor/shared'

export type SupportedLocale = 'ru' | 'en'

export interface EditorValidationMessages {
  fieldLabels: {
    noticeTitle: string
    noticeText: string
    sectionIntroTitle: string
    galleryId: string
    mediaAlt: string
    mediaCaption: string
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
    embed: {
      toolboxTitle: string
      urlPlaceholder: (services: string) => string
      hint: string
      supportedServices: (services: string) => string
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
  }
  validation: EditorValidationMessages
  editorJs: {
    messages: Record<string, unknown>
  }
}
