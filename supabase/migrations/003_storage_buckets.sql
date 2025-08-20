-- Mistic Pallars - Storage Buckets Configuration
-- Data: 2025-08-13

-- Crear bucket per imatges de llegendes
INSERT INTO storage.buckets (id, name, public)
VALUES ('llegendes-imatges', 'llegendes-imatges', true);

-- Crear bucket per àudios de llegendes
INSERT INTO storage.buckets (id, name, public)
VALUES ('llegendes-audios', 'llegendes-audios', true);

-- Crear bucket per avatars d'usuaris
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars-usuaris', 'avatars-usuaris', true);

-- Policies per bucket d'imatges
CREATE POLICY "Tothom pot veure imatges de llegendes" ON storage.objects
    FOR SELECT USING (bucket_id = 'llegendes-imatges');

CREATE POLICY "Només admins poden pujar imatges de llegendes" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'llegendes-imatges' AND
        EXISTS (
            SELECT 1 FROM administradors 
            WHERE administradors.id = auth.uid() 
            AND administradors.es_actiu = true
        )
    );

CREATE POLICY "Només admins poden actualitzar imatges de llegendes" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'llegendes-imatges' AND
        EXISTS (
            SELECT 1 FROM administradors 
            WHERE administradors.id = auth.uid() 
            AND administradors.es_actiu = true
        )
    );

CREATE POLICY "Només admins poden eliminar imatges de llegendes" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'llegendes-imatges' AND
        EXISTS (
            SELECT 1 FROM administradors 
            WHERE administradors.id = auth.uid() 
            AND administradors.es_actiu = true
        )
    );

-- Policies per bucket d'àudios
CREATE POLICY "Tothom pot veure àudios de llegendes" ON storage.objects
    FOR SELECT USING (bucket_id = 'llegendes-audios');

CREATE POLICY "Només admins poden pujar àudios de llegendes" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'llegendes-audios' AND
        EXISTS (
            SELECT 1 FROM administradors 
            WHERE administradors.id = auth.uid() 
            AND administradors.es_actiu = true
        )
    );

CREATE POLICY "Només admins poden actualitzar àudios de llegendes" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'llegendes-audios' AND
        EXISTS (
            SELECT 1 FROM administradors 
            WHERE administradors.id = auth.uid() 
            AND administradors.es_actiu = true
        )
    );

CREATE POLICY "Només admins poden eliminar àudios de llegendes" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'llegendes-audios' AND
        EXISTS (
            SELECT 1 FROM administradors 
            WHERE administradors.id = auth.uid() 
            AND administradors.es_actiu = true
        )
    );

-- Policies per bucket d'avatars
CREATE POLICY "Tothom pot veure avatars d'usuaris" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars-usuaris');

CREATE POLICY "Usuaris poden pujar el seu propi avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars-usuaris' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Usuaris poden actualitzar el seu propi avatar" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars-usuaris' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Usuaris poden eliminar el seu propi avatar" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars-usuaris' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );