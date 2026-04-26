# Рабочие заметки проекта

## Проект

Standalone `Nuxt 4` + `Vue 3` + `TypeScript` проект для отработки архитектуры визуального редактора контента на базе `Editor.js` с отдельным renderer-слоем и статическим деплоем на GitHub Pages.

## Цель

Собрать устойчивую frontend-основу для editor-layer и renderer-layer без бэкенда:

- редактирование контента в `Editor.js`;
- сохранение и повторная загрузка `OutputData` JSON;
- preview/render на отдельной странице;
- локальный draft через `localStorage`;
- подготовка к кастомным блокам, inline tools, tunes, nested editors и поздним UX-слоям без ломки модели данных.

## Текущее состояние

- Подготовлен минимальный bootstrap `Nuxt 4` приложения с `app/`-структурой, `Vue 3`, `TypeScript` и `SCSS`.
- Созданы ранние инфраструктурные каталоги `app/`, `editor/`, `content/`, `shared/`, `public/`, `server/` без бизнес-логики редактора.
- Подключён глобальный SCSS entrypoint и подготовлен слой SCSS-токенов для использования в отдельных `.module.scss` файлах.
- Инструменты контроля кода (`ESLint`, `Prettier`, `Stylelint`) настроены в начале проекта, раньше отдельного code quality этапа из первоначального плана.
- Деплой на GitHub Pages настроен досрочно: при push в репозиторий GitHub Actions собирает статический Nuxt output и публикует `.output/public`.
- Создан базовый доменный каркас: OutputData-compatible типы, типы стандартных блоков, registry-основа, `content/default-page.json` и draft-source helpers.
- Кастомные блоки пока не реализованы.
- Реализованы editor shell и preview shell: главная страница загружает `localStorage` draft с fallback на `content/default-page.json`, инициализирует настоящий `Editor.js` этими данными, сохраняет результат `editor.save()` в draft, а `/preview` показывает те же данные через отдельный renderer-компонент.
- Страницы и Vue-компоненты размещаются в отдельных директориях вместе со своими модульными `SCSS`-файлами.

## Ключевые решения

- Текущий проект остаётся `static/prerender` Nuxt-проектом и не должен превращаться в полноценную CMS.
- Основной источник требований: `SPEC.md`.
- Базовый стек: `Nuxt`, `Vue 3`, `Composition API`, `TypeScript`, `Editor.js`, `SCSS`.
- Архитектура с раннего этапа должна разделять `editor/shared`, `editor/admin`, `editor/renderer`, а app-level код держать в `app/`.
- Базовая модель данных должна опираться на JSON, совместимый с `Editor.js OutputData`, и единый registry блоков.
- Для первой версии обязательны: editor со стандартными block tools и inline tools, `localStorage` draft, preview/render страница, `Export JSON`, `Reset draft`.
- Кастомизация начинается только после того, как стабильно работают save/load и renderer стандартных блоков.
- Renderer должен быть отделён от editor runtime и рендерить блоки по `block.type` через типизированный mapping.
- Стили компонентов должны в первую очередь строиться на модульных `SCSS`-файлах; глобальный слой допустим только как инфраструктурный.
- Поздние слои (`i18n`, theme switching, accessibility polish, validation, masks, sidebar navigation) не должны менять content schema.
- Проект должен быть совместим со static deployment на GitHub Pages.
- Для GitHub Pages используется client-side rendering (`ssr: false`) и `nuxt generate`; base path задаётся через `NUXT_APP_BASE_URL`, а в workflow по умолчанию равен `/<repository-name>/`.
- Форматирование отвечает за `Prettier`; конфликтующие форматные правила `ESLint` отключаются через `eslint-config-prettier`.
- `SPEC.md` исключён из `Prettier`, чтобы не создавать большой нерелевантный diff в исходном документе требований.
- Корневой `tsconfig.json` явно включает `editor/**/*`, чтобы ESLint project service и `nuxt typecheck` проверяли доменный editor-слой вне `app/`.

## Что уже сделано

