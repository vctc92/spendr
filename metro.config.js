const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// inlineRem: 16 makes 1rem = 16px on native (NativeWind's default is 14),
// so Tailwind spacing follows the 4-pt grid: p-1 = 4, p-3 = 12, p-4 = 16.
module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
