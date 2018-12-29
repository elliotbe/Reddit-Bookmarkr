module.exports = {
  'extends': [
    'standard',
    'standard-react',
  ],
  'env': {
    'jest': true,
    'browser': true
  },
  // Don't lint Static Properties
  'parser': 'babel-eslint',
  'rules': {
    'react/prop-types': 'warn',
    'comma-dangle': ['error', {
      'arrays': 'always',
      'objects': 'always',
      'imports': 'never',
      'exports': 'never',
      'functions': 'ignore',
    }],
    'max-len': ['warn', {
      'code': 80,
      'ignoreComments': true,
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true
    }],
    'react/jsx-closing-bracket-location': 'warn',
    'react/jsx-tag-spacing': ['warn', {
      'closingSlash': 'never',
      'beforeSelfClosing': 'always',
      'afterOpening': 'never',
      'beforeClosing': 'allow'
    }],
  },
}
