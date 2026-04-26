# План реализации

## Проект

`Nuxt 4` playground для визуального редактора контента на `Editor.js` с отдельными editor-layer и renderer-layer, статическим JSON-источником и GitHub Pages deployment.

## Текущий статус

- Базовая версия редактора завершена.
- Базовый слой Block Tunes завершён.
- Активный этап: первый простой custom block без nested editors.
- Plain field system завершён.

## Последний завершённый этап

### Plain field system

Статус: завершён.

Цель этапа: подготовить минимальную reusable-систему plain fields для будущих custom blocks, не переходя пока к первому custom block, nested editors и rich fields.

В scope входят:

1. Общий field wrapper для custom tool UI: label, control, optional hint, optional error.
2. Базовая типизация и единый контракт plain field components/helpers в `editor/admin/fields`.
3. Text input field.
4. Textarea field.
5. Select field.
6. Toggle field для boolean-значений с визуальным toggle-представлением.
7. Radio group field.
8. Базовые URL/file/image-oriented поля или подготовленный контракт для них, без полноценного media workflow.
9. Минимальные стили plain fields через theme-friendly class names, CSS variables и существующие SCSS-подходы.
10. Подготовка к будущему использованию в custom block tools без привязки к конкретному блоку.

Вне scope текущего этапа:

- реализация первого custom block;
- nested Editor.js instances;
- rich fields с inline tools;
- media gallery / slider block;
- production upload/storage workflow;
- полноценная валидация и masks;
- Import JSON;
- i18n-словарь для всех field labels;
- light/dark theme switching;
- расширенная keyboard navigation за пределами естественного tab-порядка.

## План завершённого этапа

1. Зафиксировать минимальный контракт plain field: `name`, `label`, `value`, `hint`, `error`, disabled/read-only states и callback изменения — выполнено.
2. Спроектировать структуру `editor/admin/fields` без новых зависимостей и без Vue runtime внутри Editor.js tool classes — выполнено.
3. Реализовать общий field wrapper и базовые DOM helpers для plain fields, переиспользуя подход `editor/admin/tunes/tune-ui.ts` там, где он подходит — выполнено.
4. Реализовать text input и textarea fields с нормальным `input/change` flow — выполнено.
5. Реализовать select, radio group и toggle fields; toggle должен сохранять boolean, а не UI-specific значение — выполнено.
6. Подготовить базовый контракт для image/url/file fields с явным `alt` для image-based сценариев, но без backend upload и gallery логики — выполнено.
7. Добавить minimal usage harness или внутренний пример для проверки полей, если без него нельзя надёжно проверить удобство использования внутри будущих custom tools — решено не добавлять отдельный harness; первое реальное использование будет в следующем custom block этапе.
8. Проверить, что field helpers можно использовать из будущего Editor.js block tool без нарушения save/load модели — выполнено на уровне DOM API и типового контракта; runtime-проверка будет в первом custom block.
9. Запустить `npm run check` после реализации этапа — выполнено.

## Критерии готовности завершённого этапа

- В `editor/admin/fields` есть минимальная reusable plain field system.
- Plain fields имеют единообразный wrapper: label, control, optional hint, optional error.
- Реализованы text input, textarea, select, radio group и toggle.
- Toggle визуально является переключателем, а в данных остаётся boolean.
- Plain fields не пытаются поддерживать inline tools; для rich text явно оставлен будущий rich field/nested editor путь.
- Image-oriented контракт предусматривает явный `alt` для будущих image fields.
- Поля можно использовать внутри будущих custom block tools без новых зависимостей и без перепроектирования renderer-layer.
- `npm run check` проходит.

## Следующий крупный этап

Следующий этап по `SPEC.md`: первый простой custom block без nested editors.

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
- Editor shell и источник данных — завершено: реализованы editor shell, preview shell, загрузка данных с приоритетом `localStorage` draft -> `content/default-page.json`, подключены `Editor.js` runtime и стандартные block tools.
- Стандартные inline tools — завершено: inline tools подключены, ручная проверка базовых комбинаций выполнена, embed caption получил inline toolbar и manual toolbox-вставку YouTube URL.
- Renderer и базовый JSON workflow — завершено: renderer-слой и preview-страница уже были реализованы ранее, теперь добавлены UX-действия `Export JSON` и `Reset draft`.
- Code quality и deployment — завершено: code quality tooling настроен в начале проекта, Husky pre-commit hook подключён к `npm run check`; static build и GitHub Pages deployment реализованы через `nuxt generate` и GitHub Actions.

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
