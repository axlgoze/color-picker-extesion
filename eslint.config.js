import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // 1. Configuración recomendada de ESLint
  js.configs.recommended,

  // 2. Tu configuración personalizada
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser, // Browser globals (window, document, etc)
        ...globals.node, // Esto soluciona __dirname, process, etc.
        chrome: 'readonly', // Esto soluciona 'chrome' is not defined
      },
    },
    rules: {
      // Si quieres ser menos estricto con el error que mencionaste:
      'no-unused-vars': 'warn',
      'no-useless-assignment': 'off', // Opcional: desactiva si te molesta demasiado
    },
  },

  // 3. Prettier siempre debe ir al final para que sobrescriba reglas de estilo
  eslintConfigPrettier,
];
