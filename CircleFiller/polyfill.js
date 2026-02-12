// polyfill.js — native crypto polyfill (used on Android/iOS)
// Wrapped in try/catch: quick-crypto requires a custom dev build.
// Game works fine without it — only needed for future wallet features.
try {
  const { install } = require('react-native-quick-crypto')
  install()
} catch (e) {
  // Native module not available — skip silently
}
