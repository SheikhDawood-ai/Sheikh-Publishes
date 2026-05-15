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
  firebaseRulesPlugin.configs['flat/recommended'],
];
