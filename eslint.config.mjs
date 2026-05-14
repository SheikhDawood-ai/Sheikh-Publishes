import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist/**/*']
  },
  ...tseslint.config(
    {
      files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
      languageOptions: {
        parserOptions: {
          project: ['./tsconfig.json'],
        },
      },
    }
  ),
  {
    files: ['firestore.rules', 'DRAFT_firestore.rules'],
    plugins: {
      '@firebase/security-rules': firebaseRulesPlugin,
    },
    rules: {
      ...firebaseRulesPlugin.configs['recommended'].rules,
    },
  },
];
