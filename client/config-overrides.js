/*
 * @Date: 2019-12-01 15:01:24
 * @Author: d1y
 * @Github: https://github.com/d1y
 * @LastEditors: d1y
 * @LastEditTime: 2019-12-01 15:04:29
 */
const { override, fixBabelImports } = require('customize-cra')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  })
)