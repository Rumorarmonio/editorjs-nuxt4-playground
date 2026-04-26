# План реализации

## Проект

`Nuxt 4` playground для визуального редактора контента на `Editor.js` с отдельными editor-layer и renderer-layer, статическим JSON-источником и GitHub Pages deployment.

## Цель

Подготовить ближайший реализационный план для запуска базовой версии проекта без бэкенда:

- каркас `Nuxt 4`;
- базовая доменная структура редактора;
- стандартные block tools и inline tools;
- сохранение JSON и preview/render;
- локальный draft workflow.

## Текущий scope

В ближайший scope входят только ранние этапы из `SPEC.md`:

1. Стартовая инфраструктура проекта и структура директорий.
2. Shared-типизация и registry-основа.
3. Editor shell и источник данных.
4. Code quality tooling.
5. Стандартные block tools.
6. Стандартные inline tools.
7. Renderer, `Export JSON` и `Reset draft`.

Поздние этапы вроде custom blocks, tunes, nested editors, media gallery, i18n, theme и accessibility остаются вне ближайшего implementation scope.

## Этапы

1. Подготовить bootstrap-план `Nuxt 4` и минимальную структуру каталогов `app/`, `editor/`, `content/`, `shared/`.
2. Создать базовый доменный каркас: типы editor output, block registry, статический `content/default-page.json`, источник draft-данных.
3. Реализовать editor shell и фабрику конфигурации `Editor.js` со стандартными block tools.
4. Подключить стандартные inline tools и проверить save/load и совместимость базовых комбинаций.
5. Реализовать renderer-слой, preview-страницу и UX-действия `Export JSON` / `Reset draft`.
6. Добавить code quality tooling и подготовить проект к static build и GitHub Pages deployment.

## Статус этапов

- Этап 1 — завершён
- Этап 2 — завершён
- Этап 3 — завершён: реализованы editor shell, preview shell, загрузка данных с приоритетом `localStorage` draft -> `content/default-page.json`, подключены `Editor.js` runtime и стандартные block tools
- Этап 4 — завершён: стандартные inline tools подключены, ручная проверка базовых комбинаций выполнена, embed caption получил inline toolbar и manual toolbox-вставку YouTube URL
- Этап 5 — не начат
- Этап 6 — выполнен досрочно: code quality tooling настроен в начале проекта; static build и GitHub Pages deployment реализованы сейчас через `nuxt generate` и GitHub Actions

## Следующий этап

Следующий крупный этап: реализовать renderer UX-действия `Export JSON` / `Reset draft`.
