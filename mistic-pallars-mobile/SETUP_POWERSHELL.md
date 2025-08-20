# COMANDES POWERSHELL PER CONFIGURAR MISTIC-PALLARS MOBILE (SENSE AUTH)

## 1. Crear el projecte Expo
```powershell
npx create-expo-app@latest mistic-pallars-mobile --template blank
```

## 2. Entrar a la carpeta del projecte
```powershell
cd mistic-pallars-mobile
```

## 3. Instal·lar dependències amb versions exactes (SENSE SUPABASE)
```powershell
# Instal·lar dependències d'Expo
npx expo install expo-constants@16.0.2
npx expo install expo-font@12.0.10
npx expo install expo-status-bar@1.12.1

# Instal·lar navegació
npm install @react-navigation/native@6.1.9
npm install @react-navigation/bottom-tabs@6.5.11
npm install @react-navigation/native-stack@6.9.17
npx expo install react-native-screens@3.29.0
npx expo install react-native-safe-area-context@4.8.2

# Instal·lar mapes i SVG
npx expo install react-native-maps@1.14.0
npx expo install react-native-svg@15.2.0
```

## 4. Configurar variables d'entorn (OPCIONAL)
```powershell
Copy-Item .env.sample .env
```

## 5. Editar .env amb Google Maps API (OPCIONAL)
```powershell
notepad .env
```
Afegir només (si voleu Google Maps):
```
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

## 6. Llançar l'aplicació (SENSE PERMISOS D'AUTH)
```powershell
npx expo start
```

### Opcions de llançament:
- Prem `a` per obrir a Android (necessita emulador o dispositiu connectat)
- Escanejar codi QR amb Expo Go per provar en dispositiu real
- L'app NO suporta web i NO demanarà cap permís

## 7. Build per producció (opcional)
```powershell
# Configurar EAS (primera vegada)
npx eas build:configure

# Android APK
npx eas build --platform android

# iOS IPA (requereix compte Apple Developer)
npx eas build --platform ios
```

## NOTES IMPORTANTS:
- ✅ L'app NO demanarà cap permís d'usuari (ubicació, càmera, etc.)
- ✅ NO hi ha autenticació ni backend requerit
- ✅ Funciona completament offline amb dades d'exemple
- ✅ Compatible amb Expo SDK 53, React 19 i React Native 0.79.x
- ✅ Exclusivament per plataformes mòbils (Android/iOS)
- ✅ El client Supabase és un mock que no fa cap connexió real

## FUNCIONALITATS INCLOSES:
- 🗺️ Mapa interactiu del Pallars amb 3 llegendes d'exemple
- 📚 Llista de llegendes amb targetes i categories
- 🎨 Interfície moderna amb colors naturals del Pallars
- 📱 Navegació per pestanyes completament funcional
- ⚡ Completament funcional sense connexió a internet

## RESULTAT:
**App mòbil neta que funciona immediatament sense cap configuració addicional!**
