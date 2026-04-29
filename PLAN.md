# План реализации

## Проект

`Nuxt 4` playground для визуального редактора контента на `Editor.js` с отдельными editor-layer и renderer-layer, статическим JSON-источником и GitHub Pages
deployment.

## Текущий статус

- Базовая версия редактора завершена.
- Базовый слой Block Tunes завершён.
- Plain field system завершён.
- Первый простой custom block завершён.
- Первый nested editor block / первый single-purpose rich field завершён.
- Reusable rich fields завершены.
- Composite blocks / `TwoColumns` завершён.
- Custom inline tools завершён.
- Media gallery / slider block завершён.
- Sidebar navigation из JSON завершён.
- Import JSON завершён.
- Валидация завершена.
- Masks завершён.
- Активный этап: Локализация UI редактора завершён.

## Активный этап

### Локализация UI редактора

Статус: завершён.

Цель этапа: подключить минимальный слой локализации UI редактора и editor shell на `ru/en` без изменения content JSON schema.

В scope входят:

1. Подключение `vue-i18n` на уровне Nuxt/Vue-приложения.
2. Создание словарей `ru/en` для editor shell и editor-related UI strings.
3. Подготовка Editor.js `i18n.messages` через общий mapping.
4. Перенос строк editor shell, tools, tunes и custom field UI в локализуемые словари без изменения content JSON.
5. Минимальный сценарий смены языка: сохранить текущий editor state, пересоздать Editor.js instance и не потерять draft.

Вне scope этапа:

- многоязычный content model и хранение нескольких языковых версий контента;
- обязательный бесшовный live switch без переинициализации Editor.js;
- light/dark theme;
- расширенная keyboard navigation и accessibility polish;
- изменение content JSON schema.

## План этапа

1. Проанализировать текущие hardcoded UI strings в app shell, Editor.js config, custom tools, tunes и field builders — выполнено.
2. Спроектировать минимальную структуру словарей `i18n/locales` и `i18n/editor` без преждевременной CMS-локализации — выполнено.
3. Подключить `vue-i18n` к Nuxt и добавить locale state/switcher на уровне app/editor shell — выполнено.
4. Передать локаль и словари в `createEditorConfig`, tools, tunes и field builders — выполнено.
5. Реализовать сохранение текущего editor state перед пересозданием Editor.js при смене языка — выполнено.
6. Проверить `ru/en` UI, save/load, preview, Import JSON, validation errors, masks demo block, `Reset draft` и `Export JSON` — выполнено через `npm run check`, `npm run build` и ручную browser-проверку.
7. Запустить `npm run check` — выполнено.

## Критерии готовности этапа

- Editor shell и editor-related UI доступны минимум на русском и английском языках.
- Editor.js получает согласованные `i18n.messages`.
- Custom tools, tunes и plain/rich field UI используют локализуемые строки.
- Смена языка не меняет content JSON schema и не теряет текущий draft.
- Save/load, Import JSON, validation, masks, preview, `Reset draft` и `Export JSON` остаются работоспособными.
- `npm run check` проходит.

Следующий крупный этап после завершения Локализации UI редактора: Light/Dark theme.

Итог: Локализация UI редактора завершена. Добавлена зависимость `vue-i18n`, Nuxt plugin, locale state с сохранением в `localStorage`, словари `ru/en` для app shell и editor UI, Editor.js `i18n.messages` mapping, локализация custom tools, tunes, field UI, validation/import сообщений и переключатели языка на editor/preview страницах. При смене языка editor-страница сохраняет текущий state в draft и пересоздаёт Editor.js с новым словарём. Post-review fixes внесены; ручная browser-проверка подтвердила работоспособность этапа. `npm run check` проходит с существующими предупреждениями `vue/no-v-html`; `npm run build` проходит.

## Последний завершённый этап

### Masks

Статус: завершён.

Цель этапа: определить и реализовать минимально необходимые input masks для текущих plain fields, если в существующем UI есть поля, где маска действительно улучшает
ввод и не ломает данные.

В scope вошли:

1. Анализ текущих plain fields и custom blocks на предмет реально нужных masks.
2. Создание отдельного demo-only custom block для проверки masked field scenarios: phone, date, time, price, card и email.
3. Выбор минимального подхода: без зависимости для slug-like нормализации или `imask`, если demo block подтверждает практическую потребность в настоящих masks.
4. Подключение masks только к релевантным plain fields и demo block без изменения основной content JSON schema.
5. Проверка, что masks не ломают validation, save/load, Import JSON и renderer.

Вне scope этапа остались:

- i18n, theme switching и расширенная keyboard navigation.
- добавление masks "про запас" без реального поля;
- превращение demo masked fields block в доменную фичу основного контента;
- backend validation;
- изменение content JSON schema.

## План этапа

1. Проанализировать текущие поля на наличие phone/date/email/slug-like сценариев, где нужна маска — выполнено.
2. Зафиксировать текущий вывод: в существующих доменных блоках реальный кандидат только slug-like `galleryId`; phone/date/time/price/card/email полей пока нет —
   выполнено.
3. Добавить demo-only custom block `MaskedFieldsDemo` для проверки phone, date, time, price, card и email inputs — выполнено.
4. Решить по результатам demo block, требуется ли `imask` на текущем этапе — выполнено; для demo phone/date/time/price/card/email scenarios подключён `imask`.
5. Если требуется, добавить минимальную интеграцию в plain field system с lifecycle cleanup — выполнено.
6. Проверить UX ввода, save/load, Import JSON, `Reset draft` и `Export JSON` — выполнено; ручная browser-проверка подтверждена.
7. Запустить `npm run check` — выполнено.

## Критерии готовности этапа

- Понятно зафиксировано, какие текущие поля требуют masks и почему.
- Demo-only masked fields block позволяет проверить phone, date, time, price, card и email scenarios без превращения в основную доменную фичу.
- Если masks нужны, они работают только на релевантных plain fields и demo block.
- Masks не меняют content JSON schema.
- Validation, save/load, Import JSON и renderer не ломаются.
- `npm run check` проходит.

Итог: Masks завершён. Добавлена зависимость `imask`, `createPlainTextField` получил опциональную mask-конфигурацию и lifecycle cleanup через `destroy()`. Добавлен
demo-only custom block `maskedFieldsDemo` с полями phone, date, time, price, card и email, поддержкой save/load/import guard и простым renderer-выводом. Demo block
добавлен в `content/default-page.json`, чтобы сценарий был виден в стартовом контенте. `npm run check` проходит с существующими предупреждениями `vue/no-v-html`;
ручная browser-проверка save/load/preview/export/import/reset подтверждена.

Следующий крупный этап после завершения Masks: Локализация UI редактора.

## Предыдущий завершённый этап

### Валидация

Статус: завершён.

Цель этапа: добавить базовую validation policy для plain fields и rich/nested field scenarios, чтобы ошибки отображались предсказуемо и критичные ошибки могли
ограничивать сохранение/экспорт без изменения content JSON schema.

В scope вошли:

1. Минимальный shared validation contract для field-level и content-level ошибок.
2. Базовые правила для текущих custom blocks: required, max length, media URL, image alt и gallery id pattern.
3. Отображение ошибок под plain fields.
4. Отображение ошибок на уровне rich/nested fields как цельных полей.
5. Минимальная block validation для `Notice`, `SectionIntro`, `TwoColumns` и `MediaGallery`.
6. Ограничение save/export при критичных ошибках.
7. Сохранение совместимости Import JSON, `Reset draft` и preview workflow.

Вне scope этапа остались:

- input masks и `imask`;
- глубокая validation schema всей `EditorContentData`;
- адресная проверка внутренних paragraph/header/list blocks внутри nested editors;
- backend validation;
- i18n, theme switching и расширенная keyboard navigation.

## План этапа

1. Проанализировать текущие plain/rich field APIs и места сохранения данных — выполнено.
2. Спроектировать минимальный validation result contract без преждевременного усложнения — выполнено.
3. Реализовать field-level ошибки для plain fields — выполнено.
4. Добавить ошибки для rich/nested fields на уровне поля — выполнено.
5. Подключить минимальную block validation к существующим custom blocks — выполнено.
6. Ограничить save/export при критичных ошибках и показать понятное состояние в UI — выполнено.
7. Проверить основные сценарии — выполнено через `npm run check`; ручная browser-проверка validation UX подтверждена.
8. Запустить `npm run check` — выполнено.

## Критерии готовности этапа

- Plain fields поддерживают базовые ошибки.
- Rich/nested fields показывают ошибки на уровне поля.
- Ошибки отображаются рядом с соответствующим UI и не ломают Editor.js lifecycle.
- Сохранение и экспорт можно ограничить при критичных ошибках.
- Import JSON, `Reset draft` и preview workflow продолжают работать.
- `npm run check` проходит.

Итог: Валидация завершена. Добавлен shared validation layer для текущих custom blocks, field-level ошибки подключены в `Notice`, `SectionIntro`, `TwoColumns` и
`MediaGallery`, editor save и preview export блокируются при критичных ошибках. SVG data URL для существующего demo media content признан допустимым media URL. После
ручной проверки исправлены UX-регрессии: dropdown/delete доступен у невалидных блоков, ошибки очищаются при изменении полей, вложенные editor holders получают
красную рамку при ошибке, а переход на preview доступен даже при content validation errors. `npm run check` проходит; ручная browser-проверка validation UX
подтверждена.

Следующий крупный этап после завершения Валидации: Masks.

## Предыдущий завершённый этап

### Import JSON

Статус: завершён.

Цель этапа: добавить ручной import JSON как поздний utility-сценарий, чтобы пользователь мог подставить внешний `EditorContentData` в editor/localStorage workflow
без бэкенда.

В scope входят:

1. UI-действие для выбора или вставки JSON на editor/preview стороне по текущему UX-паттерну проекта.
2. Парсинг JSON и базовая проверка структуры через существующие guards.
3. Запись валидного imported content в `localStorage` draft.
4. Обновление текущего editor/preview состояния после успешного import.
5. Понятная ошибка для невалидного JSON без падения приложения.
6. Проверка import -> edit -> save -> preview -> reset draft.

Вне scope этапа:

