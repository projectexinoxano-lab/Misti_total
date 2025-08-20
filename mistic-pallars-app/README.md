# Mistic Pallars - Aplicació Mòbil React Native

## Descripció
Aplicació mòbil nativa desenvolupada amb React Native i Expo per explorar les llegendes i mites del Pallars Jussà i Sobirà amb funcionalitats de geolocalització, àudio narratiu i gamificació.

## Característiques Principals

### Funcionalitats
- **Splash Screen**: Logo animat de Mistic Pallars
- **Navegació**: Bottom tabs amb 4 seccions
- **Mapa Interactiu**: Google Maps amb pins de llegendes
- **Geolocalització**: Detecció de proximitat (10km)
- **Àudio Narratiu**: Reproducció de llegendes
- **Gamificació**: Sistema de punts i nivells
- **Favorits**: Marcar llegendes preferides
- **Valoracions**: Sistema d'estrelles 1-5
- **Compartir**: Integració amb xarxes socials
- **Perfil**: Avatar, estadístiques i progrés

### Tecnologies
- **Framework**: React Native amb Expo SDK 50
- **Navegació**: React Navigation 6
- **Mapes**: react-native-maps + Google Maps
- **Àudio**: expo-av
- **Autenticació**: Supabase Auth
- **Base de dades**: Supabase
- **Ubicació**: expo-location
- **Cache local**: AsyncStorage
- **Compartir**: expo-sharing
- **Estils**: Styled Components + NativeBase

## Estructura del Projecte

```
mistic-pallars-app/
├── App.js                    # Entry point principal
├── app.json                  # Configuració Expo
├── package.json              # Dependències
├── metro.config.js           # Configuració Metro bundler
├── babel.config.js           # Configuració Babel
├── src/                      # Codi font
│   ├── components/           # Components reutilitzables
│   │   ├── AudioPlayer.js    # Reproductor d'àudio
│   │   ├── LlegendaCard.js   # Targeta de llegenda
│   │   ├── MapView.js        # Component de mapa
│   │   └── LoadingSpinner.js # Indicador de càrrega
│   ├── screens/              # Pantalles de l'app
│   │   ├── SplashScreen.js   # Pantalla inicial
│   │   ├── HomeScreen.js     # Mapa principal
│   │   ├── LlegendesScreen.js# Llista de llegendes
│   │   ├── DetailScreen.js   # Detall de llegenda
│   │   ├── ProfileScreen.js  # Perfil d'usuari
│   │   └── AuthScreen.js     # Autenticació
│   ├── navigation/           # Configuració de navegació
│   │   ├── TabNavigator.js   # Bottom tabs
│   │   └── StackNavigator.js # Stack navigation
│   ├── contexts/             # React Contexts
│   │   ├── AuthContext.js    # Context d'autenticació
│   │   └── LocationContext.js# Context de ubicació
│   ├── services/             # Serveis i APIs
│   │   ├── supabase.js       # Client Supabase
│   │   ├── location.js       # Serveis de ubicació
│   │   └── storage.js        # AsyncStorage
│   ├── utils/                # Utilitats
│   │   ├── colors.js         # Paleta de colors
│   │   ├── constants.js      # Constants globals
│   │   └── helpers.js        # Funcions auxiliars
│   └── constants/            # Constants de l'app
│       └── config.js         # Configuració global
└── assets/                   # Recursos estàtics
    ├── images/               # Imatges i ícones
    ├── fonts/                # Tipografies
    └── sounds/               # Sons de l'app
```