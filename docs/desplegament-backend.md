# Mistic Pallars - Guia de Desplegament Backend

## Prerequisits

1. **Compte Supabase**
   - Crear compte a https://supabase.com
   - Crear nou projecte "Mistic Pallars"

2. **Eines Necessàries**
   ```bash
   # Instal·lar Supabase CLI
   npm install -g supabase
   
   # Verificar instal·lació
   supabase --version
   ```

## Pas a Pas

### 1. Configuració Inicial

```bash
# Login a Supabase
supabase login

# Inicialitzar projecte local
supabase init

# Enllaçar amb projecte remot
supabase link --project-ref [PROJECT_ID]
```

### 2. Configurar Variables d'Entorn

Obtenir del dashboard de Supabase:
- Project URL
- Anon key
- Service role key

```bash
# .env.local
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]
```

### 3. Executar Migracions

#### Opció A: Via SQL Editor (Recomanat)
1. Anar al dashboard de Supabase
2. SQL Editor
3. Executar en ordre:
   - `001_initial_schema.sql`
   - `002_rls_policies.sql`  
   - `003_storage_buckets.sql`
   - `004_sample_data.sql`

#### Opció B: Via CLI
```bash
# Aplicar migracions
supabase db push

# Verificar estat
supabase db status
```

### 4. Configurar Storage

```bash
# Els buckets es creen automàticament amb les migracions
# Verificar al dashboard: Storage > Buckets
```

### 5. Desplegar Edge Functions

```bash
# Desplegar totes les funcions
supabase functions deploy llegendes-proximitat
supabase functions deploy upload-multimedia
supabase functions deploy gestio-puntuacions
supabase functions deploy estadistiques-admin
supabase functions deploy favorits-valoracions

# Verificar desplegament
supabase functions list
```

### 6. Configurar Autenticació

#### Email Auth
1. Dashboard > Authentication > Settings
2. Habilitar "Enable email confirmations"
3. Configurar email templates en català

#### Google OAuth
1. Crear projecte a Google Cloud Console
2. Habilitar Google+ API
3. Crear credencials OAuth 2.0
4. Afegir a Supabase: Authentication > Providers > Google

### 7. Configurar Administradors

```sql
-- Afegir administradors inicials
INSERT INTO administradors (id, email, nom) VALUES
('[USER_UUID_FROM_AUTH]', 'admin@misticpallars.cat', 'Nom Administrador');
```

### 8. Testejar Edge Functions

```bash
# Test proximitat
curl -X POST 'https://[PROJECT_ID].supabase.co/functions/v1/llegendes-proximitat' \
  -H 'Authorization: Bearer [ANON_KEY]' \
  -H 'Content-Type: application/json' \
  -d '{
    "latitud": 42.5680,
    "longitud": 0.9970,
    "radi": 10
  }'

# Test estadístiques (requereix token d'admin)
curl -X GET 'https://[PROJECT_ID].supabase.co/functions/v1/estadistiques-admin' \
  -H 'Authorization: Bearer [USER_JWT_TOKEN]' \
  -H 'apikey: [ANON_KEY]'
```

### 9. Configurar Polítiques RLS Addicionals (Opcional)

```sql
-- Exemple: Política personalitzada
CREATE POLICY "Usuaris VIP poden veure estadístiques" ON usuaris
  FOR SELECT USING (
    puntuacio_total > 1000
  );
```

### 10. Backup Inicial

```bash
# Backup d'esquema
supabase db dump --schema-only > schema_backup.sql

# Backup amb dades
supabase db dump --data-only > data_backup.sql
```

## Verificació del Desplegament

### Checklist
- [ ] Totes les taules existeixen
- [ ] Polítiques RLS aplicades
- [ ] Storage buckets configurats
- [ ] Edge Functions desplegades
- [ ] Dades de mostra carregades
- [ ] Autenticació configurada
- [ ] Administradors afegits
- [ ] Tests d'API funcionen

### URLs per Verificar
- Dashboard: `https://supabase.com/dashboard/project/[PROJECT_ID]`
- API Base: `https://[PROJECT_ID].supabase.co/rest/v1/`
- Functions: `https://[PROJECT_ID].supabase.co/functions/v1/`
- Storage: `https://[PROJECT_ID].supabase.co/storage/v1/`

## Resolucio de Problemes

### Errors Comuns

1. **"relation does not exist"**
   - Verificar que les migracions s'han executat
   - Comprovar connexió a la base de dades correcta

2. **"row-level security policy"**
   - Verificar polítiques RLS
   - Comprovar autenticació d'usuari

3. **"function does not exist"**
   - Re-desplegar Edge Functions
   - Verificar logs de desplegament

4. **"storage bucket not found"**
   - Executar migració 003_storage_buckets.sql
   - Verificar polítiques de storage

### Logs i Debugging

```bash
# Logs d'Edge Functions
supabase functions logs [FUNCTION_NAME]

# Logs de base de dades
supabase logs db

# Logs d'autenticació
supabase logs auth
```

## Actualitzacions

### Per afegir noves funcionalitats:

1. Crear nova migració: `005_new_feature.sql`
2. Actualitzar Edge Functions si cal
3. Testejar en entorn de desenvolupament
4. Aplicar en producció

### Versionat

```bash
# Crear tag de versió
git tag v1.0.0
git push origin v1.0.0

# Backup abans d'actualitzacions
supabase db dump > backup_pre_update_$(date +%Y%m%d).sql
```