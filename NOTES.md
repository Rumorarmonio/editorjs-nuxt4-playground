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
- Инструменты контроля кода (`ESLint`, `Prettier`, `Stylelint`, `Husky`) настроены в начале проекта, раньше отдельного code quality этапа из первоначального плана.
- Деплой на GitHub Pages настроен досрочно: при push в репозиторий GitHub Actions собирает статический Nuxt output и публикует `.output/public`.
- Создан базовый доменный каркас: OutputData-compatible типы, типы стандартных блоков, registry-основа, `content/default-page.json` и draft-source helpers.
- Первый простой custom block `Notice` реализован и проверен.
- Реализованы editor shell и preview shell: главная страница загружает `localStorage` draft с fallback на `content/default-page.json`, инициализирует настоящий `Editor.js` этими данными, сохраняет результат `editor.save()` в draft, а `/preview` показывает те же данные через отдельный renderer-компонент.
- Страницы и Vue-компоненты размещаются в отдельных директориях вместе со своими модульными `SCSS`-файлами.
- Базовая версия проекта завершена.
- Базовый слой Block Tunes (`AnchorTune`, `SpacingTune`, `LabelTune`) завершён: реализация, renderer, guard, demo JSON, ручная browser-проверка и `npm run check` готовы.
- Plain field system для будущих custom blocks завершена.
- Активный scope по `SPEC.md`: reusable rich fields после первого успешного nested editor scenario завершены; следующий крупный этап — composite blocks / `TwoColumns`.
- Первый custom block `Notice` подтвердил полный custom block lifecycle на простых plain fields без раннего перехода к media workflow, rich fields или nested Editor.js.
- Следующий этап детализирован как reusable rich fields: `RichParagraphField` и `RichHeaderField` на базе nested Editor.js.
- Для `SectionIntro` добавлен минимальный shared-контракт данных: `title` и `description` как вложенный Editor.js-compatible output только с paragraph-блоками.
- Для `SectionIntro` добавлен минимальный helper `createNestedParagraphEditor`: он создаёт один nested `Editor.js` instance с paragraph-only content, общими inline tools, `save()` через normalizer и явным `destroy()`.
- Реализация `SectionIntro` завершена: tool class подключён в Editor.js toolbox, renderer отображает plain title и nested paragraph content, draft guard принимает корректные вложенные данные, demo content добавлен в `content/default-page.json`; `npm run check` проходит.
- Этап первого nested editor block / single-purpose rich field завершён: ручная browser-проверка подтвердила lifecycle `SectionIntro`, export JSON и reset draft; дополнительно исправлены конфликты `Enter` и z-index dropdown/tune между внешним и вложенным Editor.js.
- Этап reusable rich fields завершён: проверенный nested editor lifecycle вынесен в `RichParagraphField` и `RichHeaderField` без изменения публичной схемы данных `SectionIntro`; ручная browser-проверка подтвердила работу.

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
- Plain field system должна жить в `editor/admin/fields`, быть reusable для будущих custom block tools и не должна тянуть Vue runtime внутрь Editor.js tool classes.
- Plain fields не должны поддерживать inline tools; если полю нужен rich text, это будущий rich field/nested editor scenario.
- Toggle в custom editor UI должен сохраняться как boolean, даже если визуально отображается как переключатель.
- Image-oriented fields для будущих custom blocks должны предусматривать явный `alt`, но полноценный media workflow остаётся отдельным поздним этапом.
- Отдельный visible usage harness для plain fields не добавлялся; первое runtime-использование и ручная проверка выполнены в рамках первого custom block.
- Первый простой custom block реализуется на примере `Notice` с полями `title`, `text`, `type`; CTA/Banner/media-сценарии остаются следующими custom block расширениями, а не частью первого шага.
- Первый nested editor scenario реализуется на примере `SectionIntro`, а не `TwoColumns`: на этом этапе нужен только один nested Editor.js instance как single-purpose rich paragraph field.
- Reusable `RichParagraphField` / `RichHeaderField` реализованы как текущий активный этап после проверки первого nested editor lifecycle.

## Что уже сделано