- production validation через `zod`;
- backend persistence;
- page-management admin;
- import media files как upload workflow;
- i18n, theme switching и расширенная keyboard navigation.

## План этапа

1. Проанализировать текущий `useEditorContentSource`, editor save/load workflow и preview actions — выполнено.
2. Выбрать минимальный UX для ручного import JSON без добавления зависимостей — выполнено.
3. Реализовать parse/validate/write draft flow на существующих shared helpers — выполнено.
4. Подключить import action к UI — выполнено.
5. Проверить success/error сценарии, preview, `Reset draft` и `Export JSON` — выполнено; ручная browser-проверка подтверждена.
6. Запустить `npm run check` — выполнено.

## Критерии готовности этапа

- Валидный JSON текущей content schema импортируется и становится draft source.
- Невалидный JSON не ломает приложение и показывает ошибку.
- Imported content открывается в editor и renderer.
- `Export JSON` и `Reset draft` продолжают работать.
- `npm run check` проходит.

Итог: Import JSON завершён. Добавлен shared parse/validate helper на существующем `isKnownEditorContentData`, composable action для записи imported content в
`localStorage` draft, import UI на editor и preview страницах с paste/file сценариями, сообщениями об успехе и ошибках. Editor-страница пересоздаёт `Editor.js` после
успешного import, preview сразу перерисовывает renderer из draft. Review-замечания по несохранённым editor-правкам, reset-сообщениям и чтению файла исправлены.
`npm run check` проходит; ручная browser-проверка подтверждена.

Следующий крупный этап после завершения Import JSON: Валидация.

## Предыдущий завершённый этап

### Sidebar navigation из JSON

Статус: завершён.

Цель этапа: реализовать первую navigation-подсистему, которая строит плоский список ссылок из JSON editor content, используя `AnchorTune` и `LabelTune`, без
сканирования итогового DOM.

В scope входят:

1. Helper в shared/navigation для построения flat navigation из `EditorContentData`.
2. Источник пунктов: блоки с валидным `AnchorTune.anchor` и `LabelTune.label`.
3. Fallback label только если он уже безопасно выводится из JSON блока без DOM-сканирования и лишней эвристики.
4. Renderer/sidebar component для обычного списка anchor-ссылок.
5. Подключение sidebar к preview/render странице без зависимости от editor runtime.
6. Обработка дубликатов anchor по тому же правилу, что использует renderer для block `id`.
7. Demo content уже содержит anchor/label examples; обновлять JSON только если не хватает данных для проверки.
8. Проверка flat navigation, переходов по anchor, `Reset draft` и `Export JSON`.

Вне scope этапа:

- tree navigation на основе уровней заголовков;
- collapse / expand и accordion behavior;
- page-level sidebar options будущего fullstack-проекта;
- Import JSON;
- production validation через `zod`;
- i18n, theme switching и расширенная keyboard navigation.

## План этапа

1. Проанализировать текущие tune helpers, renderer anchor logic и preview layout — выполнено.
2. Спроектировать минимальный `NavigationItem` contract для flat sidebar — выполнено.
3. Реализовать builder из `EditorContentData` с учётом `AnchorTune`, `LabelTune` и duplicate anchors — выполнено.
4. Добавить renderer component для sidebar navigation — выполнено.
5. Подключить sidebar на preview странице рядом с текущим renderer — выполнено.
6. Проверить anchor navigation на default content и draft content — выполнено; ручная browser-проверка подтверждена.
7. Запустить `npm run check` — выполнено.

## Критерии готовности этапа

- Navigation строится из JSON, а не из DOM.
- Flat navigation отображает блоки с `label + anchor`.
- Anchor links ведут к тем же `id`, которые renderer назначает блокам.
- Дубликаты anchor не ломают navigation.
- Sidebar не зависит от editor runtime.
- Базовый preview layout остаётся работоспособным на desktop и mobile.
- `npm run check` проходит.

Итог: sidebar navigation из JSON завершён. Добавлены shared helper для итогового block anchor id, flat navigation builder из `EditorContentData`, renderer/sidebar
component и подключение на preview странице. Navigation строится только из блоков с `AnchorTune.anchor` и `LabelTune.label`; дубликаты anchor получают те же
suffix-id, что и renderer blocks. `npm run check` проходит; ручная browser-проверка подтвердила работоспособность этапа.

Следующий крупный этап после завершения sidebar navigation: Import JSON.

## Предыдущий завершённый этап

### Media gallery / slider block

Статус: завершён.

Цель этапа: реализовать первый обязательный media composite block с режимами `slider` и `gallery`, отдельными media fields для карточек, стабильным save/load/render
и базовым viewer behavior.

В scope вошли:

1. Shared data contract для media block: режим `slider | gallery`, `galleryId`, `enableFancybox`, `syncUrlWithFancybox` и массив карточек.
2. Первый контракт карточки: один media item `image | video`, caption, `alt` для изображений и optional rich description.
3. Custom media fields в editor/admin UI без nested Editor.js для image/video как базового способа работы с media.
4. Block UI для управления карточками: добавление, удаление, изменение порядка и редактирование полей.
5. Editor.js tool class для media gallery / slider block.
6. Renderer component, который отображает `gallery` как сетку карточек, а `slider` через Swiper.
7. Базовая интеграция Fancybox: включение/выключение viewer, группировка по `galleryId` и начальная поддержка URL sync.
8. Draft guard/normalization для нового block type и вложенных media item данных.
9. Demo content в `content/default-page.json`: отдельный gallery example и отдельный slider example.
10. Проверка save/load/render, `Export JSON`, `Reset draft`, Swiper, Fancybox, caption и `alt`.

