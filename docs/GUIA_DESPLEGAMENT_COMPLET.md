# 🚀 GUIA DE DESPLEGAMENT COMPLET - MISTIC PALLARS

## 📋 Resum del Projecte

**Mistic Pallars** és una aplicació completa per explorar les llegendes del Pallars que inclou:

- **📱 Aplicació Mòbil**: React Native amb Expo per iOS i Android
- **🌐 Web d'Administració**: Next.js per gestionar contingut
- **🗄️ Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **🗺️ Integració**: Google Maps API per geolocalització

---

## 🛠️ DESPLEGAMENT DEL BACKEND (SUPABASE)

### 1. Configuració Inicial de Supabase

#### Pas 1: Configurar el Projecte
```bash
# 1. Accedir a https://supabase.com
# 2. Crear un nou projecte
# 3. Anotar:
#    - Project URL: https://[project-id].supabase.co
#    - Anon Key: eyJ...
#    - Service Role Key: eyJ... (per Edge Functions)
```

#### Pas 2: Aplicar l'Esquema de Base de Dades

1. **Anar al SQL Editor de Supabase**
2. **Executar l'esquema complet**:
   ```sql
   # Copiar i enganxar tot el contingut de:
   supabase/00_complete_schema.sql
   ```

3. **Verificar les taules creades**:
   - `usuaris`
   - `llegendes`
   - `puntuacions`
   - `favorits`
   - `valoracions`
   - `administradors`
   - `categories`

#### Pas 3: Configurar Storage
Les políticas de storage ja estan incloses a l'esquema, però verifica que els buckets s'han creat:
- `llegendes-imatges`
- `llegendes-audios` 
- `avatars-usuaris`

### 2. Edge Functions (Opcional)

Si necessites funcions serverless personalitzades:

```bash
# Instal·lar Supabase CLI
npm install -g supabase

# Inicialitzar projecte local
supabase login
supabase init

# Desplegar funcions
supabase functions deploy function-name
```

---

## 🌐 DESPLEGAMENT WEB D'ADMINISTRACIÓ (NEXT.JS)

### 1. Preparació Local

```bash
# Navegar al directori
cd mistic-pallars-admin

# Instal·lar dependències
npm install
# o
yarn install
# o 
pnpm install
```

### 2. Configuració d'Variables d'Entorn

Editar `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://[el-teu-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[la-teva-anon-key]
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=[la-teva-google-maps-key]
NEXT_PUBLIC_SITE_URL=https://admin.misticpallars.cat
```

### 3. Crear Administrador Inicial

```sql
-- Executar al SQL Editor de Supabase
INSERT INTO administradors (id, email, nom) VALUES
('[uuid-del-teu-usuari]', 'admin@misticpallars.cat', 'Administrador Principal');
```

### 4. Opcions de Desplegament

#### Opció A: Vercel (Recomanat)

```bash
# Instal·lar Vercel CLI
npm install -g vercel

# Desplegar
vercel

# Configurar variables d'entorn a Vercel Dashboard
# Afegir domini personalitzat si és necessari
```

#### Opció B: Netlify

```bash
# Build del projecte
npm run build

# Pujar dist/ a Netlify
# Configurar variables d'entorn al dashboard
```

#### Opció C: VPS/Servidor Propi

```bash
# Generar build de producció
npm run build

# Configurar servidor (nginx, apache, etc.)
# Exemple nginx:
server {
    listen 80;
    server_name admin.misticpallars.cat;
    root /var/www/mistic-pallars-admin/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 📱 DESPLEGAMENT APLICACIÓ MÒBIL (REACT NATIVE + EXPO)

### 1. Preparació Local

```bash
# Navegar al directori
cd mistic-pallars-app

# Instal·lar dependències
npm install
# o
yarn install
```

### 2. Configuració d'Variables d'Entorn

Editar `.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://[el-teu-project-id].supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=[la-teva-anon-key]
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=[la-teva-google-maps-key]
```

### 3. Configuració d'Expo

Editar `app.json`:
```json
{
  "expo": {
    "name": "Mistic Pallars",
    "slug": "mistic-pallars",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.misticpallars.app"
    },
    "android": {
      "package": "com.misticpallars.app"
    }
  }
}
```

### 4. Desplegament

#### Desenvolupament i Testing

```bash
# Instal·lar Expo CLI
npm install -g @expo/cli

# Executar en desenvolupament
expro start

# Provar en dispositius
expro start --android
expro start --ios
```

#### Build de Producció

```bash
# Configurar EAS (Expo Application Services)
eas login
eas init

# Build per Android
eas build --platform android

# Build per iOS (necessita compte Apple Developer)
eas build --platform ios

