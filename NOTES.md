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
- Editor.js, кастомные блоки, renderer, draft workflow и JSON-модель пока не реализованы.

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
- Форматирование отвечает за `Prettier`; конфликтующие форматные правила `ESLint` отключаются через `eslint-config-prettier`.
- `SPEC.md` исключён из `Prettier`, чтобы не создавать большой нерелевантный diff в исходном документе требований.

## Что уже сделано

- Подготовлена подробная техническая спецификация проекта в `SPEC.md`.
- Зафиксированы правила работы агента и формат ведения проектных заметок.
- На текущем шаге спецификация преобразована в краткий рабочий контекст и реализационный план.
- Реализован первый bootstrap-этап: `package.json`, `nuxt.config.ts`, `tsconfig.json`, `app/app.vue`, стартовая `index`-страница, SCSS-инфраструктура и ранняя структура каталогов.
- Установлены базовые версии `nuxt@4.4.2`, `typescript@6.0.3`, `sass@1.99.0`; `npm run build` проходит успешно.
- Досрочно настроены `ESLint`, `Prettier` и `Stylelint`, добавлены npm scripts для проверки и автоисправления, проверки `npm run lint`, `npm run stylelint`, `npm run format:check` и `npm run typecheck` проходят успешно.

## Текущие проблемы / открытые вопросы

- Не выбраны точные версии `Editor.js` и совместимых official/community plugins.
- Не проверена актуальная совместимость `strikethrough` plugin с остальными inline tools.
- Не проверены детали GitHub Pages base path и будущего `Nuxt` static deployment.

## Критичные риски

- Раннее добавление кастомных блоков и nested editors до стабилизации save/load усложнит архитектуру и отладку.
- Некачественный выбор inline/list plugins может привести к нестабильному JSON и регрессиям при повторной загрузке.
- Смешение editor-layer и renderer-layer на старте усложнит дальнейшее расширение и тестирование.
- Поспешная стилизация без токенов и CSS variables усложнит позднее добавление theme layer.

## Следующий шаг

Следующий крупный шаг: создать базовый доменный каркас для shared-типов, registry-основы, `content/default-page.json` и источника draft-данных без подключения Editor.js runtime.