## План этапа

1. Проанализировать текущие field helpers, rich fields, renderer mapping и image/embed contracts перед выбором минимальной data schema — выполнено.
2. Спроектировать shared-типы и normalizers для media block, media card и media item — выполнено.
3. Подготовить минимальные `createImageField` / `createVideoField` или общий media field helper на базе existing plain field system — выполнено как локальный media
   card UI на plain/rich fields без nested Editor.js для media.
4. Реализовать Editor.js tool UI для настроек блока и управления массивом карточек — выполнено.
5. Подключить media block в Editor.js config/toolbox и draft guard — выполнено.
6. Добавить renderer component для `gallery` режима и `slider` режима на Swiper — выполнено.
7. Добавить базовый Fancybox viewer с группировкой по `galleryId` и начальной URL sync логикой — выполнено.
8. Добавить demo content для проверки preview/reset — выполнено.
9. Проверить create/edit/save/reload/render, reorder/delete cards, export/reset draft, Swiper и Fancybox — выполнено.
10. Запустить `npm run check` — выполнено.

## Критерии готовности этапа

- Media block можно создать из Editor.js toolbox.
- Блок поддерживает режимы `gallery` и `slider`.
- У каждой карточки на первом этапе есть один media item, caption и `alt` для image item.
- Карточки можно добавлять, удалять и менять местами.
- Данные блока сохраняются в JSON и корректно восстанавливаются после reload.
- Renderer отображает `gallery` как сетку и `slider` через Swiper без зависимости от editor runtime.
- Fancybox открывает media items и группирует их по `galleryId`, если viewer включён.
- Базовая URL sync логика не ломает preview и может быть расширена позднее.
- Preview, `Export JSON` и `Reset draft` работают с новым block type.
- `npm run check` проходит.

Итог: первый media gallery / slider block завершён. Добавлены shared-типы и normalizers `MediaGalleryBlockData`, registry entry, draft guard, `MediaGalleryTool`,
renderer-компонент `EditorMediaGalleryBlock`, Swiper/Fancybox styles, зависимости `swiper` и `@fancyapps/ui`, а также отдельные gallery/slider examples в
`content/default-page.json`. `npm run check` и `npm run build` проходят; ручная browser-проверка подтвердила создание и редактирование media block, переключение
`gallery/slider`, add/remove/reorder карточек, save/reload/render, export/reset draft, Swiper navigation и Fancybox viewer.

## Предыдущий завершённый этап

### Custom inline tools

Статус: завершён.

Цель этапа: реализовать кастомный inline tool для цвета текста и проверить его совместимость с уже подключёнными стандартными inline tools, основным editor и
rich/nested editor scenarios.

Выбранный tool: text color inline tool, потому что по `SPEC.md` стандартный `Marker` уже покрывает цвет фона текста, а следующим обязательным расширением должен
стать собственный inline tool для цвета текста.

В scope входят:

1. Минимальный data/rendering contract для text color inline markup: собственная inline-обёртка, CSS class и безопасное хранение цвета.
2. Editor.js inline tool class в `editor/admin/tools/inline` без зависимости от Vue runtime.
3. Ограниченный набор допустимых цветов на первом шаге, чтобы не вводить полноценный color picker и сложную theme-интеграцию раньше времени.
4. Подключение tool в общий inline tools config для максимально возможного числа совместимых стандартных blocks и nested/rich field scenarios.
5. Обновление renderer sanitizer/inline rendering, чтобы preview сохранял text color markup без допуска произвольного HTML.
6. Demo content в `content/default-page.json`, если это нужно для проверки preview/reset.
7. Проверка комбинаций text color с bold, italic, link, underline, marker, strikethrough и несколькими inline tools одновременно.
8. Проверка save/load/reload/render в основном editor и доступных nested/rich editor scenarios, export/reset draft и `npm run check`.

Вне scope этапа:

- полноценный свободный color picker;
- theme switching и отдельная dark/light color policy;
- background/spoiler tunes;
- media gallery / slider block;
- sidebar navigation;
- Import JSON;
- production validation через `zod`;
- i18n и расширенная keyboard navigation.

## План этапа

1. Проанализировать текущую inline tools конфигурацию, sanitizer и rich/nested editor подключение — выполнено.
2. Спроектировать минимальный HTML/data contract для text color inline tool — выполнено.
3. Реализовать inline tool class и ограниченную палитру — выполнено.
4. Подключить tool в основной editor и совместимые nested/rich editor configs — выполнено.
5. Обновить renderer sanitizer и стили для безопасного отображения text color — выполнено.
6. Добавить demo content при необходимости — выполнено.
7. Проверить save/load/render и совместимость с существующими inline tools — выполнено.
8. Запустить `npm run check` — выполнено.

## Критерии готовности этапа

