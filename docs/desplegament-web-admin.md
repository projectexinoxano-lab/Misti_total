# Mistic Pallars - Guia de Desplegament Web d'Administració

## Prerequisits

### Serveis Necessaris
1. **Projecte Supabase** configurat i operatiu
2. **Google Maps API Key** amb les APIs habilitades:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. **Plataforma de desplegament** (Vercel recomanat)

### Eines de Desenvolupament
```bash
# Node.js 18+ requerit
node --version  # >= 18.0.0
npm --version   # >= 9.0.0

# Vercel CLI (opcional per desplegament)
npm install -g vercel
```

## Configuració Inicial

### 1. Clonar i Configurar el Projecte
```bash
# Navegar al directori del projecte
cd mistic-pallars-admin

# Instal·lar dependències
npm install

# Verificar que no hi ha errors
npm run type-check
```

### 2. Configurar Variables d'Entorn

Crear `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://sxtpbcboesvwcohtobfl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[OBTENIR_DEL_DASHBOARD_SUPABASE]

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=[OBTENIR_DE_GOOGLE_CLOUD_CONSOLE]
```

**Obtenir claus:**

**Supabase:**
1. Anar al dashboard de Supabase
2. Seleccionar el projecte "Mistic Pallars"
3. Settings > API
4. Copiar "Project URL" i "anon public"

**Google Maps:**
1. Google Cloud Console > APIs & Services
2. Crear API Key
3. Restringir a domini de producció
4. Habilitar APIs necessàries

### 3. Configurar Administradors

Afegir administradors a la base de dades:
```sql
-- Executar al SQL Editor de Supabase
INSERT INTO administradors (id, email, nom, es_actiu) VALUES
('[USER_UUID_FROM_AUTH_USERS]', 'admin@misticpallars.cat', 'Nom Administrador', true);
```

**Obtenir UUID d'usuari:**
1. L'usuari ha de registrar-se primer via Supabase Auth
2. Comprovar la taula `auth.users` per obtenir l'UUID
3. Afegir aquest UUID a la taula `administradors`

## Desplegament

### Opció 1: Vercel (Recomanat)

#### Via Dashboard Web
1. Anar a https://vercel.com
2. "New Project" > Importar des de Git
3. Seleccionar el repositori
4. Configurar variables d'entorn:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
5. Desplegar

#### Via CLI
```bash
# Login a Vercel
vercel login

# Primer desplegament
vercel

# Configurar variables d'entorn
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# Redesplegar amb variables
vercel --prod
```

### Opció 2: Netlify

1. Connectar repositori a Netlify
2. Configuració de build:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
3. Variables d'entorn:
   - Afegir les mateixes variables que Vercel
4. Desplegar

### Opció 3: AWS Amplify

1. AWS Console > Amplify
2. "Host web app" > Connectar repositori
3. Configuració de build:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
4. Variables d'entorn segons documentació AWS

### Opció 4: Servidor Propi (Docker)

Crear `Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

Crear `docker-compose.yml`:
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
    restart: unless-stopped
```

Desplegar:
```bash
# Construir i executar
docker-compose up -d

# Verificar
docker-compose logs web
```

## Configuració Post-Desplegament

### 1. Verificar Funcionalitats

**Checklist de verificació:**
- [ ] Login d'administrador funciona
- [ ] Dashboard carrega correctament
- [ ] Gestió de llegendes operativa
- [ ] Upload d'imatges i àudios funciona
- [ ] Mapa es carrega i mostra marcadors
- [ ] Estadístiques es generen
- [ ] Logout funciona correctament

### 2. Configurar Domini Personalitzat

**Per Vercel:**
```bash
# Afegir domini
vercel domains add admin.misticpallars.cat

# Configurar DNS
# CNAME: admin -> cname.vercel-dns.com
```

**Per Netlify:**
1. Site settings > Domain management
2. Afegir domini personalitzat
3. Configurar DNS segons instruccions

### 3. Configurar HTTPS
- Vercel i Netlify proporcionen HTTPS automàtic
- Per servidors propis, configurar certificats SSL/TLS

### 4. Configurar Monitorització

**Uptime Monitoring:**
```bash
# Exemple amb curl per monitorització bàsica
curl -f https://admin.misticpallars.cat/api/health || echo "Site down"
```

**Error Tracking:**
- Integrar Sentry per tracking d'errors
- Configurar alertes per errors crítics

