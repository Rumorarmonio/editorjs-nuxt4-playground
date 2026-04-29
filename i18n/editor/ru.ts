import type { EditorUiMessages } from './types'

export const editorRu: EditorUiMessages = {
  core: {
    placeholder: 'Введите контент или нажмите Tab, чтобы открыть меню блоков',
    loading: 'Редактор загружается',
    initError: 'Не удалось инициализировать Editor.js.',
    unknownBlocksError:
      'Сохранённые данные содержат типы блоков, которые не зарегистрированы.',
    duplicateAnchorsError: (anchors) =>
      `Значения якорей должны быть уникальными: ${anchors}.`,
    validationSaveError: 'В контенте редактора есть ошибки валидации.',
    saveError: 'Не удалось сохранить контент редактора.',
  },
  tools: {
    notice: {
      toolboxTitle: 'Заметка',
      titleLabel: 'Заголовок',
      titlePlaceholder: 'Заголовок заметки',
      textLabel: 'Текст',
      textPlaceholder: 'Текст заметки',
      typeLabel: 'Тип',
      typeOptions: {
        info: 'Информация',
        success: 'Успех',
        warning: 'Предупреждение',
      },
    },
    sectionIntro: {
      toolboxTitle: 'Вступление',
      titleLabel: 'Заголовок',
      titlePlaceholder: 'Заголовок секции',
      descriptionLabel: 'Описание',
      descriptionPlaceholder: 'Введите вводный абзац',
    },
    twoColumns: {
      toolboxTitle: 'Две колонки',
      layoutLabel: 'Макет',
      reverseLabel: 'Обратить при рендере',
      leftColumnLabel: 'Левая колонка',
      rightColumnLabel: 'Правая колонка',
      placeholder: 'Добавьте абзац, заголовок или список',
      layoutOptions: {
        equal: 'Равные колонки',
        leftWide: 'Левая шире',
        rightWide: 'Правая шире',
      },
    },
    mediaGallery: {
      toolboxTitle: 'Медиа-галерея',
      modeLabel: 'Режим',
      galleryIdLabel: 'ID галереи',
      galleryIdPlaceholder: 'project-gallery',
      enableViewerLabel: 'Включить просмотрщик',
      syncUrlLabel: 'Синхронизировать URL',
      addCardButton: 'Добавить карточку',
      cardTitle: (index) => `Карточка ${index + 1}`,
      moveUpButton: 'Выше',
      moveDownButton: 'Ниже',
      removeButton: 'Удалить',
      mediaTypeLabel: 'Тип медиа',
      mediaUrlLabel: 'URL медиа',
      mediaUrlPlaceholder: 'https://example.com/media.jpg',
      altLabel: 'Alt-текст',
      altPlaceholder: 'Опишите изображение',
      captionLabel: 'Подпись',
      captionPlaceholder: 'Короткая видимая подпись',
      descriptionLabel: 'Описание',
      descriptionPlaceholder: 'Дополнительное rich-описание',
      modeOptions: {
        gallery: 'Сетка галереи',
        slider: 'Слайдер',
      },
      itemTypeOptions: {
        image: 'Изображение',
        video: 'Видео',
      },
    },
    maskedFieldsDemo: {
      toolboxTitle: 'Демо масок',
      fields: {
        phone: 'Телефон',
        date: 'Дата',
        time: 'Время',
        price: 'Цена',
        card: 'Карта',
        email: 'Email',
      },
    },
    embed: {
      toolboxTitle: 'Встраивание',
      urlPlaceholder: (services) => `Вставьте URL ${services}`,
      hint: 'Нажмите Enter, чтобы создать embed-блок.',
      supportedServices: (services) => `Поддерживаемые сервисы: ${services}.`,
      readError: 'Не удалось прочитать файл изображения.',
    },
    quote: {
      quotePlaceholder: 'Введите цитату',
      captionPlaceholder: 'Подпись к цитате',
    },
  },
  inlineTools: {
    textColor: 'Цвет текста',
  },
  tunes: {
    anchor: {
      title: 'Якорь',
      label: 'Якорь',
      placeholder: 'section-anchor',
      duplicateError: 'Этот якорь уже используется в другом блоке.',
    },
    label: {
      title: 'Метка',
      label: 'Метка',
      placeholder: 'Название в сайдбаре',
    },
    spacing: {
      title: 'Отступы',
      topLabel: 'Сверху',
      bottomLabel: 'Снизу',
      options: {
        none: 'Нет',
        small: 'Маленький',
        medium: 'Средний',
        large: 'Большой',
      },
    },
  },
  validation: {
    fieldLabels: {
      noticeTitle: 'Заголовок',
      noticeText: 'Текст',
      sectionIntroTitle: 'Заголовок',
      galleryId: 'ID галереи',
      mediaAlt: 'Alt-текст',
      mediaCaption: 'Подпись',
    },
    contentValidationFallback: 'В контенте есть ошибки валидации.',
    contentValidationSummary: (count) =>
      `В контенте есть ошибки валидации: ${count}.`,
    noticeContentRequired: 'Добавьте заголовок или текст.',
    sectionIntroContentRequired: 'Добавьте заголовок или описание.',
    twoColumnsContentRequired: 'Добавьте контент хотя бы в одну колонку.',
    mediaCardsRequired: 'Добавьте хотя бы одну медиа-карточку.',
    galleryIdPattern:
      'Используйте только буквы, цифры, дефисы и подчёркивания.',
    mediaUrlRequired: 'URL медиа обязателен.',
    mediaUrlInvalid:
      'Используйте корректный http, относительный, blob, image data или video data URL.',
    mediaAltRequired: 'Alt-текст обязателен для изображений.',
    maxLength: (label, maxLength) =>
      `${label}: не больше ${maxLength} символов.`,
  },
  editorJs: {
    messages: {
      ui: {
        blockTunes: {
          toggler: {
            'Click to tune': 'Нажмите, чтобы настроить',
            'or drag to move': 'или перетащите',
          },
        },
        inlineToolbar: {
          converter: {
            'Convert to': 'Преобразовать в',
          },
        },
        toolbar: {
          toolbox: {
            Add: 'Добавить',
          },
        },
      },
      toolNames: {
        Text: 'Текст',
        Heading: 'Заголовок',
        List: 'Список',
        'Ordered List': 'Нумерованный список',
        'Unordered List': 'Маркированный список',
        Checklist: 'Чеклист',
        Quote: 'Цитата',
        Delimiter: 'Разделитель',
        Table: 'Таблица',
        Image: 'Изображение',
        Embed: 'Встраивание',
      },
      tools: {
        warning: {
          Title: 'Заголовок',
          Message: 'Сообщение',
        },
        link: {
          'Add a link': 'Добавьте ссылку',
        },
        List: {
          Unordered: 'Маркированный',
          Ordered: 'Нумерованный',
          Checklist: 'Чеклист',
          'Start with': 'Начать с',
          'Counter type': 'Тип счётчика',
          Numeric: 'Арабские цифры',
          'Lower Roman': 'Строчные римские',
          'Upper Roman': 'Заглавные римские',
          'Lower Alpha': 'Строчные буквы',
          'Upper Alpha': 'Заглавные буквы',
        },
        stub: {
          'The block can not be displayed correctly.':
            'Блок не может быть отображён корректно.',
        },
      },
      blockTunes: {
        delete: {
          Delete: 'Удалить',
          'Click to delete': 'Нажмите, чтобы удалить',
        },
        moveUp: {
          'Move up': 'Переместить вверх',
        },
        moveDown: {
          'Move down': 'Переместить вниз',
        },
      },
    },
  },
}