- Text color inline tool доступен в основном editor для совместимых rich text blocks.
- Text color inline tool доступен в rich/nested editor scenarios, где уже подключаются inline tools.
- Tool использует собственную inline-обёртку и CSS class, не мутируя `b`, `i`, `a`, `u`, `mark`, `s` и другие inline-элементы.
- Цвет сохраняется в JSON и корректно восстанавливается после reload.
- Renderer отображает text color без зависимости от editor runtime.
- Sanitizer допускает только ожидаемую безопасную разметку text color.
- Комбинации с bold, italic, link, underline, marker, strikethrough и несколькими inline tools одновременно не ломаются.
- Preview, `Export JSON` и `Reset draft` работают с новым inline markup.
- `npm run check` проходит.

Итог: custom inline tools завершён. Добавлены shared-контракт палитры, Editor.js inline tool, подключение в основной editor и nested/rich editor configs, renderer
sanitizer, стили editor/renderer и demo content. `npm run check` проходит; ручная browser-проверка подтвердила применение text color, корректное отображение в
редакторе и renderer, save/reload/render и совместимость с существующими inline tools.

Следующий крупный этап после завершения custom inline tools: media gallery / slider block.

## Предыдущий завершённый этап

### Composite blocks / `TwoColumns`

Статус: завершён.

Цель этапа: реализовать первый composite block с двумя независимыми nested editor containers и проверить стабильный lifecycle многоконтейнерного блока:
`create -> edit -> save -> reload -> render`.

Выбранный блок: `TwoColumns`, потому что по `SPEC.md` он является первым обязательным composite scenario после nested editor и rich fields. Он проверяет работу
нескольких nested editor instances внутри одного custom block без перехода к media gallery / slider и поздним UX-слоям.

В scope входят:

1. Shared data type для `TwoColumns`, включая `layout`, `isReversed`, `left` и `right`.
2. Отдельные nested editor outputs для левой и правой колонок.
3. Ограниченный whitelist tools внутри колонок: paragraph, header и list, если текущая nested editor инфраструктура позволяет подключить их без лишнего расширения.
4. Editor.js tool class для `TwoColumns` с управлением layout variant и reversed state.
5. Корректный lifecycle двух nested editor instances: create/init, save, reload и destroy.
6. Renderer component для `TwoColumns`, который отображает обе колонки без зависимости от editor runtime.
7. Draft guard/normalization для `TwoColumns` и вложенных данных.
8. Demo content в `content/default-page.json` для проверки preview/reset.
9. Проверка create/edit/save/reload/render, удаления и перемещения блока, export/reset draft и `npm run check`.

Вне scope этапа:

- media gallery / slider block;
- image/media fields внутри composite blocks;
- custom inline color tool;
- production validation через `zod`;
- Import JSON;
- sidebar navigation;
- i18n, theme switching и расширенная keyboard navigation.

## План этапа

1. Спроектировать минимальный JSON-контракт `TwoColumns` и допустимые layout variants — выполнено.
2. Добавить shared type, registry entry и normalization/guard для `TwoColumns` — выполнено.
3. Подготовить helper или локальную конфигурацию nested editor для column content с ограниченным набором tools — выполнено.
4. Реализовать `TwoColumnsTool` с plain controls для layout/reversed state и двумя nested editor holders — выполнено.
5. Подключить `TwoColumns` в Editor.js config/toolbox — выполнено.
6. Добавить renderer component и mapping `block.type -> component` — выполнено.
7. Добавить demo content для проверки preview/reset — выполнено.
8. Проверить lifecycle: create, edit, save, reload, render, destroy, delete/move block, export JSON, reset draft — выполнено.
9. Запустить `npm run check` — выполнено.

## Критерии готовности этапа

- `TwoColumns` можно создать из Editor.js toolbox.
- Блок содержит две независимые колонки с отдельными nested editor outputs.
- Колонки используют ограниченный whitelist tools и не превращаются в полноценный общий editor.
- Данные обеих колонок сохраняются в JSON и корректно восстанавливаются после reload.
- Renderer отображает layout variant и reversed state без зависимости от editor runtime.
- Draft guard не пропускает явно повреждённые вложенные данные и не ломает preview.
- Nested editor instances корректно уничтожаются при destroy блока.
- Preview, `Export JSON` и `Reset draft` работают с новым block type.
- Удаление и перемещение блока не оставляют сломанных nested editor instances.
- `npm run check` проходит.

Итог: `TwoColumns` добавлен как первый composite block. Реализованы shared data contract, normalization/guard, registry entry, Editor.js tool с двумя nested editor
instances, renderer, стили и demo content. `npm run check` проходит; ручная browser-проверка подтвердила create/edit/save/reload/render, удаление и перемещение
блока, export JSON и reset draft.

Следующий крупный этап после завершения `TwoColumns`: custom inline tools.

## Предыдущий завершённый этап

### Plain field system

Статус: завершён.

Итог: подготовлена минимальная reusable plain field system в `editor/admin/fields`; реализованы text/URL input, textarea, select, radio group, boolean toggle и
file/image-oriented value contracts. `npm run check` проходит.

## Завершённый этап

### Первый простой custom block