- Подготовлена подробная техническая спецификация проекта в `SPEC.md`.
- Зафиксированы правила работы агента и формат ведения проектных заметок.
- На текущем шаге спецификация преобразована в краткий рабочий контекст и реализационный план.
- Реализован первый bootstrap-этап: `package.json`, `nuxt.config.ts`, `tsconfig.json`, `app/app.vue`, стартовая `index`-страница, SCSS-инфраструктура и ранняя структура каталогов.
- Установлены базовые версии `nuxt@4.4.2`, `typescript@6.0.3`, `sass@1.99.0`; `npm run build` проходит успешно.
- Досрочно настроены `ESLint`, `Prettier` и `Stylelint`, добавлены npm scripts для проверки и автоисправления, проверки `npm run lint`, `npm run stylelint`, `npm run format:check` и `npm run typecheck` проходят успешно.
- Настроен `Husky`: добавлен `prepare` script, создан `.husky/pre-commit`, hook запускает `npm run check` с `ESLint`, `Stylelint` и `nuxt typecheck`.
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
- На preview-странице добавлены UX-действия базовой версии: `Export JSON` скачивает текущий `OutputData`, а `Reset draft` очищает `localStorage` draft и возвращает renderer к `content/default-page.json`.
- Первый базовый этап закрыт полностью: функциональная база Editor.js + renderer + local draft workflow + экспорт/сброс + code quality tooling + Husky + GitHub Pages deployment готовы.
- Завершён этап базовых Block Tunes: добавлены `AnchorTune`, `SpacingTune` и `LabelTune`, shared-нормализация/проверка tune data, renderer-обработка `anchor` / `spacing` / `label`, демонстрационные tune examples в `content/default-page.json`; ручная browser-проверка подтвердила `save/load`, preview/render, reset draft и export JSON на блоках с tune data и без них.
- Подготовлен план следующего этапа Plain field system: field wrapper, text input, textarea, select, radio group, toggle и базовый image/url/file-oriented контракт без перехода к custom blocks.
- Завершён этап Plain field system: добавлен `editor/admin/fields` с общим контрактом, DOM wrapper helpers, text/URL input, textarea, select, radio group, boolean toggle и file/image-oriented value contracts с обязательным `alt` для image value; стили добавлены через `editor-plain-field*` классы в editor shell.
- Завершён первый вертикальный срез `Notice`: добавлены shared type/normalization, регистрация block type, Editor.js tool на plain fields (`title`, `text`, `type`), renderer-отображение, draft guard и demo block в `content/default-page.json`; ручная browser-проверка подтвердила create -> edit -> save -> reload -> render, export JSON и reset draft; `npm run check` проходит.
- Проект переведён к следующему этапу: первый nested editor block / single-purpose rich field.
- Детализирован план активного этапа: реализовать `SectionIntro` с plain title и одним nested rich paragraph field, ограниченным paragraph tool и проверкой create/edit/save/reload/render/destroy.
- Реализован первый шаг активного этапа: добавлены shared-типы `SectionIntro`, normalizer/guard для вложенного paragraph-only output и registry entry. Draft-source guard начнёт принимать `SectionIntro` после подключения tool и renderer, чтобы не допускать частично поддержанный блок в runtime.
- Реализован helper активного этапа: добавлен `editor/admin/nested-editor/createNestedParagraphEditor` для lazy initialization, сохранения и уничтожения одного nested paragraph editor instance без общей reusable rich field abstraction.
- Реализован оставшийся срез активного этапа: `SectionIntroTool` создаёт plain title field и один nested paragraph editor, подключён в `editor/admin/config/editor-tools.ts`, renderer рекурсивно выводит вложенный paragraph-only output, draft-source guard теперь пропускает `sectionIntro`, а default content содержит demo block.
- Завершён этап первого nested editor block / single-purpose rich field: ручная browser-проверка подтвердила create/edit/save/reload/render/destroy, export JSON и reset draft; вложенный editor изолирует keyboard events от внешнего editor, а dropdown/tune внешнего editor отображаются выше nested editor.
- Проект переведён к этапу reusable rich fields: активный план теперь сфокусирован на `RichParagraphField`, `RichHeaderField`, общем lifecycle nested rich fields и сохранении совместимости `SectionIntro`.
- Реализован этап reusable rich fields: добавлены shared-типы и normalizers для `RichParagraphFieldData` / `RichHeaderFieldData`, общий `createNestedRichEditor`, field controls `createRichParagraphField` / `createRichHeaderField`, renderer helper для rich field content; `SectionIntroTool` теперь использует `RichParagraphField`, а `npm run check` проходит.
- Ручная browser-проверка reusable rich fields завершена: `SectionIntro` проходит create/edit/save/reload/render/destroy, inline formatting во вложенном description, export JSON и reset draft.

## Текущие проблемы / открытые вопросы

- Ручная browser-проверка подтвердила работу inline tools в стандартных rich text блоках; отдельная проблема embed caption закрыта через wrapper, inline toolbar и renderer iframe.
- Runtime-удобство plain fields проверено на реальном custom block `Notice`; отдельный demo harness на этапе plain fields не добавлялся.
- Формат первого nested editor block выбран и проверен: `SectionIntro` одновременно закрыл первый single-purpose rich field.
- Минимальный helper для create/destroy nested Editor.js instance выбран и реализован как single-purpose `createNestedParagraphEditor`; текущий этап должен превратить этот опыт в небольшую reusable rich field abstraction.
- Для текущего этапа выбрано минимальное обобщение: reusable field lifecycle для `RichParagraphField` / `RichHeaderField`, без преждевременного перехода к composite block manager.
- Полноценный media workflow с backend/upload storage остаётся поздним этапом; текущий image upload рассчитан только на локальный draft workflow.
- Для user/organization pages репозитория вида `<name>.github.io` может потребоваться задать repository variable `NUXT_APP_BASE_URL=/`, потому что workflow по умолчанию использует project pages path `/<repository-name>/`.

## Критичные риски

- Раннее добавление кастомных блоков и nested editors до стабилизации save/load усложнит архитектуру и отладку.
- Некачественный выбор inline/list plugins может привести к нестабильному JSON и регрессиям при повторной загрузке.
- Смешение editor-layer и renderer-layer на старте усложнит дальнейшее расширение и тестирование.
- Поспешная стилизация без токенов и CSS variables усложнит позднее добавление theme layer.

## Следующий шаг

Следующий шаг: перевести план к composite blocks / `TwoColumns` и определить минимальный scope первого многоконтейнерного nested block.
