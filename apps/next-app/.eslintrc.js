module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: ['next', 'next/core-web-vitals'],
  plugins: ['import'],
  rules: {
    // 'import/order': [
    //   'error',
    //   {
    //     groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
    //     pathGroups: [
    //       {
    //         pattern: 'react',
    //         group: 'external',
    //         position: 'before',
    //       },
    //       {
    //         pattern: '../../lib/api',
    //         group: 'internal',
    //         position: 'after',
    //       },
    //     ],
    //     pathGroupsExcludedImportTypes: ['react'],
    //     'newlines-between': 'always',
    //     alphabetize: {
    //       order: 'asc',
    //       caseInsensitive: true,
    //     },
    //   },
    // ],
  },
};