## Configuració de Seguretat

### 1. Restricció d'Accés

**Headers de Seguretat** (afegir a `next.config.js`):
```javascript
const nextConfig = {
  // ... configuració existent
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

### 2. Configurar CORS a Supabase

1. Dashboard Supabase > Settings > API
2. Afegir el domini de producció a "CORS origins"
3. Exemple: `https://admin.misticpallars.cat`

### 3. Restricció d'IP (Opcional)

**Per Vercel:**
```javascript
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const allowedIPs = ['192.168.1.1', '10.0.0.1']; // IPs permeses
  const clientIP = request.ip || request.headers.get('x-forwarded-for');
  
  if (!allowedIPs.includes(clientIP)) {
    return new NextResponse('Access Denied', { status: 403 });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api/health).*)',
};
```

## Optimització de Rendiment

### 1. Caching

**Next.js Caching:**
```javascript
// next.config.js
const nextConfig = {
  // Cache estàtic
  experimental: {
    staticPageGenerationTimeout: 120,
  },
  // Compressió
  compress: true,
};
```

### 2. Optimització d'Imatges

**next.config.js:**
```javascript
const nextConfig = {
  images: {
    domains: ['sxtpbcboesvwcohtobfl.supabase.co'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 dies
  },
};
```

### 3. Bundle Analysis

```bash
# Instal·lar analyzer
npm install --save-dev @next/bundle-analyzer

# Analitzar bundle
ANALYZE=true npm run build
```

## Actualitzacions i Manteniment

### 1. Procediment d'Actualització

```bash
# 1. Backup actual
git tag v1.0.0

# 2. Actualitzar codi
git pull origin main

# 3. Actualitzar dependències
npm update

# 4. Test local
npm run build
npm run start

# 5. Desplegar
vercel --prod
```

### 2. Rollback en cas d'Error

**Vercel:**
```bash
# Llistar desplegaments
vercel list

# Tornar a versió anterior
vercel rollback [DEPLOYMENT_URL]
```

### 3. Monitorització Contínua

```bash
# Script de monitorització (executar amb cron)
#!/bin/bash
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://admin.misticpallars.cat)
if [ $STATUS -ne 200 ]; then
  echo "Site down: HTTP $STATUS" | mail -s "Alert" admin@misticpallars.cat
fi
```

## Resolucio de Problemes

### Errors Comuns

1. **"Hydration failed"**
   - Verificar que no hi ha diferencies entre SSR i client
   - Comprovar local storage access

2. **"Maps API not loaded"**
   - Verificar Google Maps API key
   - Comprovar què les APIs estan habilitades
   - Verificar restriccions de domini

3. **"Authentication failed"**
   - Verificar Supabase URL i keys
   - Comprovar que l'usuari és administrador
   - Verificar CORS settings

4. **"Upload failed"**
   - Verificar storage buckets
   - Comprovar polítiques RLS
   - Verificar mides de fitxer

### Logs i Debugging

**Vercel:**
```bash
# Logs en temps real
vercel logs [DEPLOYMENT_URL] --follow

# Logs per funció
vercel logs [DEPLOYMENT_URL] --scope=function
```

**Local debugging:**
```bash
# Mode debug
DEBUG=* npm run dev

# Logs detallats
NODE_ENV=development npm run dev
```

## Configuració Avanzada

### 1. Multi-environment

```bash
# Entorns diferents
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_URL development
```

### 2. CI/CD Pipeline

**GitHub Actions** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 3. Backup Automàtic

```bash
#!/bin/bash
# backup-config.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mistic-pallars-admin"

# Backup codi
git archive --format=tar.gz --prefix=mistic-pallars-admin-$DATE/ HEAD > $BACKUP_DIR/code-$DATE.tar.gz

# Backup variables d'entorn (sense claus)
vercel env ls > $BACKUP_DIR/env-vars-$DATE.txt

echo "Backup completat: $DATE"
```

## Contacte i Suport

Per problemes tècnics:
1. Revisar aquesta documentació
2. Comprovar logs d'error
3. Verificar configuració de variables d'entorn
4. Contactar amb l'equip de desenvolupament

**Recursos addicionals:**
- [Documentació Next.js](https://nextjs.org/docs)
- [Documentació Vercel](https://vercel.com/docs)
- [Documentació Supabase](https://supabase.io/docs)
- [Google Maps API Docs](https://developers.google.com/maps/documentation)