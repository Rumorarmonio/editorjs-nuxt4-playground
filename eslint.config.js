import globals from 'globals'
import vuePlugin from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tseslint from 'typescript-eslint'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import eslintConfigPrettier from 'eslint-config-prettier'

const vueRecommendedConfig = vuePlugin.configs['flat/recommended']
const vueRecommendedItems = Array.isArray(vueRecommendedConfig)
  ? vueRecommendedConfig
  : [vueRecommendedConfig]

export default [
  {
    ignores: [
      'node_modules',
      '.nuxt',
      '.output',
      'dist',
      'coverage',
      'storybook-static',
      '.turbo',
      '.cache',
      '.idea',
      '.vscode',
      'eslint.config.js',
      'stylelint.config.mjs',
      'public/**/*.js',
    ],
  },

  ...vueRecommendedItems,

  {
    files: [
      'app/**/*.{js,ts,vue,d.ts}',
      'editor/**/*.{js,ts,vue,d.ts}',
      'shared/**/*.{js,ts,d.ts}',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2024,

        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        defineSlots: 'readonly',
        withDefaults: 'readonly',

        definePageMeta: 'readonly',
        defineNuxtComponent: 'readonly',
        defineNuxtPlugin: 'readonly',
        defineNuxtRouteMiddleware: 'readonly',
        defineAppConfig: 'readonly',
        updateAppConfig: 'readonly',
      },
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        projectService: true,
        tsconfigRootDir: process.cwd(),
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue: vuePlugin,
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,

      '@typescript-eslint/no-empty-object-type': 'off',

      'prefer-const': 'warn',

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',

      'import/no-unresolved': 'error',

      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          ts: 'never',
          vue: 'never',
        },
      ],
    },
  },

  {
    files: ['app/pages/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },

  {
    files: [
      'server/**/*.{js,ts,mjs,cjs,d.ts}',
      'modules/**/*.{js,ts,mjs,cjs,d.ts}',
      'scripts/**/*.{js,ts,mjs,cjs,d.ts}',
      '*.config.{js,ts,mjs,cjs}',
      'nuxt.config.{js,ts,mjs,cjs}',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2024,
      },
      parser: tseslint.parser,
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            '*.config.js',
            '*.config.ts',
            '*.config.mjs',
            '*.config.cjs',
            'eslint.config.js',
          ],
        },
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,

      '@typescript-eslint/no-empty-object-type': 'off',

      'prefer-const': 'warn',

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',

      'import/no-unresolved': 'error',

      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          ts: 'never',
        },
      ],
    },
  },

  eslintConfigPrettier,
]
