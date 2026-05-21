import type { EditorUiMessages } from './types'

export const editorEs: EditorUiMessages = {
  core: {
    placeholder:
      'Escriba contenido o pulse Tab para abrir la barra de bloques',
    loading: 'Cargando editor',
    initError: 'No se pudo inicializar Editor.js.',
    unknownBlocksError:
      'Los datos guardados contienen tipos de bloque no registrados.',
    duplicateAnchorsError: (anchors) =>
      `Los valores de ancla deben ser únicos: ${anchors}.`,
    validationSaveError: 'El contenido del editor tiene errores de validación.',
    saveError: 'No se pudo guardar el contenido del editor.',
  },
  tools: {
    notice: {
      toolboxTitle: 'Aviso',
      titleLabel: 'Título',
      titlePlaceholder: 'Título del aviso',
      textLabel: 'Texto',
      textPlaceholder: 'Texto del aviso',
      typeLabel: 'Tipo',
      typeOptions: {
        info: 'Información',
        success: 'Éxito',
        warning: 'Advertencia',
      },
    },
    sectionIntro: {
      toolboxTitle: 'Introducción',
      titleLabel: 'Título',
      titlePlaceholder: 'Título de la sección',
      descriptionLabel: 'Descripción',
      descriptionPlaceholder: 'Escriba un párrafo introductorio',
    },
    twoColumns: {
      toolboxTitle: 'Dos columnas',
      layoutLabel: 'Diseño',
      reverseLabel: 'Invertir al renderizar',
      leftColumnLabel: 'Columna izquierda',
      rightColumnLabel: 'Columna derecha',
      placeholder: 'Añada un párrafo, título o lista',
      layoutOptions: {
        equal: 'Columnas iguales',
        leftWide: 'Izquierda ancha',
        rightWide: 'Derecha ancha',
      },
    },
    mediaGallery: {
      toolboxTitle: 'Galería multimedia',
      modeLabel: 'Modo',
      galleryIdLabel: 'ID de galería',
      galleryIdPlaceholder: 'project-gallery',
      enableViewerLabel: 'Activar visor',
      syncUrlLabel: 'Sincronizar URL',
      addCardButton: 'Añadir tarjeta',
      cardTitle: (index) => `Tarjeta ${index + 1}`,
      moveUpButton: 'Subir',
      moveDownButton: 'Bajar',
      removeButton: 'Eliminar',
      mediaTypeLabel: 'Tipo de medio',
      mediaUrlLabel: 'URL del medio',
      mediaUrlPlaceholder: 'https://example.com/media.jpg',
      altLabel: 'Texto alt',
      altPlaceholder: 'Describa la imagen',
      captionLabel: 'Leyenda',
      captionPlaceholder: 'Leyenda visible corta',
      descriptionLabel: 'Descripción',
      descriptionPlaceholder: 'Descripción enriquecida opcional',
      modeOptions: {
        gallery: 'Cuadrícula de galería',
        slider: 'Slider',
      },
      itemTypeOptions: {
        image: 'Imagen',
        video: 'Vídeo',
      },
    },
    maskedFieldsDemo: {
      toolboxTitle: 'Demo de máscaras',
      fields: {
        phone: 'Teléfono',
        date: 'Fecha',
        time: 'Hora',
        price: 'Precio',
        card: 'Tarjeta',
        email: 'Email',
      },
    },
    cta: {
      toolboxTitle: 'Botón CTA',
      labelLabel: 'Texto del botón',
      labelPlaceholder: 'Iniciar un proyecto',
      urlLabel: 'URL',
      urlPlaceholder: 'https://example.com/contact',
      variantLabel: 'Variante',
      contentModeLabel: 'Contenido',
      leftIconLabel: 'Icono izquierdo',
      rightIconLabel: 'Icono derecho',
      iconLabel: 'Icono',
      noIconOption: 'Sin icono',
      iconSearchPlaceholder: 'Buscar icono',
      iconNoResults: 'No se encontraron iconos',
      iconNoChoices: 'No hay iconos disponibles',
      targetLabel: 'Destino',
      actionTypeLabel: 'Acción',
      eventNameLabel: 'Nombre del evento',
      eventNamePlaceholder: 'open-demo-modal',
      eventPayloadJsonLabel: 'Payload JSON',
      eventPayloadJsonPlaceholder:
        '{\n  "modalText": "Texto para la ventana modal"\n}',
      variantOptions: {
        primary: 'Principal',
        secondary: 'Secundario',
        ghost: 'Discreto',
      },
      actionTypeOptions: {
        link: 'Abrir enlace',
        event: 'Emitir evento',
      },
      contentModeOptions: {
        text: 'Texto',
        iconOnly: 'Solo icono',
      },
      targetOptions: {
        sameTab: 'Misma pestaña',
        newTab: 'Nueva pestaña',
      },
    },
    codeSnippet: {
      toolboxTitle: 'Fragmento de código',
      languageLabel: 'Lenguaje',
      codeLabel: 'Código',
      codePlaceholder: 'Pegue un ejemplo de código',
      captionLabel: 'Leyenda',
      captionPlaceholder: 'Leyenda opcional del código',
      languageOptions: {
        plain: 'Texto plano',
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
        '<section><h3>Marcado propio</h3><p>HTML confiable.</p></section>',
    },
    accordionGroup: {
      toolboxTitle: 'Grupo de acordeones',
      closeOthersLabel: 'Cerrar otros elementos al abrir',
      addItemButton: 'Añadir elemento',
      itemTitle: (index) => `Elemento ${index + 1}`,
      moveUpButton: 'Subir',
      moveDownButton: 'Bajar',
      removeButton: 'Eliminar',
      initialOpenLabel: 'Abierto inicialmente',
      headerLabel: 'Encabezado',
      headerPlaceholder: 'Título del elemento del acordeón',
      bodyLabel: 'Contenido',
      bodyPlaceholder: 'Añada párrafo, encabezado, lista o CTA',
    },
    embed: {
      toolboxTitle: 'Insertar',
      urlPlaceholder: (services) => `Pegue una URL de ${services}`,
      hint: 'Pulse Enter para crear un bloque embed.',
      supportedServices: (services) => `Servicios compatibles: ${services}.`,
      captionPlaceholder: 'Leyenda',
      editUrlButton: 'Editar URL',
      applyUrlButton: 'Aplicar',
      cancelEditButton: 'Cancelar',
      readError: 'No se pudo leer el archivo de imagen.',
    },
    quote: {
      quotePlaceholder: 'Introduzca una cita',
      captionPlaceholder: 'Leyenda de la cita',
    },
    tableControls: {
      addColumn: 'Añadir columna de tabla',
      addRow: 'Añadir fila de tabla',
      columnMenu: 'Abrir menú de columna de tabla',
      rowMenu: 'Abrir menú de fila de tabla',
    },
    editorToolbar: {
      addBlock: 'Añadir bloque',
      tuneBlock: 'Abrir ajustes del bloque',
    },
  },
  inlineTools: {
    textColor: 'Color de texto',
  },
  pluginInfo: {
    standardTools: {
      paragraph: {
        title: 'Texto',
        description:
          'Párrafo rich text básico para el cuerpo principal de la página.',
        preview:
          'En preview se muestra como párrafo con marcas inline, enlaces y color de texto.',
      },
      header: {
        title: 'Título',
        description:
          'Bloque de encabezado para estructurar la página y la navegación del contenido.',
        preview:
          'En preview se muestra como heading semántico y puede aparecer en la navegación por títulos.',
      },
      list: {
        title: 'Lista',
        description:
          'Lista numerada, con viñetas o checklist-style para contenido agrupado.',
        preview:
          'En preview se muestra como lista con elementos anidados según el estilo elegido.',
      },
      unorderedList: {
        title: 'Lista con viñetas',
        description:
          'Lista con viñetas para elementos relacionados sin orden fijo.',
        preview:
          'En preview se muestra como lista de viñetas anidada con formato inline.',
      },
      orderedList: {
        title: 'Lista numerada',
        description:
          'Lista numerada para pasos, rankings o contenido ordenado.',
        preview:
          'En preview se muestra como lista numerada anidada con el estilo de contador elegido.',
      },
      checklist: {
        title: 'Checklist',
        description:
          'Lista tipo tarea con elementos marcables para progreso o requisitos.',
        preview:
          'En preview se muestra como checklist conservando el estado marcado de cada elemento.',
      },
      quote: {
        title: 'Cita',
        description: 'Bloque de cita con texto y leyenda opcional.',
        preview:
          'En preview se muestra como cita estilizada con leyenda bajo el texto.',
      },
      delimiter: {
        title: 'Separador',
        description: 'Separador visual simple entre secciones de contenido.',
        preview: 'En preview se muestra como una línea divisoria horizontal.',
      },
      table: {
        title: 'Tabla',
        description:
          'Tabla simple para datos compactos en filas y columnas.',
        preview:
          'En preview se muestra como tabla responsive con los datos guardados de Editor.js.',
      },
      embed: {
        title: 'Insertar',
        description:
          'Bloque de medios embebidos para YouTube, Vimeo, Rutube, VK Video, Twitch y Coub.',
        preview:
          'En preview se muestra como iframe inline u opener de Fancybox según los tunes del bloque.',
      },
      image: {
        title: 'Imagen',
        description:
          'Bloque de imagen para URL o imágenes locales de draft con leyenda.',
        preview:
          'En preview se muestra como imagen con caption opcional y fallback alt seguro.',
      },
      rawHtml: {
        title: 'HTML sin procesar',
        description:
          'Escape hatch trusted admin-only para marcado HTML personalizado.',
        preview:
          'En preview renderiza HTML con el modo renderer safe o unsafe configurado.',
      },
    },
    tools: {
      notice: {
        description:
          'Bloque breve destacado para mensajes informativos, de éxito o de advertencia.',
        preview:
          'En preview se muestra como un aviso acentuado con título y texto opcionales.',
      },
      sectionIntro: {
        description:
          'Bloque introductorio de sección con título simple y descripción enriquecida.',
        preview:
          'En preview se muestra como un grupo compacto de título antes de una sección.',
      },
      twoColumns: {
        description:
          'Bloque compuesto con dos columnas rich independientes y controles de diseño.',
        preview:
          'En preview se muestra como columnas responsive iguales, izquierda ancha o derecha ancha.',
      },
      mediaGallery: {
        description:
          'Colección de medios para tarjetas de imagen o vídeo en cuadrícula o slider.',
        preview:
          'En preview muestra tarjetas de galería con visor Fancybox opcional y sincronización URL.',
      },
      maskedFieldsDemo: {
        description:
          'Bloque demo-only con máscaras para formatos comunes de campos simples.',
        preview:
          'En preview muestra teléfono, fecha, hora, precio, tarjeta y email guardados.',
      },
      cta: {
        description:
          'Botón independiente para enlaces seguros o eventos personalizados tipados.',
        preview:
          'En preview se muestra como botón CTA principal, secundario o discreto.',
      },
      codeSnippet: {
        description:
          'Bloque de código tipado con selección de lenguaje y leyenda opcional.',
        preview:
          'En preview se muestra como código resaltado si el lenguaje está soportado.',
      },
      accordionGroup: {
        description:
          'Grupo desplegable con encabezados rich y contenido anidado.',
        preview:
          'En preview se muestra como acordeones accesibles con estado local y animación de altura.',
      },
    },
  },
  tunes: {
    anchor: {
      title: 'Ancla',
      label: 'Ancla',
      placeholder: 'section-anchor',
      duplicateError: 'Esta ancla ya se usa en otro bloque.',
    },
    label: {
      title: 'Etiqueta',
      label: 'Etiqueta',
      placeholder: 'Título del sidebar',
    },
    spacing: {
      title: 'Espaciado',
      topLabel: 'Superior',
      bottomLabel: 'Inferior',
      options: {
        none: 'Ninguno',
        small: 'Pequeño',
        medium: 'Medio',
        large: 'Grande',
      },
    },
    animation: {
      title: 'Animación',
      label: 'Aparición',
      options: {
        none: 'Ninguna',
        'fade-up': 'Aparecer hacia arriba',
        'fade-left': 'Desde la izquierda',
        'fade-right': 'Desde la derecha',
      },
    },
    embedDisplay: {
      title: 'Visualización embed',
      label: 'En Fancybox',
      options: {
        inline: 'En la página',
        fancybox: 'En Fancybox',
      },
    },
  },
  validation: {
    fieldLabels: {
      noticeTitle: 'Título',
      noticeText: 'Texto',
      sectionIntroTitle: 'Título',
      galleryId: 'ID de galería',
      mediaAlt: 'Texto alt',
      mediaCaption: 'Leyenda',
      ctaLabel: 'Texto del botón',
      ctaIcon: 'Icono del botón',
      ctaEventName: 'Nombre del evento',
      ctaEventPayloadJson: 'Payload JSON',
      codeSnippetCode: 'Código',
      codeSnippetCaption: 'Leyenda',
      rawHtml: 'HTML',
      accordionHeader: 'Encabezado del acordeón',
    },
    contentValidationFallback: 'El contenido tiene errores de validación.',
    contentValidationSummary: (count) =>
      `El contenido tiene ${count} errores de validación.`,
    noticeContentRequired: 'Añada un título o texto.',
    sectionIntroContentRequired: 'Añada un título o descripción.',
    twoColumnsContentRequired: 'Añada contenido en al menos una columna.',
    mediaCardsRequired: 'Añada al menos una tarjeta multimedia.',
    galleryIdPattern: 'Use solo letras, números, guiones y guiones bajos.',
    mediaUrlRequired: 'La URL del medio es obligatoria.',
    mediaUrlInvalid:
      'Use una URL http, relativa, blob, data image o data video válida.',
    mediaAltRequired: 'El texto alt es obligatorio para imágenes.',
    ctaLabelRequired: 'El texto del botón es obligatorio.',
    ctaUrlRequired: 'La URL es obligatoria.',
    ctaUrlInvalid:
      'Use una URL http, https, mailto, relativa a la raíz o de ancla.',
    ctaIconRequired: 'Elija un icono para el modo de solo icono.',
    ctaIconInvalid: 'Elija un icono del sprite generado.',
    ctaEventNameRequired: 'El nombre del evento es obligatorio.',
    ctaEventNameInvalid:
      'Use solo letras, números, guiones, guiones bajos y dos puntos.',
    ctaEventPayloadJsonInvalid: 'Introduzca JSON válido.',
    ctaEventPayloadJsonObjectRequired:
      'El valor raíz del payload debe ser un objeto JSON.',
    codeSnippetCodeRequired: 'El código es obligatorio.',
    rawHtmlRequired: 'El HTML es obligatorio.',
    accordionItemsRequired: 'Añada al menos un elemento del acordeón.',
    accordionItemContentRequired: 'Añada un encabezado o contenido.',
    maxLength: (label, maxLength) =>
      `${label} debe tener ${maxLength} caracteres o menos.`,
  },
  editorJs: {
    messages: {
      ui: {
        blockTunes: {
          toggler: {
            'Click to tune': 'Haga clic para configurar',
            'or drag to move': 'o arrastre para mover',
          },
        },
        inlineToolbar: {
          converter: {
            'Convert to': 'Convertir a',
          },
        },
        toolbar: {
          toolbox: {
            Add: 'Añadir',
          },
        },
      },
      toolNames: {
        Text: 'Texto',
        Heading: 'Título',
        List: 'Lista',
        'Ordered List': 'Lista numerada',
        'Unordered List': 'Lista con viñetas',
        Checklist: 'Checklist',
        Quote: 'Cita',
        Delimiter: 'Separador',
        Table: 'Tabla',
        Image: 'Imagen',
        Embed: 'Insertar',
        'Raw HTML': 'HTML sin procesar',
      },
      tools: {
        warning: {
          Title: 'Título',
          Message: 'Mensaje',
        },
        link: {
          'Add a link': 'Añadir un enlace',
        },
        List: {
          Unordered: 'Viñetas',
          Ordered: 'Numerada',
          Checklist: 'Checklist',
          'Start with': 'Empezar con',
          'Counter type': 'Tipo de contador',
          Numeric: 'Numérico',
          'Lower Roman': 'Romanos minúsculos',
          'Upper Roman': 'Romanos mayúsculos',
          'Lower Alpha': 'Letras minúsculas',
          'Upper Alpha': 'Letras mayúsculas',
        },
        stub: {
          'The block can not be displayed correctly.':
            'El bloque no se puede mostrar correctamente.',
        },
      },
      blockTunes: {
        delete: {
          Delete: 'Eliminar',
          'Click to delete': 'Haga clic para eliminar',
        },
        moveUp: {
          'Move up': 'Mover arriba',
        },
        moveDown: {
          'Move down': 'Mover abajo',
        },
      },
    },
  },
}