Статус: завершён.

Цель этапа: реализовать один простой custom block без nested editors и проверить полный цикл `create -> edit -> save -> reload -> render`.

Выбранный первый блок: `Notice`, потому что он проверяет data type, tool class, plain field UI, save/load и renderer без раннего перехода к media workflow, rich
fields или nested Editor.js.

В scope входят:

1. Shared data type для `Notice` и регистрация нового block type в registry/guards.
2. Editor.js tool class для `Notice` в `editor/admin/tools/blocks`.
3. Использование `editor/admin/fields` для plain editor UI: `title`, `text`, `type`.
4. Renderer component для `Notice` в renderer-layer.
5. Поддержка save/load для нового блока и fallback/normalization некорректных значений.
6. Демонстрационный блок в `content/default-page.json`, если это нужно для проверки reset/preview.
7. Проверка полного цикла create/edit/save/reload/render и `npm run check`.

Вне scope этапа:

- nested Editor.js instances;
- rich fields и inline tools внутри custom block fields;
- CTA/Banner с image/media workflow;
- media gallery / slider block;
- production upload/storage workflow;
- валидация через `zod`;
- Import JSON;
- i18n, theme switching и расширенная keyboard navigation.

## План этапа

1. Добавить тип данных `Notice` и зарегистрировать block type в shared registry — выполнено.
2. Реализовать tool class `Notice` с plain fields и простым `save()` результатом — выполнено.
3. Подключить `Notice` в Editor.js config/toolbox — выполнено.
4. Добавить renderer component и mapping `block.type -> component` — выполнено.
5. Обновить draft-source guard/normalization так, чтобы корректный `Notice` проходил, а повреждённые данные не ломали preview — выполнено.
6. Добавить demo content для проверки preview/reset, если это не создаст лишний шум — выполнено.
7. Проверить create/edit/save/reload/render, export/reset draft и запустить `npm run check` — выполнено.

## Критерии готовности этапа

- `Notice` можно создать из Editor.js toolbox.
- `Notice` редактируется через plain fields из `editor/admin/fields`.
- Данные блока сохраняются в JSON и корректно восстанавливаются после reload.
- Renderer отображает `Notice` без зависимости от editor runtime.
- Preview, `Export JSON` и `Reset draft` работают с новым block type.
- Некорректные значения `Notice.type` не ломают editor и preview.
- `npm run check` проходит.

Итог: первый вертикальный срез custom block завершён. `Notice` реализован через shared type/normalization, Editor.js tool на plain fields, renderer, draft guard и
demo content; ручная browser-проверка подтвердила create/edit/save/reload/render, export JSON и reset draft. `npm run check` проходит.

## Последний завершённый этап

### Первый nested editor block / первый single-purpose rich field

Статус: этап завершён.

Цель этапа: реализовать первый простой custom block с одним nested Editor.js instance и проверить single-purpose rich field lifecycle без перехода к composite
blocks.

Выбранный блок: `SectionIntro`, потому что он естественно проверяет rich text поле для вводного текста, но остаётся достаточно простым: один plain title и одно rich
paragraph field. `TwoColumns`, media workflow и reusable rich fields на этом этапе оставались следующими шагами.

В scope входят:

1. Shared data type для `SectionIntro`, где rich поле хранится как вложенный Editor.js-compatible output.
2. Минимальная инфраструктура nested editor для одного поля внутри custom block tool.
3. Ограниченный whitelist tools для вложенного editor: только paragraph на первом шаге.
4. Подключение inline tools во вложенном paragraph field, если они совместимы с текущей конфигурацией.
5. Editor.js tool class для `SectionIntro` с plain title и nested rich description.
6. Renderer component для `SectionIntro`, который рендерит nested content через renderer-layer без зависимости от editor runtime.
7. Draft guard/normalization для нового block type и вложенных данных.
8. Demo content в `content/default-page.json` для preview/reset проверки.
9. Проверка create/edit/save/reload/render, корректного destroy nested editor instance, export/reset draft и `npm run check`.

Вне scope этапа:

- `TwoColumns` и другие composite blocks;
- reusable `RichParagraphField` / `RichHeaderField` как общая field system;
- nested header field;
- media fields и media gallery / slider;
- custom inline tools;
- production validation через `zod`;
- Import JSON;
- i18n, theme switching и расширенная keyboard navigation.

## План этапа

1. Спроектировать минимальный контракт nested rich paragraph data для `SectionIntro` без общей reusable rich field abstraction — выполнено.
2. Добавить shared type, registry entry и normalization/guard для `SectionIntro` — выполнено.
3. Реализовать helper для создания и уничтожения одного nested Editor.js instance внутри custom block field — выполнено.
4. Реализовать `SectionIntro` tool class с plain title и rich paragraph field — выполнено.
5. Подключить `SectionIntro` в Editor.js config/toolbox — выполнено.
6. Добавить renderer component и mapping `block.type -> component` — выполнено.
7. Добавить demo content для проверки preview/reset — выполнено.
8. Проверить lifecycle nested editor: create, edit, save, reload, render, destroy, export JSON, reset draft — выполнено.
9. Запустить `npm run check` — выполнено.

## Критерии готовности этапа

