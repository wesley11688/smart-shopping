module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      // 适配的视口宽度，一般为750，根据项目而定
      // 如果設計圖750，調成一倍 => 適配375標準屏幕
      // 如果設計圖640，調成一倍 => 適配320標準屏幕
      viewportWidth: 375
    }
  }
}
