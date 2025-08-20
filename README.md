# 🧿 Mistic Pallars - Aplicació Completa de Llegendes

> *Descobreix les llegendes mítiques del Pallars amb tecnologia moderna*

## 🌍 Visió General

**Mistic Pallars** és una aplicació completa per explorar i gestionar les llegendes tradicionals del Pallars Jussà i Sobirà. El projecte inclou una aplicació mòbil per als usuaris finals i una plataforma web per a l'administració de contingut.

### ✨ Característiques Principals

- **🗺️ Exploració Geolocalitzada**: Descobreix llegendes properes amb Google Maps
- **🎮 Gamificació**: Sistema de punts i recompenses per fomentar l'exploració
- **🔊 Narracions d'Àudio**: Escolta les llegendes amb narració immersiva
- **⭐ Valoracions i Favorits**: Marca i valora les teves llegendes preferides
- **📱 Multiplataforma**: Aplicació nativa per iOS i Android
- **🌐 Administració Web**: Panell complet per gestionar contingut

---

## 📋 Estructura del Projecte

```
mistic-pallars/
├── 🗄️ supabase/                     # Backend i base de dades
│   ├── 00_complete_schema.sql       # Esquema complet SQL
│   ├── migrations/                  # Migracions de BD
│   └── functions/                   # Edge Functions
│
├── 🌐 mistic-pallars-admin/       # Web d'administració (Next.js)
│   ├── app/                         # Pàgines i layouts
│   ├── components/                  # Components React
│   ├── contexts/                    # Contexts (Auth, etc.)
│   ├── lib/                         # Utilitats i serveis
│   └── .env.local                   # Variables d'entorn
│
├── 📱 mistic-pallars-app/         # Aplicació mòbil (React Native + Expo)
│   ├── src/
│   │   ├── contexts/                # Contexts (Auth, Location)
│   │   ├── navigation/              # Navegació React Navigation
│   │   ├── screens/                 # Pantalles de l'app
│   │   └── services/                # Serveis i API
│   ├── App.js                       # Punt d'entrada
│   └── .env                         # Variables d'entorn
│
└── 📚 docs/                        # Documentació
    └── GUIA_DESPLEGAMENT_COMPLET.md # Guia de desplegament
```

---

## 🛠️ Stack Tecnològic

### Backend
- **🗄️ Supabase**: PostgreSQL + Auth + Storage + Edge Functions
- **🗺️ Google Maps API**: Geolocalització i mapes
- **🔊 Supabase Storage**: Imatges i àudios de llegendes

### Web d'Administració
- **⚛️ React + Next.js 14**: Framework web modern
- **🎨 TailwindCSS**: Estilització útil i responsive
- **🧩 TypeScript**: Tipatge estàtic per millor qualitat
- **🗺️ @react-google-maps/api**: Integració Google Maps

### Aplicació Mòbil
- **⚛️ React Native + Expo**: Desenvolupament multiplataforma
- **🗄️ @supabase/supabase-js**: Client Supabase
- **🗺️ react-native-maps**: Mapes natius
- **🎧 expo-av**: Reproducció d'àudio
- **📍 expo-location**: Geolocalització

---

## 🚀 Inici Ràpid

### 1. Clona el Repositori
```bash
git clone [repository-url]
cd mistic-pallars
```

