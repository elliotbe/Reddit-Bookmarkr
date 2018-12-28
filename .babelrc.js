const reactPreset = require.resolve('babel-preset-react-app')

module.exports = {
  presets: [
    require.resolve('babel-preset-react-app')
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-proposal-decorators'), {
        decoratorsBeforeExport: false
    }], [
      require.resolve('@babel/plugin-proposal-pipeline-operator'), {
        proposal: 'minimal'
    }], [
      require.resolve('@babel/plugin-proposal-class-properties')
    ],
  ]
}
