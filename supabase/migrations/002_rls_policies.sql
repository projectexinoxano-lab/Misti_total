-- Mistic Pallars - Row Level Security Policies
-- Data: 2025-08-13

-- Activar RLS per totes les taules
ALTER TABLE usuaris ENABLE ROW LEVEL SECURITY;
ALTER TABLE llegendes ENABLE ROW LEVEL SECURITY;
ALTER TABLE puntuacions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorits ENABLE ROW LEVEL SECURITY;
ALTER TABLE valoracions ENABLE ROW LEVEL SECURITY;
ALTER TABLE administradors ENABLE ROW LEVEL SECURITY;

-- Policies per taula usuaris
CREATE POLICY "Usuaris poden veure el seu propi perfil" ON usuaris
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuaris poden actualitzar el seu propi perfil" ON usuaris
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Nou usuari pot crear el seu perfil" ON usuaris
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies per taula llegendes
CREATE POLICY "Tothom pot veure llegendes actives" ON llegendes
    FOR SELECT USING (es_actiu = true);

CREATE POLICY "Només admins poden gestionar llegendes" ON llegendes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM administradors 
            WHERE administradors.id = auth.uid() 
            AND administradors.es_actiu = true
        )
    );

-- Policies per taula puntuacions
CREATE POLICY "Usuaris poden veure les seves puntuacions" ON puntuacions
    FOR SELECT USING (auth.uid() = usuari_id);

CREATE POLICY "Usuaris poden afegir puntuacions pròpies" ON puntuacions
    FOR INSERT WITH CHECK (auth.uid() = usuari_id);

-- Policies per taula favorits
CREATE POLICY "Usuaris poden veure els seus favorits" ON favorits
    FOR SELECT USING (auth.uid() = usuari_id);

CREATE POLICY "Usuaris poden gestionar els seus favorits" ON favorits
    FOR ALL USING (auth.uid() = usuari_id);

-- Policies per taula valoracions
CREATE POLICY "Tothom pot veure valoracions" ON valoracions
    FOR SELECT USING (true);

CREATE POLICY "Usuaris poden gestionar les seves valoracions" ON valoracions
    FOR ALL USING (auth.uid() = usuari_id);

-- Policies per taula administradors
CREATE POLICY "Només admins poden veure altres admins" ON administradors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM administradors 
            WHERE administradors.id = auth.uid() 
            AND administradors.es_actiu = true
        )
    );