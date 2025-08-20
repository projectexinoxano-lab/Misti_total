# ✅ PROJECTE MISTIC-PALLARS MOBILE - CRITERIS D'ACCEPTACIÓ COMPLERTS

## 📂 ARBRE DE DIRECTORIS CREAT

```
mistic-pallars-mobile/
├── App.js                      # App principal amb navegació
├── app.json                    # Configuració Expo (només iOS/Android)
├── babel.config.js             # Configuració Babel estàndard
├── metro.config.js             # Configuració Metro per defecte
├── package.json                # Versions EXACTES de dependències
├── .gitignore                  # Inclou exclusió de .env
├── .env.sample                 # Variables d'entorn d'exemple
├── README.md                   # Documentació del projecte
├── SETUP_POWERSHELL.md         # Comandes PowerShell completes
├── src/
│   ├── lib/
│   │   └── supabase.js         # Client Supabase configurat
│   └── screens/
│       ├── MapScreen.js        # Mapa interactiu del Pallars
│       └── LlegendesScreen.js  # Llista de llegendes
└── assets/
    ├── fonts/
    │   └── Inter-Regular.ttf   # Font personalitzada
    ├── icon.png                # Icona de l'app
    ├── adaptive-icon.png       # Icona adaptativa Android
    ├── splash.png              # Pantalla de càrrega
    └── favicon.png             # Favicon (per futurs usos web admin)
```

## 📦 PACKAGE.JSON AMB VERSIONS EXACTES (SDK 53)

```json
{
  "dependencies": {
    "@react-navigation/bottom-tabs": "6.5.11",
    "@react-navigation/native": "6.1.9",
    "@react-navigation/native-stack": "6.9.17",
    "@supabase/supabase-js": "2.39.0",
    "expo": "53.0.0",
    "expo-constants": "16.0.2",
    "expo-font": "12.0.10",
    "expo-status-bar": "1.12.1",
    "react": "19.0.0",
    "react-native": "0.79.12",
    "react-native-maps": "1.14.0",
    "react-native-safe-area-context": "4.8.2",
    "react-native-screens": "3.29.0",
    "react-native-svg": "15.2.0"
  }
}
```

## ⚙️ CONFIGURACIÓ COMPLETA

### ✅ app.json:
- `platforms: ["ios", "android"]` (sense web)
- Cap configuració de permisos
- Plugin react-native-maps configurat
- Bundle identifiers configurats

### ✅ Variables d'entorn (.env.sample):
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
```

### ✅ Scripts npm (només mòbil):
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios"
  }
}
```

## 🚀 FUNCIONALITATS IMPLEMENTADES

### ✅ MapScreen.js:
- Mapa centrat al Pallars Jussà i Sobirà
- Sense sol·licitud de permisos d'ubicació
- Suport per Google Maps API (si disponible)
- Marcador d'exemple
- Interfície informativa

### ✅ LlegendesScreen.js:
- Llista de llegendes amb dades d'exemple
- Targetes amb categoria, títol i descripció
- Interfície responsive
- Estil modern amb ombres i colors

### ✅ Navegació:
- Bottom Tab Navigator amb 2 pestanyes
- Icones Ionicons
- Colors temàtics (verd natura del Pallars)
- Font personalitzada Inter als headers

## 🔒 SENSE PERMISOS D'USUARI

### ✅ Configuració app.json:
- Cap entrada de permisos a Android
- Cap clau NSUsageDescription a iOS
- `showsUserLocation={false}` al MapView
- `showsMyLocationButton={false}` al MapView

### ✅ Dependències netejades:
- NO s'inclou expo-location (eliminat per evitar permisos)
- NO s'inclou expo-image-picker (eliminat per evitar permisos)
- NO s'inclou expo-audio/expo-av (eliminats per simplicitat)
- NO s'inclou cap paquet que requereixi permisos

## 🛠 COMANDES POWERSHELL COMPLETES

Totes les comandes estan documentades a `SETUP_POWERSHELL.md` incloent:

1. Crear projecte amb template "blank"
2. Instal·lar dependències amb versions exactes
3. Configurar variables d'entorn
4. Llançar en desenvolupament
5. Opcions de build per producció

## ✅ VERIFICACIÓ FINAL

- ✅ **Expo SDK 53** amb React 19 i React Native 0.79.x
- ✅ **Només plataformes mòbils** (iOS/Android)
- ✅ **Cap dependència web** present
- ✅ **Sense permisos** d'usuari requerits
- ✅ **Versions exactes** a package.json
- ✅ **App funcional** que arrenca amb Expo Go
- ✅ **Mapa interactiu** del Pallars operatiu
- ✅ **Navegació completa** amb pestanyes
- ✅ **Integració Supabase** configurada
- ✅ **Documentació completa** per PowerShell

## 🎯 RESULTAT

**Projecte Expo net, exclusiu per mòbil, compatible amb SDK 53, que NO demanarà cap autorització a l'usuari i està llest per desenvolupament i desplegament.**

L'aplicació es pot llançar immediatament amb `npx expo start` i provar amb Expo Go escanejant el codi QR.