- Подготовлена подробная техническая спецификация проекта в `SPEC.md`.
- Зафиксированы правила работы агента и формат ведения проектных заметок.
- На текущем шаге спецификация преобразована в краткий рабочий контекст и реализационный план.
- Реализован первый bootstrap-этап: `package.json`, `nuxt.config.ts`, `tsconfig.json`, `app/app.vue`, стартовая `index`-страница, SCSS-инфраструктура и ранняя структура каталогов.
- Установлены базовые версии `nuxt@4.4.2`, `typescript@6.0.3`, `sass@1.99.0`; `npm run build` проходит успешно.
- Досрочно настроены `ESLint`, `Prettier` и `Stylelint`, добавлены npm scripts для проверки и автоисправления, проверки `npm run lint`, `npm run stylelint`, `npm run format:check` и `npm run typecheck` проходят успешно.
- Досрочно реализован GitHub Pages deployment: добавлен workflow `.github/workflows/deploy-pages.yml`, Nuxt переключён на статический SPA-вывод, добавлен `.nojekyll` для корректной отдачи `_nuxt` assets.
- Реализован этап shared-слоя и registry: добавлены доменные типы editor output, block data map, типизированный registry, entity/navigation-типы, draft-source helpers и статический `content/default-page.json`.
- Из временных примеров перенесены только рабочие подходы: generic `EditorBlock<TType>`, базовые media/section entities и helper `createEditorContentData`; директория `editor/shared/example` удалена как справочный материал.
- Draft-source guard теперь принимает из `localStorage` только OutputData-like JSON с block types, известными текущему registry, и минимально проверяет структуру `data` для стандартных блоков.
- Реализован первый UI workflow с Editor.js runtime: `app/pages/index/index.vue` монтирует `EditorJS`, `app/pages/preview/index.vue` рендерит текущий источник, общий composable `useEditorContentSource` держит приоритет `localStorage` draft -> `content/default-page.json`.
- Перед переходом в preview текущие данные редактора сохраняются через `editor.save()`, а статус сохранения сбрасывается при новых изменениях в Editor.js.
- Draft-source guard теперь дополнительно проверяет минимальную структуру `data` для текущих стандартных блоков, чтобы повреждённый `localStorage` draft не ломал preview.
- Данные передаются в `Editor.js` как plain JSON clone, а не Vue reactive proxy; это важно для `@editorjs/list`, который при загрузке сохранённого list data использует `structuredClone`.
- Renderer поддерживает рекурсивный вывод nested list items.
- Выбраны и подключены версии `Editor.js` и стандартных block tools: `@editorjs/editorjs@2.31.6`, `@editorjs/header@2.8.8`, `@editorjs/list@2.0.9`, `@editorjs/quote@2.7.6`, `@editorjs/delimiter@1.4.2`, `@editorjs/table@2.4.5`, `@editorjs/embed@2.7.6`, `@editorjs/image@2.10.3`.
- Подключены стандартные inline tools: built-in `bold` / `italic` / `link`, а также `@editorjs/marker@1.4.0`, `@editorjs/underline@1.2.1`, `@editorjs/inline-code@1.5.2` и `@sotaproject/strikethrough@1.0.1`.
- `@gabbydgab/editorjs-strikethrough@1.0.1` не используется, потому что опубликованный npm-пакет не содержит `dist/bundle.js`, указанный в `main`.
- Inline toolbar включён на уровне Editor.js для default paragraph, а также явно для header, list, quote, table, image и embed caption; delimiter не имеет rich text полей.
- Renderer выводит inline HTML через allowlist sanitizer для `a`, `b`, `i`, `u`, `mark`, `s`, `span.inline-code` и `code`, чтобы preview показывал сохранённые inline tools без произвольной HTML-разметки.
- Для image `alt` renderer использует явный `alt` или plain-text версию caption без inline HTML.
- Для `@editorjs/embed` используется версия `2.7.6`, потому что `2.8.0` требует Node `>=24`, а текущая среда проекта работает на Node `22.14.0`.
- Добавлен локальный declaration для `@editorjs/embed`, потому что пакет содержит `dist/index.d.ts`, но не экспортирует types через `package.json exports`.
- Image tool работает без бэкенда в локальном draft workflow: файлы сохраняются как Data URL, URL-изображения сохраняются напрямую.
- `content/default-page.json` расширен демонстрационными блоками для header уровней 1-4, paragraph, nested list, quote, delimiter, table, embed и image, включая базовые комбинации inline tools.
- Для `embed` добавлен локальный wrapper над стандартным `@editorjs/embed`: блок можно создать из toolbox и вставить URL поддержанного сервиса вручную; paste-substitution логика стандартного Embed tool ограничена тем же списком сервисов.
- Поддерживаемые embed-сервисы вынесены в shared registry: YouTube, Vimeo и Coub. Editor использует registry для создания embed data, renderer — для allowlist-проверки iframe URL; caption поддерживает сохранённые inline tools.
- Для static deployment добавлен prerender route `/preview`, чтобы preview-страница генерировалась вместе с главной страницей.
- Страницы `index` и `preview`, а также текущие editor/renderer-компоненты перенесены в собственные директории рядом со своими `*.module.scss`.

## Текущие проблемы / открытые вопросы

- Ручная browser-проверка подтвердила работу inline tools в стандартных rich text блоках; отдельная проблема embed caption закрыта через wrapper, inline toolbar и renderer iframe.
- Полноценный media workflow с backend/upload storage остаётся поздним этапом; текущий image upload рассчитан только на локальный draft workflow.
- Для user/organization pages репозитория вида `<name>.github.io` может потребоваться задать repository variable `NUXT_APP_BASE_URL=/`, потому что workflow по умолчанию использует project pages path `/<repository-name>/`.

## Критичные риски

- Раннее добавление кастомных блоков и nested editors до стабилизации save/load усложнит архитектуру и отладку.
- Некачественный выбор inline/list plugins может привести к нестабильному JSON и регрессиям при повторной загрузке.
- Смешение editor-layer и renderer-layer на старте усложнит дальнейшее расширение и тестирование.
- Поспешная стилизация без токенов и CSS variables усложнит позднее добавление theme layer.

## Следующий шаг

Следующий крупный шаг: перейти к renderer UX-действиям `Export JSON` / `Reset draft`.