- `SectionIntro` можно создать из Editor.js toolbox.
- Внутри блока создаётся ровно один nested editor instance для rich paragraph field.
- Nested editor использует ограниченный набор tools и не превращается в общий mini-editor.
- Inline formatting в rich paragraph field сохраняется и восстанавливается, если совместимость подтверждена.
- `SectionIntro` сохраняет nested data в JSON и корректно восстанавливается после reload.
- Renderer отображает plain title и nested rich content без зависимости от editor runtime.
- Draft guard не пропускает явно повреждённые вложенные данные и не ломает preview.
- Nested editor instance корректно уничтожается при destroy блока.
- Preview, `Export JSON` и `Reset draft` работают с новым block type.
- `npm run check` проходит.

Итог: первый nested editor block / первый single-purpose rich field завершён. `SectionIntro` реализован через shared type/normalization, Editor.js tool с plain title
и вложенным paragraph-only editor, renderer, draft guard и demo content; ручная browser-проверка подтвердила create/edit/save/reload/render, destroy, export JSON и
reset draft. Конфликты `Enter` и слоёв dropdown/tune между внешним и вложенным editor исправлены.

## Последний завершённый этап

### Reusable rich fields

Статус: завершён.

Цель этапа: вынести проверенный nested editor lifecycle из single-purpose `SectionIntro` в минимальную reusable rich field system, пригодную для следующих custom
blocks и composite blocks.

В scope входят:

1. `RichParagraphField` как reusable field на базе nested Editor.js с paragraph-only output.
2. `RichHeaderField` как reusable field для одиночного заголовка с контролируемым уровнем.
3. Общий минимальный контракт rich field lifecycle: create/init, save, render holder, destroy.
4. Ограниченный whitelist tools для каждого rich field.
5. Поддержка inline tools там, где она совместима с текущей конфигурацией.
6. Повторное использование rich fields в `SectionIntro` без изменения публичной схемы данных блока.
7. Renderer/helper-логика для вывода rich paragraph/header data без зависимости от editor runtime.
8. Проверка save/load/reload/render/destroy и `npm run check`.

Вне scope этапа:

- `TwoColumns` и другие composite blocks;
- media fields и media gallery / slider;
- custom inline color tool;
- production validation через `zod`;
- Import JSON;
- i18n, theme switching и расширенная keyboard navigation.

## План этапа

1. Проанализировать текущий `createNestedParagraphEditor` и `SectionIntroTool`, выделить общий field lifecycle без преждевременной сложной абстракции — выполнено.
2. Реализовать `RichParagraphField` на базе существующего paragraph-only nested editor поведения — выполнено.
3. Реализовать `RichHeaderField` с ограниченным header-only data contract и контролем допустимых уровней — выполнено.
4. Перевести `SectionIntro` на `RichParagraphField`, сохранив текущую JSON-схему `description` — выполнено.
5. Добавить shared normalization/guard для rich header data, если он нужен новому reusable field contract — выполнено.
6. Обновить renderer helpers/components там, где rich field rendering должен стать переиспользуемым — выполнено.
7. Проверить lifecycle rich fields: create, edit, save, reload, render, destroy — выполнено.
8. Запустить `npm run check` — выполнено.

## Критерии готовности этапа

- `RichParagraphField` и `RichHeaderField` реализованы как reusable editor/admin fields.
- Rich fields используют nested Editor.js и ограниченный whitelist tools.
- Inline tools доступны в rich paragraph/header fields, если совместимость подтверждена.
- `SectionIntro` продолжает работать с прежней схемой данных после перехода на reusable field.
- Rich field data стабильно сохраняется, восстанавливается и рендерится.
- Nested editor instances корректно уничтожаются.
- `npm run check` проходит.

Итог: добавлены reusable `RichParagraphField` и `RichHeaderField`, общий helper nested rich editor lifecycle, shared-типы и normalizers для rich paragraph/header
data, renderer helper для rich field content. `SectionIntro` переведён на `RichParagraphField` без изменения JSON-схемы `description`. `npm run check` проходит;
ручная browser-проверка подтвердила runtime lifecycle через `SectionIntro`.

Следующий крупный этап после ручного подтверждения: composite blocks / `TwoColumns`.

## Завершённые этапы

### Базовая версия редактора

Базовая версия проекта завершена. В неё вошли:

- каркас `Nuxt 4`;
- базовая доменная структура редактора;
- стандартные block tools и inline tools;
- сохранение JSON и preview/render;
- локальный draft workflow;
- `Export JSON` и `Reset draft`;
- code quality tooling, Husky pre-commit checks и GitHub Pages deployment.

Цель базового этапа: подготовить ближайший реализационный план для запуска базовой версии проекта без бэкенда.

В базовый scope входили только ранние этапы из `SPEC.md`:

1. Стартовая инфраструктура проекта и структура директорий.
2. Shared-типизация и registry-основа.
3. Editor shell и источник данных.
4. Code quality tooling.
5. Стандартные block tools.
6. Стандартные inline tools.
7. Renderer, `Export JSON` и `Reset draft`.

Поздние этапы вроде custom blocks, nested editors, media gallery, i18n, theme и accessibility оставались вне базового scope.

