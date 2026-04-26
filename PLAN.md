# План реализации

## Проект

`Nuxt 4` playground для визуального редактора контента на `Editor.js` с отдельными editor-layer и renderer-layer, статическим JSON-источником и GitHub Pages deployment.

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

## Цель базового этапа

Подготовить ближайший реализационный план для запуска базовой версии проекта без бэкенда:

- каркас `Nuxt 4`;
- базовая доменная структура редактора;
- стандартные block tools и inline tools;
- сохранение JSON и preview/render;
- локальный draft workflow.

## Scope базового этапа

В базовый scope входили только ранние этапы из `SPEC.md`:

1. Стартовая инфраструктура проекта и структура директорий.
2. Shared-типизация и registry-основа.
3. Editor shell и источник данных.
4. Code quality tooling.
5. Стандартные block tools.
6. Стандартные inline tools.
7. Renderer, `Export JSON` и `Reset draft`.

Поздние этапы вроде custom blocks, nested editors, media gallery, i18n, theme и accessibility остаются вне ближайшего implementation scope.

## Работы базовой версии

1. Подготовить bootstrap-план `Nuxt 4` и минимальную структуру каталогов `app/`, `editor/`, `content/`, `shared/`.
2. Создать базовый доменный каркас: типы editor output, block registry, статический `content/default-page.json`, источник draft-данных.
3. Реализовать editor shell и фабрику конфигурации `Editor.js` со стандартными block tools.
4. Подключить стандартные inline tools и проверить save/load и совместимость базовых комбинаций.
5. Реализовать renderer-слой, preview-страницу и UX-действия `Export JSON` / `Reset draft`.
6. Добавить code quality tooling и подготовить проект к static build и GitHub Pages deployment.

## Статус базовой версии

- Bootstrap Nuxt 4 и структура директорий — завершено.
- Shared-слой и registry-основа — завершено.
- Editor shell и источник данных — завершено: реализованы editor shell, preview shell, загрузка данных с приоритетом `localStorage` draft -> `content/default-page.json`, подключены `Editor.js` runtime и стандартные block tools.
- Стандартные inline tools — завершено: inline tools подключены, ручная проверка базовых комбинаций выполнена, embed caption получил inline toolbar и manual toolbox-вставку YouTube URL.
- Renderer и базовый JSON workflow — завершено: renderer-слой и preview-страница уже были реализованы ранее, теперь добавлены UX-действия `Export JSON` и `Reset draft`.
- Code quality и deployment — завершено: code quality tooling настроен в начале проекта, Husky pre-commit hook подключён к `npm run check`; static build и GitHub Pages deployment реализованы через `nuxt generate` и GitHub Actions.

## Активный этап

### Базовые Block Tunes

Статус: активен, реализация добавлена, требуется ручная browser-проверка save/load workflow.

Цель этапа: добавить первый слой кастомизации блоков через tune-метаданные, не переходя пока к custom blocks, nested editors, composite blocks и media workflow.

В scope входят:

1. `AnchorTune` — хранит якорь блока для ссылок вида `#anchor`.
2. `SpacingTune` — хранит управляемые верхний и/или нижний отступы блока.
3. `LabelTune` — хранит человекочитаемый label/title блока для будущей sidebar navigation.
4. Расширение shared-типов и renderer-логики для чтения tune data.
5. Обновление draft guard так, чтобы блоки с tune data проходили базовую проверку, а повреждённые данные не ломали preview.
6. Демонстрационные данные в `content/default-page.json` для проверки save/load/render.

Вне scope текущего этапа:

- `BackgroundTune`;
- `SpoilerTune`;
- sidebar navigation UI;
- custom block tools;
- plain/rich field system;
- nested editors;
- media gallery / slider block;
- импорт JSON;
- i18n, theme switching и расширенная keyboard navigation.

## План активного этапа

1. Изучить фактический формат `tunes` в `Editor.js OutputData` на текущей версии и зафиксировать минимальную типизацию в shared-слое — выполнено.
2. Подготовить общую базу для простых block tunes в `editor/admin/tunes`: интерфейс данных, helpers для sanitization/normalization и единый подход к UI — выполнено.
3. Реализовать `AnchorTune`: editor UI, сохранение в `tunes`, renderer-атрибут `id`, базовая нормализация значения — выполнено.
4. Реализовать `SpacingTune`: editor UI, ограниченный набор безопасных значений, сохранение в `tunes`, применение renderer-классов или CSS variables — выполнено.
5. Реализовать `LabelTune`: editor UI, сохранение label/title в `tunes`, без реализации sidebar navigation на этом этапе — выполнено.
6. Обновить renderer и `content/default-page.json`, чтобы preview демонстрировал применение базовых tunes — выполнено.
7. Обновить draft-source guard для допуска известных tune data и защиты от некорректных значений — выполнено.
8. Проверить `save/load`, preview/render, reset draft и export JSON на блоках с tune data и без них — ожидает ручной browser-проверки.

## Критерии готовности активного этапа

- `AnchorTune`, `SpacingTune` и `LabelTune` доступны в Editor.js UI для поддерживаемых стандартных блоков.
- Значения tunes сохраняются в JSON и не теряются после reload.
- Renderer корректно использует tune data и не меняет поведение блоков без tune data.
- Некорректные или неизвестные tune values не ломают editor и preview.
- `Export JSON` содержит актуальные tune data.
- `Reset draft` возвращает демонстрационный контент с ожидаемыми tune examples.
- `npm run check` проходит.

## Следующий крупный этап

После завершения базовых Block Tunes следующий этап по `SPEC.md`: Plain field system для будущих custom blocks.
