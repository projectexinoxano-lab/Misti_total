# MISTIC-PALLARS Mobile App

**Directori del projecte: `mistic-pallars-mobile/`**

## Descripció

Aplicació mòbil per descobrir les llegendes i mites del Pallars Jussà i Sobirà. Desenvolupada amb Expo SDK 53, React Native 0.79.x i React 19.

**🚀 ATENCIÓ: Per instruccions detallades d'instal·lació, consulta el fitxer [`SETUP_POWERSHELL.md`](SETUP_POWERSHELL.md)**

## Estructura del Projecte `mistic-pallars-mobile/`

```
mistic-pallars-mobile/              ← AQUEST ÉS EL NOM DEL DIRECTORI
├── App.js                          # Entrada principal amb navegació
├── app.json                        # Configuració Expo
├── babel.config.js                 # Configuració Babel
├── metro.config.js                 # Configuració Metro
├── package.json                    # Dependències i scripts
├── .env.sample                     # Variables d'entorn d'exemple
├── .gitignore                      # Fitxers ignorats per Git
├── SETUP_POWERSHELL.md             # INSTRUCCIONS DETALLADES D'INSTAL·LACIÓ
├── src/
│   ├── lib/
│   │   └── supabase.js             # Mock client (sense connexió real)
│   └── screens/
│       ├── MapScreen.js            # Pantalla del mapa
│       └── LlegendesScreen.js      # Pantalla de llegendes
└── assets/                         # Recursos de l'aplicació
```

## Funcionalitats

- ✅ Navegació per pestanyes (Mapa, Llegendes)
- ✅ Mapa interactiu centrat al Pallars
- ✅ Llista de llegendes (dades estàtiques d'exemple)
- ✅ **SENSE permisos d'usuari requerits**
- ✅ **SENSE autenticació ni prompts d'inici**
- ✅ Funciona completament offline
- ✅ Compatible amb iOS i Android únicament

## Tecnologies

- **Expo SDK**: 53.0.0
- **React**: 19.0.0
- **React Native**: 0.79.12
- **React Navigation**: 6.x
- **React Native Maps**: 1.14.0
- **React Native SVG**: 15.2.0

## Scripts Disponibles

Cop d'entrar al directori `mistic-pallars-mobile/`:

```powershell
cd mistic-pallars-mobile
```

- `npx expo start`: Inicia el servidor de desenvolupament
- `npm run start`: Inicia el servidor de desenvolupament
- `npm run android`: Inicia l'app a Android
- `npm run ios`: Inicia l'app a iOS

## 🚀 Inici Ràpid

### 1. Navegar al directori del projecte
```powershell
cd mistic-pallars-mobile
```

### 2. Instal·lar dependències
**Consulta [`SETUP_POWERSHELL.md`](SETUP_POWERSHELL.md) per les comandes exactes d'instal·lació**

### 3. Executar l'aplicació
```powershell
npx expo start
```

## 📱 Característiques Especials

- **No demana cap permís**: L'aplicació no sol·licita ubicació, càmera, ni cap altre permís
- **No requereix autenticació**: S'inicia directament sense prompts de login
- **Funciona offline**: Totes les dades són estàtiques i no requereixen connexió
- **Exclusivament mòbil**: Dissenyada només per Android i iOS (no web)

---

**📖 Per instruccions detallades d'instal·lació i configuració, revisa sempre el fitxer [`SETUP_POWERSHELL.md`](SETUP_POWERSHELL.md)**
