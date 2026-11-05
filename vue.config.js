const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: './',
  // 打包時不產生 .map 檔：上線後別人就不能從開發者工具看到原始碼（只影響 npm run build）
  productionSourceMap: false,
  transpileDependencies: true
})
