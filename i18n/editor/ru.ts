import type { EditorUiMessages } from './types'

export const editorRu: EditorUiMessages = {
  core: {
    placeholder: 'Введите контент или нажмите Tab, чтобы открыть меню блоков',
    loading: 'Редактор загружается',
    initError: 'Не удалось инициализировать Editor.js.',
    dataLoadError: 'Не удалось загрузить карточки.',
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
    dataCards: {
      toolboxTitle: 'Карточки из данных',
      sourceLabel: 'Источник',
      viewModeLabel: 'Режим просмотра',
      limitLabel: 'Лимит',
      skipLabel: 'Пропуск',
      orderLabel: 'Порядок',
      showLoadMoreLabel: 'Показывать "ещё"',
      loadMoreStepLabel: 'Шаг подгрузки',
      showViewAllButtonLabel: 'Показывать ссылку "Смотреть все"',
      viewAllHrefLabel: 'URL для просмотра всех',
      showVisitorControlsLabel: 'Показывать controls для посетителя',
      loadMoreButtonLabel: 'Показать ещё',
      viewAllButtonLabel: 'Смотреть все',
      sourceOptions: {
        products: 'Товары',
        posts: 'Посты',
        recipes: 'Рецепты',
      },
      viewModeOptions: {
        grid: 'Сетка',
        slider: 'Слайдер',
        list: 'Список',
      },
      orderOptions: {
        asc: 'По возрастанию',
        desc: 'По убыванию',
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
    cta: {
      toolboxTitle: 'CTA-кнопка',
      labelLabel: 'Текст кнопки',
      labelPlaceholder: 'Начать проект',
      urlLabel: 'URL',
      urlPlaceholder: 'https://example.com/contact',
      variantLabel: 'Вариант',
      contentModeLabel: 'Содержимое',
      leftIconLabel: 'Иконка слева',
      rightIconLabel: 'Иконка справа',
      iconLabel: 'Иконка',
      noIconOption: 'Без иконки',
      iconSearchPlaceholder: 'Найти иконку',
      iconNoResults: 'Иконки не найдены',
      iconNoChoices: 'Иконки недоступны',
      targetLabel: 'Открывать',
      actionTypeLabel: 'Действие',
      eventNameLabel: 'Имя события',
      eventNamePlaceholder: 'open-demo-modal',
      eventPayloadJsonLabel: 'Payload JSON',
      eventPayloadJsonPlaceholder:
        '{\n  "modalText": "Текст для модального окна"\n}',
      variantOptions: {
        primary: 'Основная',
        secondary: 'Вторичная',
        ghost: 'Текстовая',
      },
      actionTypeOptions: {
        link: 'Открыть ссылку',
        event: 'Отправить событие',
      },
      contentModeOptions: {
        text: 'Текст',
        iconOnly: 'Только иконка',
      },
      targetOptions: {
        sameTab: 'В этой вкладке',
        newTab: 'В новой вкладке',
      },
    },
    codeSnippet: {
      toolboxTitle: 'Фрагмент кода',
      languageLabel: 'Язык',
      codeLabel: 'Код',
      codePlaceholder: 'Вставьте пример кода',
      captionLabel: 'Подпись',
      captionPlaceholder: 'Необязательная подпись к коду',
      languageOptions: {
        plain: 'Простой текст',
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
        '<section><h3>Своя разметка</h3><p>Доверенный HTML.</p></section>',
    },
    accordionGroup: {
      toolboxTitle: 'Группа аккордеонов',
      closeOthersLabel: 'Закрывать остальные при открытии',
      addItemButton: 'Добавить элемент',
      itemTitle: (index) => `Элемент ${index + 1}`,
      moveUpButton: 'Выше',
      moveDownButton: 'Ниже',
      removeButton: 'Удалить',
      initialOpenLabel: 'Открыт изначально',
      headerLabel: 'Заголовок',
      headerPlaceholder: 'Заголовок элемента аккордеона',
      bodyLabel: 'Содержимое',
      bodyPlaceholder: 'Добавьте параграф, заголовок, список или CTA',
    },
    embed: {
      toolboxTitle: 'Встраивание',
      urlPlaceholder: (services) => `Вставьте URL ${services}`,
      hint: 'Нажмите Enter, чтобы создать embed-блок.',
      supportedServices: (services) => `Поддерживаемые сервисы: ${services}.`,
      captionPlaceholder: 'Подпись',
      editUrlButton: 'Изменить ссылку',
      applyUrlButton: 'Применить',
      cancelEditButton: 'Отмена',
      readError: 'Не удалось прочитать файл изображения.',
    },
    quote: {
      quotePlaceholder: 'Введите цитату',
      captionPlaceholder: 'Подпись к цитате',
    },
    tableControls: {
      addColumn: 'Добавить колонку таблицы',
      addRow: 'Добавить строку таблицы',
      columnMenu: 'Открыть меню колонки таблицы',
      rowMenu: 'Открыть меню строки таблицы',
    },
    editorToolbar: {
      addBlock: 'Добавить блок',
      tuneBlock: 'Открыть настройки блока',
    },
  },
  inlineTools: {
    textColor: 'Цвет текста',
    textColorOptions: {
      blue: 'Синий',
      green: 'Зелёный',
      danger: 'Красный',
      warning: 'Предупреждение',
      muted: 'Приглушённый',
    },
    textBackground: 'Фон текста',
    textBackgroundOptions: {
      blue: 'Синий',
      green: 'Зелёный',
      danger: 'Красный',
      warning: 'Предупреждение',
      muted: 'Приглушённый',
    },
  },
  pluginInfo: {
    standardTools: {
      paragraph: {
        title: 'Текст',
        description: 'Базовый rich text абзац для основного текста страницы.',
        preview:
          'В preview отображается как абзац с inline-выделениями, ссылками и цветом текста.',
      },
      header: {
        title: 'Заголовок',
        description:
          'Блок заголовка для структуры страницы и навигации по контенту.',
        preview:
          'В preview отображается как семантический heading и может попадать в навигацию по заголовкам.',
      },
      list: {
        title: 'Список',
        description:
          'Нумерованный, маркированный или checklist-style список для сгруппированного контента.',
        preview:
          'В preview отображается как список с вложенными пунктами согласно выбранному стилю.',
      },
      unorderedList: {
        title: 'Маркированный список',
        description:
          'Список с маркерами для связанных пунктов без строгого порядка.',
        preview:
          'В preview отображается как вложенный bullet list с inline-форматированием текста.',
      },
      orderedList: {
        title: 'Нумерованный список',
        description:
          'Нумерованный список для шагов, рейтингов или упорядоченного контента.',
        preview:
          'В preview отображается как вложенный numbered list с выбранным стилем счётчика.',
      },
      checklist: {
        title: 'Чеклист',
        description:
          'Task-style список с отмечаемыми пунктами для прогресса или требований.',
        preview:
          'В preview отображается как checklist с сохранением checked-состояния пунктов.',
      },
      quote: {
        title: 'Цитата',
        description: 'Блок цитаты с текстом и необязательной подписью.',
        preview:
          'В preview отображается как оформленная цитата с подписью под текстом.',
      },
      delimiter: {
        title: 'Разделитель',
        description: 'Простой визуальный разделитель между секциями контента.',
        preview: 'В preview отображается как горизонтальная линия-разделитель.',
      },
      table: {
        title: 'Таблица',
        description:
          'Простая таблица для компактных данных в строках и колонках.',
        preview:
          'В preview отображается как responsive-таблица на основе сохранённых Editor.js данных.',
      },
      embed: {
        title: 'Встраивание',
        description:
          'Блок встраиваемого media для YouTube, Vimeo, Rutube, VK Video, Twitch и Coub.',
        preview:
          'В preview отображается как inline iframe или Fancybox opener в зависимости от tunes блока.',
      },
      image: {
        title: 'Изображение',
        description:
          'Блок изображения для URL или локальных draft-картинок с поддержкой подписи.',
        preview:
          'В preview отображается как изображение с optional caption и safe alt fallback.',
      },
      rawHtml: {
        title: 'HTML-код',
        description:
          'Trusted admin-only escape hatch для произвольной HTML-разметки.',
        preview:
          'В preview рендерит HTML через настроенный safe или unsafe режим renderer.',
      },
    },
    tools: {
      notice: {
        description:
          'Короткий акцентный блок для информационных, успешных или предупреждающих сообщений.',
        preview:
          'В preview отображается как заметка с акцентом, необязательным заголовком и текстом.',
      },
      sectionIntro: {
        description:
          'Вводный блок секции с простым заголовком и rich-описанием.',
        preview:
          'В preview отображается как компактная группа заголовка перед большим разделом.',
      },
      twoColumns: {
        description:
          'Composite-блок с двумя независимыми rich-колонками и настройками макета.',
        preview:
          'В preview отображается как responsive-сетка с равными или широкими колонками.',
      },
      mediaGallery: {
        description:
          'Коллекция media-карточек для изображений или видео в режиме сетки или слайдера.',
        preview:
          'В preview отображает карточки галереи с optional Fancybox viewer и URL sync.',
      },
      dataCards: {
        description:
          'Блок карточек на базе mock API для товаров, постов и рецептов с контролируемой сортировкой, фильтрацией и навигацией.',
        preview:
          'В preview отображает интерактивную секцию карточек, которая получает данные из DummyJSON и поддерживает grid, slider или list.',
      },
      maskedFieldsDemo: {
        description:
          'Demo-only блок с масками для распространённых форматов plain fields.',
        preview:
          'В preview отображает сохранённые телефон, дату, время, цену, карту и email.',
      },
      cta: {
        description:
          'Самостоятельная кнопка для безопасной ссылки или типизированного custom event.',
        preview:
          'В preview отображается как primary, secondary или ghost CTA-кнопка.',
      },
      codeSnippet: {
        description:
          'Типизированный блок кода с выбором языка и необязательной подписью.',
        preview:
          'В preview отображается как подсвеченный код, если выбранный язык поддерживается.',
      },
      accordionGroup: {
        description:
          'Группа раскрывающихся элементов с rich-заголовками и вложенным контентом.',
        preview:
          'В preview отображается как доступный аккордеон с локальным состоянием и анимацией высоты.',
      },
    },
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
    animation: {
      title: 'Анимация',
      label: 'Появление',
      options: {
        none: 'Нет',
        'fade-up': 'Снизу вверх',
        'fade-left': 'Слева направо',
        'fade-right': 'Справа налево',
      },
    },
    embedDisplay: {
      title: 'Отображение embed',
      label: 'В Fancybox',
      options: {
        inline: 'На странице',
        fancybox: 'В Fancybox',
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
      ctaLabel: 'Текст кнопки',
      ctaIcon: 'Иконка кнопки',
      ctaEventName: 'Имя события',
      ctaEventPayloadJson: 'Payload JSON',
      codeSnippetCode: 'Код',
      codeSnippetCaption: 'Подпись',
      rawHtml: 'HTML',
      accordionHeader: 'Заголовок аккордеона',
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
    ctaLabelRequired: 'Текст кнопки обязателен.',
    ctaUrlRequired: 'URL обязателен.',
    ctaUrlInvalid:
      'Используйте http, https, mailto, ссылку от корня или якорь.',
    ctaIconRequired: 'Выберите иконку для режима только с иконкой.',
    ctaIconInvalid: 'Выберите иконку из generated sprite.',
    ctaEventNameRequired: 'Имя события обязательно.',
    ctaEventNameInvalid:
      'Используйте только буквы, цифры, дефисы, подчёркивания и двоеточия.',
    ctaEventPayloadJsonInvalid: 'Введите валидный JSON.',
    ctaEventPayloadJsonObjectRequired:
      'Корневое значение payload должно быть JSON-объектом.',
    codeSnippetCodeRequired: 'Код обязателен.',
    rawHtmlRequired: 'HTML обязателен.',
    accordionItemsRequired: 'Добавьте хотя бы один элемент аккордеона.',
    accordionItemContentRequired: 'Добавьте заголовок или содержимое.',
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
        popover: {
          Filter: 'Поиск',
          'Nothing found': 'Ничего не найдено',
          'Convert to': 'Преобразовать в',
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
        'Raw HTML': 'HTML-код',
        Bold: 'Жирный',
        Italic: 'Курсив',
        Link: 'Ссылка',
        Underline: 'Подчёркивание',
        Marker: 'Маркер',
        Strikethrough: 'Зачёркивание',
        'Inline Code': 'Инлайн-код',
        'Text Color': 'Цвет текста',
      },
      tools: {
        warning: {
          Title: 'Заголовок',
          Message: 'Сообщение',
        },
        link: {
          'Add a link': 'Добавьте ссылку',
        },
        convertTo: {
          'Convert to': 'Преобразовать в',
        },
        header: {
          'Heading 1': 'Заголовок 1',
          'Heading 2': 'Заголовок 2',
          'Heading 3': 'Заголовок 3',
          'Heading 4': 'Заголовок 4',
          'Heading 5': 'Заголовок 5',
          'Heading 6': 'Заголовок 6',
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
