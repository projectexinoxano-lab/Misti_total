# Mistic Pallars - Backend Supabase

## Descripció
Backend complet per a l'aplicació mòbil "Mistic Pallars" que gestiona llegendes i mites del Pallars Jussà i Sobirà.

## Configuració Inicial

### 1. Variables d'Entorn Requerides
```bash
SUPABASE_URL=https://sxtpbcboesvwcohtobfl.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4dHBiY2JvZXN2d2NvaHRvYmZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjA1NDUsImV4cCI6MjA3MDU5NjU0NX0.XjPo0SECrPr6JKznDbNz2W2HEpC4GM4I3Fx191l5oAQ
SUPABASE_SERVICE_ROLE_KEY=[OBTENIR DEL DASHBOARD SUPABASE]
```

### 2. Execució de Migracions
Executar en ordre a la consola SQL de Supabase:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_storage_buckets.sql`
4. `supabase/migrations/004_sample_data.sql`

### 3. Desplegament d'Edge Functions
```bash
# Instal·lar Supabase CLI
npm install -g supabase

# Login
supabase login

# Enllaçar projecte
supabase link --project-ref sxtpbcboesvwcohtobfl

# Desplegar Edge Functions
supabase functions deploy llegendes-proximitat
supabase functions deploy upload-multimedia
supabase functions deploy gestio-puntuacions
supabase functions deploy estadistiques-admin
supabase functions deploy favorits-valoracions
```

## Esquema de Base de Dades

### Taules Principals

#### `usuaris`
- `id` (UUID, PK): Identificador únic
- `email` (VARCHAR): Email únic de l'usuari
- `nom` (VARCHAR): Nom de l'usuari
- `avatar_url` (TEXT): URL de l'avatar
- `puntuacio_total` (INTEGER): Puntuació acumulada
- `data_creacio` (TIMESTAMP): Data de registre
- `ultima_connexio` (TIMESTAMP): Última activitat

#### `llegendes`
- `id` (UUID, PK): Identificador únic
- `titol` (VARCHAR): Títol de la llegenda
- `descripcio_curta` (TEXT): Descripció breu
- `text_complet` (TEXT): Text complet de la llegenda
- `latitud` (DECIMAL): Coordenada de latitud
- `longitud` (DECIMAL): Coordenada de longitud
- `imatge_url` (TEXT): URL de la imatge
- `audio_url` (TEXT): URL de l'àudio
- `categoria` (VARCHAR): Categoria de la llegenda
- `es_actiu` (BOOLEAN): Estat d'activació

#### `puntuacions`
- Sistema de gamificació que assigna punts per accions
- Accions: llegir, escoltar àudio, visitar ubicació, compartir, valorar

#### `favorits`
- Permet als usuaris marcar llegendes com a favorites
- Relació única usuari-llegenda

#### `valoracions`
- Valoracions de 1-5 estrelles per llegenda
- Una valoració per usuari i llegenda

#### `administradors`
- Usuaris amb accés a la web d'administració

## Storage Buckets

### `llegendes-imatges`
- Emmagatzema imatges de les llegendes
- Accés públic de lectura
- Només administradors poden escriure

### `llegendes-audios`
- Emmagatzema àudios narratius de les llegendes
- Accés públic de lectura
- Només administradors poden escriure

### `avatars-usuaris`
- Emmagatzema avatars dels usuaris
- Cada usuari pot gestionar només el seu propi avatar

## Edge Functions

### `llegendes-proximitat`
**URL:** `/functions/v1/llegendes-proximitat`
**Mètode:** POST

**Paràmetres:**
```json
{
  "latitud": 42.5680,
  "longitud": 0.9970,
  "radi": 10
}
```

**Resposta:**
```json
{
  "data": {
    "llegendes": [
      {
        "id": "uuid",
        "titol": "La Llegenda del Lac de Saboredo",
        "descripcio_curta": "...",
        "distancia": 2.5,
        "es_favorit": false,
        "valoracio_usuari": null
      }
    ],
    "total": 3,
    "radi_km": 10
  }
}
```

### `upload-multimedia`
**URL:** `/functions/v1/upload-multimedia`
**Mètode:** POST
**Autenticació:** Requerida (Administrador)

**Paràmetres:**
```json
{
  "fileData": "data:image/jpeg;base64,...",
  "fileName": "imatge.jpg",
  "fileType": "image/jpeg",
  "llegendaId": "uuid-opcional"
}
```

### `gestio-puntuacions`
**URL:** `/functions/v1/gestio-puntuacions`
**Mètode:** POST
**Autenticació:** Requerida

**Tipus d'accions i punts:**
- `llegir_llegenda`: 10 punts
- `escoltar_audio`: 15 punts
- `visitar_ubicacio`: 25 punts
- `compartir_llegenda`: 5 punts
- `valorar_llegenda`: 3 punts

### `estadistiques-admin`
**URL:** `/functions/v1/estadistiques-admin`
**Mètode:** GET
**Autenticació:** Requerida (Administrador)

**Retorna:**
- Resum general (usuaris, llegendes, puntuacions)
- Activitat setmanal
- Puntuacions per categoria
- Llegendes més populars
- Top usuaris

### `favorits-valoracions`
**URL:** `/functions/v1/favorits-valoracions/[favorits|valoracions]`
**Mètodes:** GET, POST
**Autenticació:** Requerida

## Row Level Security (RLS)

### Polítiques Implementades

1. **usuaris**: Només poden veure/editar el seu propi perfil
2. **llegendes**: Lectura pública de llegendes actives, escriptura només per admins
3. **puntuacions**: Usuaris veuen només les seves puntuacions
4. **favorits**: Gestio privada per usuari
5. **valoracions**: Lectura pública, escriptura privada
6. **administradors**: Accés restringit entre administradors

## Dades de Mostra

S'inclouen 5 llegendes de mostra del Pallars:

1. **La Llegenda del Lac de Saboredo** (Fades i éssers màgics)
2. **El Tresor dels Càtars de Montgarri** (Tresors ocults)
3. **La Bruixa de la Vall de Boí** (Bruixes i curanderes)
4. **El Drac de la Noguera Pallaresa** (Dracs i monstres)
5. **Les Ànimes del Coll de Fadas** (Esperits i fantasmes)

Totes amb coordenades reals del Pallars i textos complets narratius.

## Autenticació

Utilitza Supabase Auth amb suport per:
- Email/contrasenya
- Google OAuth
- Gestió automàtica de sessions
- Tokens JWT segurs

## Monitorització i Logs

- Tots els Edge Functions inclouen logging detallat
- Gestió d'errors unificada
- CORS configurat per accés des d'aplicacions mòbils

## Backup i Manteniment

### Backup Recomanat
```bash
# Backup de dades
pg_dump $DATABASE_URL > backup_mistic_pallars_$(date +%Y%m%d).sql

# Backup de storage
# Utilitzar eines de backup de Supabase Storage
```

### Manteniment
- Revisar logs d'Edge Functions regularment
- Monitoritzar ús d'Storage buckets
- Actualitzar dades de mostra periòdicament
- Revisar polítiques RLS segons necessitats