### 2. Configuració del Backend
1. Crear projecte a [Supabase](https://supabase.com)
2. Executar l'esquema SQL: `supabase/00_complete_schema.sql`
3. Anotar les credencials del projecte

### 3. Web d'Administració
```bash
cd mistic-pallars-admin
npm install

# Configurar .env.local amb les teves credencials
cp .env.local.example .env.local

# Executar en desenvolupament
npm run dev
```

### 4. Aplicació Mòbil
```bash
cd mistic-pallars-app
npm install

# Configurar .env amb les teves credencials
cp .env.example .env

# Executar amb Expo
expro start
```

### 5. Configuració Completa
Per instruccions detallades de desplegament, consulta:
📝 **[Guia de Desplegament Completa](docs/GUIA_DESPLEGAMENT_COMPLET.md)**

---

## 📱 Aplicació Mòbil - Funcionalitats

### 🏠 Pantalla Principal
- Mapa interactiu amb llegendes geolocalitzades
- Marcadors per categoria amb colors diferenciats
- Informació de distància i punts de recompensa
- Navegació per pestanyes intuitive

### 🔍 Explorar Llegendes
- Llistat complet amb cerca i filtres
- Ordenació per proximitat i categoria
- Visualització de dificultat i recompenses
- Sistema de favorits integrat

### 📏 Detall de Llegenda
- Text complet amb narració d'àudio
- Ubicació exacta al mapa
- Sistema de valoració amb estrelles
- Gamificació amb punts i progressió

### 👤 Perfil d'Usuari
- Estadístiques personals i progressió
- Historial d'activitat i puntuacions
- Configuració de preferències
- Gestió de compte segura

---

## 🌐 Web d'Administració - Funcionalitats

### 📋 Panell de Control
- Resum d'activitat i estadístiques
- Mètriques d'usuaris actius
- Monitoratge de valoracions
- Estat del sistema en temps real

### 🗺️ Gestió de Llegendes
- CRUD complet amb formularis intuitus
- Editor de text enriquit
- Integració Google Maps per ubicacions
- Gestió d'imatges i àudios
- Preview en temps real

### 👥 Gestió d'Usuaris
- Llistat d'usuaris registrats
- Veure perfils i activitat
- Moderació de contingut
- Estadístiques d'engagement

### ⚙️ Configuració
- Gestió de categories
- Configuració de puntuacions
- Paràmetres del sistema
- Exportació de dades

---

## 📆 Base de Dades

### Estructura Principal

**👤 usuaris**
- Perfils d'usuaris amb gamificació
- Puntuacions totals i progrés
- Metadata d'activitat

**📜 llegendes**
- Contingut principal amb geolocalització
- Text, imatges i àudios
- Categories i nivells de dificultat

**🏆 puntuacions**
- Sistema de recompenses
- Tracking d'exploració
- Historial d'activitat

**❤️ favorits**
- Llegendes guardades per usuari
- Accés ràpid a contingut preferit

**⭐ valoracions**
- Feedback d'usuaris
- Sistema d'estrelles 1-5
- Comentaris opcionals

**🔑 administradors**
- Accés al panell d'administració
- Control d'accés granular

---

## 🔐 Seguretat

### Row Level Security (RLS)
- Polítiques de seguretat per a totes les taules
- Accés controlat a dades personals
- Separació entre usuaris i administradors

### Autenticació
- Supabase Auth amb email/password
- Sessió segura amb JWT tokens
- Renovació automàtica de tokens

### Emmagatzematge
- Buckets separats per tipus de contingut
- Polítiques d'accés granulars
- URLs segures amb expiraió

---

## 🔧 Desenvolupament

### Contribuir al Projecte

1. **Fork del repositori**
2. **Crear branca de característica**
   ```bash
   git checkout -b feature/nova-funcionalitat
   ```
3. **Desenvolupar i testar**
4. **Commit amb missatges descriptius**
   ```bash
   git commit -m "feat: afegir sistema de notificacions"
   ```
5. **Push i Pull Request**
   ```bash
   git push origin feature/nova-funcionalitat
   ```

### Scripts Disponibles

#### Web d'Administració
```bash
npm run dev          # Desenvolupament
npm run build        # Build de producció
npm run start        # Servidor de producció
npm run lint         # Linting
npm run type-check   # Verificació TypeScript
```

#### Aplicació Mòbil
```bash
expro start          # Desenvolupament
expro start --android # Android específic
expro start --ios     # iOS específic
eas build            # Build de producció
eas submit           # Submissió a stores
```

---

## 🧪 Testing

### Web d'Administració
- Login d'administrador
- CRUD de llegendes complet
- Càrrega d'imatges i àudios
- Funcionalitat de mapes
- Responsive design

### Aplicació Mòbil
- Registre i login d'usuaris
- Geolocalització i permisos
- Reproducció d'àudio
- Navegació entre pantalles
- Sistema de puntuacions
- Funcionalitat offline bàsica

---

## 📦 Desplegament

### Entorns Recomanats

**Web d'Administració**:
- 🌐 **Vercel** (recomanat)
- 🌐 **Netlify**
- ☁️ **AWS Amplify**
- 🖥️ **VPS propi**

**Aplicació Mòbil**:
- 📱 **Expo Application Services (EAS)**
- 🏪 **App Store** (iOS)
- 🤖 **Google Play Store** (Android)
- 📋 **TestFlight** (testing iOS)

### Variables d'Entorn Necessàries

```env
# Supabase
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Només backend

# Google Maps
GOOGLE_MAPS_API_KEY=AIza...

# URLs
SITE_URL=https://admin.misticpallars.cat  # Web
APP_URL=com.misticpallars.app              # Mòbil
```

---

## 📊 Roadmap

### 🔴 Fase 1 (Actual)
- [x] Backend Supabase complet
- [x] Web d'administració funcional
- [x] Aplicació mòbil bàsica
- [x] Autenticació i seguretat
- [x] Sistema de gamificació

### 🔵 Fase 2 (Futur)
- [ ] Notificacions push
- [ ] Mode offline avançat
- [ ] Realitat augmentada (AR)
- [ ] Xarxes socials i compartició
- [ ] Àudio en múltiples idiomes

### 🟡 Fase 3 (Visió)
- [ ] IA per recomanacions
- [ ] Comunitat d'usuaris
- [ ] Gamificació avançada
- [ ] Integració IoT
- [ ] Expansió a altres regions

---

## 📝 Llicència

Aquest projecte està llicenciat sota la [MIT License](LICENSE).

---

## 📞 Contacte i Suport

- **Email**: info@misticpallars.cat
- **Web**: https://misticpallars.cat
- **Documentació**: [Guia Completa](docs/GUIA_DESPLEGAMENT_COMPLET.md)

---

## 🙏 Reconeixements

- **Llegendes del Pallars**: Tradició oral de la regió
- **Comunitat Open Source**: React, Next.js, Expo, Supabase
- **Google Maps**: Plataforma de mapes i geolocalització
- **Supabase**: Backend-as-a-Service complet

---

*Projecte desenvolupat amb ❤️ per preservar i compartir el patrimoni cultural del Pallars*

**MiniMax Agent** - *Gener 2025*