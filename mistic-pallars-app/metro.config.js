const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuració personalitzada per React Native Maps
config.resolver.assetExts.push('png', 'jpg', 'jpeg', 'svg');

module.exports = config;