/** @type {import('stylelint').Config} */
export default {
  //region Base Config
  // Базовая конфигурация с поддержкой SCSS + Vue SFC
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recommended-vue'],

  // Подключаем плагины для SCSS и порядка свойств
  plugins: ['stylelint-scss', 'stylelint-order'],
  //endregion

  //region Parsing / Syntax
  overrides: [
    // Чтобы корректно линтить <style> внутри .vue
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },

    // Чтобы корректно линтить стили в html (если в проекте есть .html)
    {
      files: ['**/*.html'],
      customSyntax: 'postcss-html',
    },

    // Чтобы отдельные .scss файлы парсились как SCSS
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
    },
  ],
  //endregion

  //region Disable Reports
  // Эти репорты полезны, когда начинаешь использовать stylelint-disable комментарии,
  // чтобы конфиг и исключения не превращались в "молчаливую" помойку.
  reportDescriptionlessDisables: true,
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
  //endregion

  rules: {
    //region Organization / Structure
    // ОРГАНИЗАЦИЯ СТИЛЕЙ И БЛОКОВ
    // Максимальная глубина вложенности (например, в BEM)
    'max-nesting-depth': 5,

    // Максимум комбинированных селекторов в одном правиле
    'selector-max-compound-selectors': 3,

    // Заставляет использовать десятичные дроби (0.5), а не проценты (50%)
    'alpha-value-notation': 'number',
    //endregion

    //region Vue SFC specifics
    // Разрешить псевдоклассы для CSS-модулей и Vue SFC (scoped)
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'deep', 'slotted', 'v-deep', 'v-global', 'v-slotted'],
      },
    ],

    // Иногда Vue-специфика встречается и в виде псевдоэлементов
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted'],
      },
    ],
    //endregion

    //region SCSS Patterns
    // ПАТТЕРНЫ ДЛЯ SCSS
    // название миксинов
    'scss/at-mixin-pattern': '^[_a-z]+([a-z0-9-]+)*$',
    // переменные SCSS
    'scss/dollar-variable-pattern': '^[a-z0-9-]+$',
    // плейсхолдеры (%)
    'scss/percent-placeholder-pattern': '^[a-z0-9-]+$',

    // Разрешаем:
    // - kebab-case и BEM
    // - lowerCamelCase для CSS Modules: stateHeader, stateHeaderActive, etc.
    'selector-class-pattern': [
      '^(-|_)?([0-9a-z]+((--|__|-|_)[a-z0-9]+)*|[a-z][a-z0-9]*([A-Z][a-z0-9]*)+)$',
      {
        message:
          'Ожидается kebab-case/BEM или camelCase для CSS Modules (например: .block__element--mod, .block__element_mod, ._mod, .stateHeader)',
      },
    ],
    //endregion

    //region Disabled rules
    // Отключаем некоторые строгие проверки
    'scss/double-slash-comment-empty-line-before': null,
    'scss/double-slash-comment-whitespace-inside': null,
    'scss/comment-no-empty': null,
    'scss/dollar-variable-empty-line-before': null,
    'no-descending-specificity': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'block-no-empty': null,
    'at-rule-empty-line-before': null,
    'custom-property-empty-line-before': null,
    'no-empty-source': null,
    //endregion

    //region Order in SCSS blocks
    // ПОРЯДОК БЛОКОВ В SCSS-ФАЙЛАХ
    'order/order': [
      // CSS-переменные
      'custom-properties',
      // SCSS-переменные
      'dollar-variables',

      // @use и @forward (важно держать сверху, чтобы порядок импортов был стабильным)
      { type: 'at-rule', name: 'use' },
      { type: 'at-rule', name: 'forward' },

      {
        type: 'at-rule',
        name: 'extend', // @extend
      },
      {
        type: 'at-rule',
        name: 'include', // @include без блока
        hasBlock: false,
      },

      // CSS-свойства
      'declarations',

      {
        type: 'at-rule',
        name: 'include', // @include с блоком
        hasBlock: true,
      },

      // Вложенные правила
      'rules',
      // @media и прочее
      'at-rules',
    ],
    //endregion

    //region Properties order
    // ПОРЯДОК CSS-СВОЙСТВ
    'order/properties-order': [
      // Позиционирование
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',

      // Flexbox и Grid
      'display',
      'flex',
      'flex-grow',
      'flex-shrink',
      'flex-basis',
      'flex-direction',
      'flex-wrap',
      'align-items',
      'justify-content',
      'align-content',
      'gap',
      'row-gap',
      'column-gap',
      'grid',
      'grid-area',
      'grid-template',
      'grid-template-areas',
      'grid-template-rows',
      'grid-template-columns',
      'grid-auto-rows',
      'grid-auto-columns',
      'grid-auto-flow',
      'grid-column',
      'grid-column-start',
      'grid-column-end',
      'grid-row',
      'grid-row-start',
      'grid-row-end',

      // Размеры и отступы
      'box-sizing',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'overflow',
      'overflow-x',
      'overflow-y',

      // Шрифт и текст
      'font',
      'font-family',
      'font-size',
      'font-weight',
      'line-height',
      'letter-spacing',
      'text-align',
      'text-transform',
      'text-decoration',
      'white-space',
      'color',

      // Фон
      'background',
      'background-color',
      'background-image',
      'background-size',
      'background-position',
      'background-repeat',

      // Границы
      'border',
      'border-width',
      'border-style',
      'border-color',
      'border-radius',
      'box-shadow',

      // Анимации и трансформации
      'transform',
      'transition',
      'animation',

      // Прочее
      'opacity',
      'visibility',
      'cursor',
      'pointer-events',
      'user-select',
    ],
    //endregion
  },
}
