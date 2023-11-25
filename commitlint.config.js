module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: 'conventional-changelog-conventionalcommits',
  rules: {
    'header-max-length': [2, 'always', 50],
    'header-min-length': [2, 'always', 0],

    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 72],

    'footer-leading-blank': [2, 'always'],
    'footer-empty': [2, 'always'],
    'footer-max-line-length': [2, 'always', Infinity],

    'scope-case': [2, 'always', 'lower-case'],

    'subject-case': [
      2,
      'always',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],

    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`],
    ],
  },
};
