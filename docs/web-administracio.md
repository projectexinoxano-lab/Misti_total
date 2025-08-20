# Mistic Pallars - Web d'Administració

## Descripció
Aplicació web d'administració desenvolupada amb Next.js 14 per gestionar les llegendes, usuaris i continguts de l'aplicació mòbil "Mistic Pallars".

## Característiques

### Funcionalitats Principals
- **Dashboard**: Visió general amb estadístiques i mètriques
- **Gestió de Llegendes**: CRUD complet amb editor rich text
- **Gestió d'Usuaris**: Visualització i anàlisi d'usuaris
- **Mapa Interactiu**: Visualització geogràfica amb Google Maps
- **Upload Multimèdia**: Pujada d'imatges i àudios
- **Estadístiques**: Mètriques detallades d'ús

### Tecnologies
- **Framework**: Next.js 14 amb App Router
- **TypeScript**: Tipat estàtic complet
- **Estils**: TailwindCSS amb components personalitzats
- **Base de Dades**: Supabase
- **Autenticació**: Supabase Auth
- **Mapes**: Google Maps API
- **Editor**: ReactQuill per contingut rich text
- **Formularis**: React Hook Form
- **Notificacions**: React Hot Toast

## Estructura del Projecte

```
mistic-pallars-admin/
├── app/                     # Next.js App Router
│   ├── page.tsx              # Dashboard principal
│   ├── layout.tsx            # Layout global
│   ├── llegendes/            # Gestió de llegendes
│   ├── usuaris/              # Gestió d'usuaris
│   └── mapa/                 # Mapa interactiu
├── components/             # Components reutilitzables
│   ├── Layout.tsx            # Layout de l'aplicació
│   ├── Header.tsx            # Capçalera
│   ├── Sidebar.tsx           # Navegació lateral
│   ├── LoginForm.tsx         # Formulari de login
│   ├── LlegendaForm.tsx      # Formulari de llegendes
│   └── LoadingSpinner.tsx    # Indicador de càrrega
├── contexts/               # React Contexts
│   └── AuthContext.tsx       # Context d'autenticació
├── hooks/                  # Custom hooks
│   └── useEstadistiques.ts   # Hook per estadístiques
├── lib/                    # Utilitats i configuració
│   └── supabase.ts           # Client i tipus Supabase
├── styles/                 # Estils globals
│   └── globals.css           # CSS personalitzat
├── package.json            # Dependències
├── next.config.js          # Configuració Next.js
├── tailwind.config.js      # Configuració TailwindCSS
└── tsconfig.json           # Configuració TypeScript
```

## Variables d'Entorn

Crear fitxer `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://sxtpbcboesvwcohtobfl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY_FROM_SUPABASE]
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=[GOOGLE_MAPS_API_KEY]
```

## Instal·lació i Configuració

### 1. Instal·lar Dependències
```bash
cd mistic-pallars-admin
npm install
# o
yarn install
# o
pnpm install
```

### 2. Configurar Variables d'Entorn
Copiar `.env.local` amb les claus correctes

### 3. Executar en Desenvolupament
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

L'aplicació estarà disponible a http://localhost:3000

### 4. Build per Producció
```bash
npm run build
npm run start
```

## Característiques d'Accés

### Autenticació
- Només usuaris registrats com a administradors poden accedir
- Autenticació via Supabase Auth
- Verificació automàtica de permisos d'administrador

### Rols d'Usuari
- **Administrador**: Accés complet a totes les funcionalitats
- **Usuari Normal**: Sense accés a l'aplicació d'administració

## Funcionalitats Detallades

### Dashboard
- Resum d'estadístiques principals
- Activitat recent dels usuaris
- Llegendes més populars
- Top usuaris per puntuació
- Mètriques de creixement

### Gestió de Llegendes
- Crear, editar i eliminar llegendes
- Editor rich text per contingut
- Upload d'imatges i àudios
- Assignació de coordenades GPS
- Categorizació i etiquetatge
- Vista prèvia abans de publicar
- Activar/desactivar llegendes

### Gestió d'Usuaris
- Visualització de tots els usuaris registrats
- Estadístiques de puntuació i nivells
- Filtrat per activitat i data de registre
- Informació detallada per usuari

### Mapa Interactiu
- Visualització de totes les llegendes en Google Maps
- Filtrat per categoria
- Markers personalitzats per categoria
- InfoWindows amb detalls de cada llegenda
- Restricció geogràfica al Pallars

### Upload de Multimèdia
- Pujada segura d'imatges (màx 5MB)
- Pujada d'àudios narratius (màx 50MB)
- Integració amb Supabase Storage
- Gestió automàtica d'URLs públiques

## Estils i Disseny

### Paleta de Colors
- **Primary**: Tons verds naturals (#349f5f)
- **Secondary**: Tons terra i marró (#9d7248)
- **Accent**: Blaus del cel (#0ea5e9)
- **Earth**: Tons ocres (#dc9a5a)

### Tipografia
- **Sans-serif**: Inter (textos generals)
- **Serif**: Playfair Display (títols destacats)

### Components
- Cards amb ombres suaus
- Botons amb transicions suaus
- Formularis ben estructurats
- Taules responsives
- Modal overlay per formularis

## Optimitzacions

### Rendiment
- Lazy loading de components pesats
- Optimització d'imatges automàtica
- Caching intel·ligent de dades
- Code splitting automàtic

### SEO
- Metadata optimitzat
- Estructura semàntica correcta
- URLs amigables

### Accessibilitat
- ARIA labels correctes
- Navegació per teclat
- Contrast de colors adequat
- Textos alternatius per imatges

## Integracions

### Supabase
- Autenticació i autorització
- Base de dades PostgreSQL
- Storage per multimèdia
- Edge Functions per lògica complexa
- Realtime subscriptions

### Google Maps
- Visualització de mapes
- Markers personalitzats
- InfoWindows interactives
- Geocoding i reverse geocoding

### APIs Externes
- Integració amb Edge Functions de Supabase
- Upload segur de fitxers
- Obtenció d'estadístiques en temps real

## Monitorització i Logs

### Error Handling
- Captura global d'errors
- Logging detallat a consola
- Notificacions d'error user-friendly
- Retry automàtic per operacions fallides

### Analytics
- Tracking d'accés d'administradors
- Mètriques d'ús de funcionalitats
- Temps de resposta d'operacions

## Seguretat

### Autenticació
- Tokens JWT segurs
- Refresh automàtic de sessions
- Logout automàtic per inactivitat

### Autorització
- Verificació de rols a cada request
- Protecció de rutes sensibles
- Validació de permisos per operació

### Protecció de Dades
- Validació d'inputs
- Sanitització de contingut HTML
- Protecció contra XSS i injeccions

## Manteniment

### Actualitzacions
- Dependències actualitzades regularment
- Migracions de base de dades documentades
- Versionat semàntic

### Backup
- Backup automàtic de configuració
- Exportació de dades crítiques
- Procediments de recuperació

## Suport
Per suport tècnic o preguntes sobre la implementació, consultar la documentació de Supabase i Next.js, o contactar amb l'equip de desenvolupament.