План базовой версии:

1. Подготовить bootstrap-план `Nuxt 4` и минимальную структуру каталогов `app/`, `editor/`, `content/`, `shared/` — выполнено.
2. Создать базовый доменный каркас: типы editor output, block registry, статический `content/default-page.json`, источник draft-данных — выполнено.
3. Реализовать editor shell и фабрику конфигурации `Editor.js` со стандартными block tools — выполнено.
4. Подключить стандартные inline tools и проверить save/load и совместимость базовых комбинаций — выполнено.
5. Реализовать renderer-слой, preview-страницу и UX-действия `Export JSON` / `Reset draft` — выполнено.
6. Добавить code quality tooling и подготовить проект к static build и GitHub Pages deployment — выполнено.

Итоговый статус базовой версии:

- Bootstrap Nuxt 4 и структура директорий — завершено.
- Shared-слой и registry-основа — завершено.
- Editor shell и источник данных — завершено: реализованы editor shell, preview shell, загрузка данных с приоритетом `localStorage` draft ->
  `content/default-page.json`, подключены `Editor.js` runtime и стандартные block tools.
- Стандартные inline tools — завершено: inline tools подключены, ручная проверка базовых комбинаций выполнена, embed caption получил inline toolbar и manual
  toolbox-вставку YouTube URL.
- Renderer и базовый JSON workflow — завершено: renderer-слой и preview-страница уже были реализованы ранее, теперь добавлены UX-действия `Export JSON` и
  `Reset draft`.
- Code quality и deployment — завершено: code quality tooling настроен в начале проекта, Husky pre-commit hook подключён к `npm run check`; static build и GitHub
  Pages deployment реализованы через `nuxt generate` и GitHub Actions.

### Базовые Block Tunes

Статус: завершён.

Цель этапа: добавить первый слой кастомизации блоков через tune-метаданные, не переходя пока к custom blocks, nested editors, composite blocks и media workflow.

В этап вошли:

1. `AnchorTune` — хранит якорь блока для ссылок вида `#anchor`.
2. `SpacingTune` — хранит управляемые верхний и/или нижний отступы блока.
3. `LabelTune` — хранит человекочитаемый label/title блока для будущей sidebar navigation.
4. Расширение shared-типов и renderer-логики для чтения tune data.
5. Обновление draft guard так, чтобы блоки с tune data проходили базовую проверку, а повреждённые данные не ломали preview.
6. Демонстрационные данные в `content/default-page.json` для проверки save/load/render.

Вне scope этого этапа:

- `BackgroundTune`;
- `SpoilerTune`;
- sidebar navigation UI;
- custom block tools;
- plain/rich field system;
- nested editors;
- media gallery / slider block;
- импорт JSON;
- i18n, theme switching и расширенная keyboard navigation.

План этапа:

1. Изучить фактический формат `tunes` в `Editor.js OutputData` на текущей версии и зафиксировать минимальную типизацию в shared-слое — выполнено.
2. Подготовить общую базу для простых block tunes в `editor/admin/tunes`: интерфейс данных, helpers для sanitization/normalization и единый подход к UI — выполнено.
3. Реализовать `AnchorTune`: editor UI, сохранение в `tunes`, renderer-атрибут `id`, базовая нормализация значения — выполнено.
4. Реализовать `SpacingTune`: editor UI, ограниченный набор безопасных значений, сохранение в `tunes`, применение renderer-классов или CSS variables — выполнено.
5. Реализовать `LabelTune`: editor UI, сохранение label/title в `tunes`, без реализации sidebar navigation на этом этапе — выполнено.
6. Обновить renderer и `content/default-page.json`, чтобы preview демонстрировал применение базовых tunes — выполнено.
7. Обновить draft-source guard для допуска известных tune data и защиты от некорректных значений — выполнено.
8. Проверить `save/load`, preview/render, reset draft и export JSON на блоках с tune data и без них — выполнено.

Критерии готовности этапа:

- `AnchorTune`, `SpacingTune` и `LabelTune` доступны в Editor.js UI для поддерживаемых стандартных блоков.
- Значения tunes сохраняются в JSON и не теряются после reload.
- Renderer корректно использует tune data и не меняет поведение блоков без tune data.
- Некорректные или неизвестные tune values не ломают editor и preview.
- `Export JSON` содержит актуальные tune data.
- `Reset draft` возвращает демонстрационный контент с ожидаемыми tune examples.
- `npm run check` проходит.

Итог: ручная browser-проверка подтвердила `save/load`, preview/render, reset draft и export JSON на блоках с tune data и без них. `npm run check` проходит.

### Plain field system

Статус: завершён.

Итог:

- Добавлен `editor/admin/fields` с базовым контрактом plain field и DOM wrapper helpers.
- Реализованы text input, URL input, textarea, select, radio group и toggle fields.
- Toggle хранит и отдаёт boolean-значение.
- Подготовлены file/image-oriented value contracts; image value содержит обязательный `alt`.
- Добавлены theme-friendly глобальные классы `editor-plain-field*` в editor shell styles.
- Отдельный visible usage harness не добавлялся; первое runtime-использование запланировано в следующем custom block этапе.
- `npm run check` проходит.