# Submissió a les app stores
eas submit --platform android
eas submit --platform ios
```

#### Alternativa: Expo Go (Testing)

```bash
# Publicar a Expo Go per testing
expro publish
```

---

## 🔑 CONFIGURACIÓ D'APIs EXTERNES

### Google Maps API

1. **Anar a Google Cloud Console**
2. **Crear/seleccionar projecte**
3. **Activar APIs**:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Directions API

4. **Crear clau API**:
   - Restriccions per domini (web)
   - Restriccions per aplicació (mòbil)

5. **Configurar facturació** (necessari per producció)

---

## 🔐 SEGURETAT I CONFIGURACIÓ

### 1. Row Level Security (RLS)

Totes les polítiques RLS estan configurades a l'esquema inicial. Verificar:

```sql
-- Comprovar que RLS està actiu
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### 2. Variables d'Entorn Segures

**❌ NEVER en codi font**:
- Service Role Keys
- Private Keys
- Passwords

**✅ Variables d'entorn segures**:
- Anon Keys (són públiques però limitades)
- URLs públiques
- Configuracions públiques

### 3. Configuració de CORS

A Supabase Dashboard → Settings → API:
- Afegir dominis de les aplicacions
- Configurar origens permesos

---

## 🧪 TESTING I VALIDACIÓ

### 1. Testing del Backend

```sql
-- Test de dades de mostra
SELECT COUNT(*) FROM llegendes WHERE es_actiu = true;
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM administradors;
```

### 2. Testing de l'Aplicació Web

```bash
# Executar en local
cd mistic-pallars-admin
npm run dev

# Verificar:
# - Login d'administrador
# - CRUD de llegendes
# - Mapa amb marcadors
# - Carrega d'imatges
```

### 3. Testing de l'Aplicació Mòbil

```bash
# Executar en local
cd mistic-pallars-app
expro start

# Verificar:
# - Registre i login d'usuaris
# - Visualització de mapa
# - Detall de llegendes
# - Sistema de puntuacions
# - Funcionalitat de favorits
```

---

## 🚨 RESOLUCIÓ DE PROBLEMES

### Problemes Comuns

#### 1. Error de CORS
```
Solució: Verificar configuració CORS a Supabase
Afegir domini correcte a allowed origins
```

#### 2. Google Maps no carrega
```
Solució: 
- Verificar clau API
- Comprovar restriccions de domini
- Activar APIs necessàries
- Configurar facturació
```

#### 3. Autenticació falla
```
Solució:
- Verificar URL i claus de Supabase
- Comprovar políticas RLS
- Verificar administradors a la base de dades
```

#### 4. Edge Functions fallen
```
Solució:
- Verificar Service Role Key
- Comprovar logs a Supabase
- Validar sintaxi de la funció
```

### Logs i Debugging

```bash
# Logs de Supabase
# Dashboard → Logs → seleccionar servei

# Logs de Vercel
vercel logs [deployment-url]

# Logs d'Expo
expro logs
```

---

## 📊 MONITORATGE I MANTENIMENT

### 1. Mètriques Clau

- **Users actius**: Dashboard de Supabase
- **Ús d'API**: Google Cloud Console
- **Performance web**: Vercel Analytics
- **Crashes mòbil**: Expo Analytics

### 2. Backups

```sql
-- Backup manual de dades
pg_dump [connection-string] > backup.sql

-- Supabase fa backups automàtics
-- Dashboard → Settings → Database → Backups
```

### 3. Actualitzacions

```bash
# Actualitzar dependencies
npm update

# Actualitzar Expo SDK
expro upgrade

# Actualitzar Next.js
npm install next@latest
```

---

## 🎯 CHECKLIST DE DESPLEGAMENT

### Pre-desplegament
- [ ] Supabase projecte creat
- [ ] Esquema de base de dades aplicat
- [ ] Google Maps API configurada
- [ ] Variables d'entorn configurades
- [ ] Administrador inicial creat

### Desplegament Web
- [ ] Build de producció generat
- [ ] Variables d'entorn configurades al hosting
- [ ] Domini configurat (si escau)
- [ ] HTTPS activat
- [ ] Login d'administrador testat

### Desplegament Mòbil
- [ ] App compilada per Android/iOS
- [ ] Variables d'entorn configurades
- [ ] Permisos de localització configurats
- [ ] Testing en dispositius reals
- [ ] Submissió a app stores (opcional)

### Post-desplegament
- [ ] Verificar totes les funcionalitats
- [ ] Configurar monitoratge
- [ ] Documentar credencials de manera segura
- [ ] Planificar backups regulars

---

## 📞 SUPORT

Per qualsevol problema durant el desplegament:

1. **Revisar aquesta documentació**
2. **Comprovar logs del servei afectat**
3. **Verificar configuració de variables d'entorn**
4. **Consultar documentació oficial**:
   - [Supabase Docs](https://supabase.com/docs)
   - [Next.js Docs](https://nextjs.org/docs)
   - [Expo Docs](https://docs.expo.dev/)
   - [Google Maps API](https://developers.google.com/maps)

---

*Documentació creada per MiniMax Agent - Gener 2025*