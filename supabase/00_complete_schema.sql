-- ========================================
-- MISTIC PALLARS - ESQUEMA COMPLET DE BASE DE DADES
-- Data: 2025-08-13
-- Descripció: Esquema complet per l'aplicació de llegendes del Pallars
-- ========================================

-- Extensió per UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- TAULES PRINCIPALS
-- ========================================

-- Taula usuaris
CREATE TABLE usuaris (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(255),
    avatar_url TEXT,
    puntuacio_total INTEGER DEFAULT 0,
    data_creacio TIMESTAMP DEFAULT NOW(),
    ultima_connexio TIMESTAMP DEFAULT NOW()
);

-- Taula llegendes
CREATE TABLE llegendes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titol VARCHAR(255) NOT NULL,
    descripcio_curta TEXT,
    text_complet TEXT NOT NULL,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    imatge_url TEXT,
    audio_url TEXT,
    categoria VARCHAR(100),
    dificultat INTEGER DEFAULT 1 CHECK (dificultat BETWEEN 1 AND 5),
    punts_recompensa INTEGER DEFAULT 10,
    es_actiu BOOLEAN DEFAULT true,
    data_creacio TIMESTAMP DEFAULT NOW(),
    data_actualitzacio TIMESTAMP DEFAULT NOW()
);

-- Taula puntuacions
CREATE TABLE puntuacions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuari_id UUID NOT NULL,
    llegenda_id UUID NOT NULL,
    punts INTEGER DEFAULT 0,
    data_puntuacio TIMESTAMP DEFAULT NOW(),
    UNIQUE(usuari_id, llegenda_id)
);

-- Taula favorits
CREATE TABLE favorits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuari_id UUID NOT NULL,
    llegenda_id UUID NOT NULL,
    data_favorit TIMESTAMP DEFAULT NOW(),
    UNIQUE(usuari_id, llegenda_id)
);

-- Taula valoracions
CREATE TABLE valoracions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuari_id UUID NOT NULL,
    llegenda_id UUID NOT NULL,
    valoracio INTEGER CHECK (valoracio BETWEEN 1 AND 5),
    comentari TEXT,
    data_valoracio TIMESTAMP DEFAULT NOW(),
    UNIQUE(usuari_id, llegenda_id)
);

-- Taula administradors (per web admin)
CREATE TABLE administradors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(255) NOT NULL,
    es_actiu BOOLEAN DEFAULT true,
    data_creacio TIMESTAMP DEFAULT NOW()
);

-- Taula categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) UNIQUE NOT NULL,
    descripcio TEXT,
    icona VARCHAR(50),
    color VARCHAR(7) DEFAULT '#3B82F6'
);

-- ========================================
-- ÍNDEXS PER OPTIMITZAR CONSULTES
-- ========================================

CREATE INDEX idx_llegendes_actiu ON llegendes(es_actiu);
CREATE INDEX idx_llegendes_categoria ON llegendes(categoria);
CREATE INDEX idx_llegendes_coordenades ON llegendes(latitud, longitud);
CREATE INDEX idx_puntuacions_usuari ON puntuacions(usuari_id);
CREATE INDEX idx_favorits_usuari ON favorits(usuari_id);
CREATE INDEX idx_valoracions_llegenda ON valoracions(llegenda_id);
CREATE INDEX idx_usuaris_email ON usuaris(email);
CREATE INDEX idx_usuaris_puntuacio ON usuaris(puntuacio_total DESC);

-- ========================================
-- ROW LEVEL SECURITY POLICIES
-- ========================================

-- Activar RLS per totes les taules
ALTER TABLE usuaris ENABLE ROW LEVEL SECURITY;
ALTER TABLE llegendes ENABLE ROW LEVEL SECURITY;
ALTER TABLE puntuacions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorits ENABLE ROW LEVEL SECURITY;
ALTER TABLE valoracions ENABLE ROW LEVEL SECURITY;
ALTER TABLE administradors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

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

-- Policies per taula categories
CREATE POLICY "Tothom pot veure categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Només admins poden gestionar categories" ON categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM administradors 
            WHERE administradors.id = auth.uid() 
            AND administradors.es_actiu = true
        )
    );

-- ========================================
-- STORAGE BUCKETS CONFIGURATION
-- ========================================

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

-- Policies per bucket d'avatars
CREATE POLICY "Tothom pot veure avatars d'usuaris" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars-usuaris');

CREATE POLICY "Usuaris poden pujar el seu propi avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars-usuaris' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- ========================================
-- DADES D'EXEMPLE
-- ========================================

-- Inserir categories
INSERT INTO categories (nom, descripcio, icona, color) VALUES
('Fades i éssers màgics', 'Llegendes sobre criatures fantàstiques', '🧚‍♀️', '#8B5CF6'),
('Tresors ocults', 'Històries de tresors perduts i secrets', '💎', '#F59E0B'),
('Bruixes i curanderes', 'Relats de dones amb poders màgics', '🔮', '#EC4899'),
('Dracs i monstres', 'Criatures temibles de la muntanya', '🐉', '#EF4444'),
('Esperits i fantasmes', 'Ànimes que vagen per la muntanya', '👻', '#6B7280'),
('Llegendes històriques', 'Relats basats en fets històrics', '🏰', '#10B981');

-- Inserir llegendes de mostra del Pallars
INSERT INTO llegendes (titol, descripcio_curta, text_complet, latitud, longitud, categoria, dificultat, punts_recompensa) VALUES
('La Llegenda del Lac de Saboredo', 
 'Una misteriosa llegenda sobre les aigües màgiques del llac de Saboredo al Parc Nacional d''Aigüestortes.', 
 'Al cor del Parc Nacional d''Aigüestortes i Estany de Sant Maurici, el llac de Saboredo guarda una antiga llegenda. Es diu que en les seves aigües cristal·lines viuen les fades de la muntanya, que surten a la superfície durant les nits de lluna plena. Els pastors de la zona asseguren haver vist llums dansant sobre l''aigua i haver sentit càntics melodiosos que els han guiat quan s''havien perdut entre la boira. La llegenda explica que aquells que beven de les seves aigües amb cor pur obtenen la protecció de les fades per sempre més, però els que ho fan amb males intencions queden condemnats a vagar eternament per les muntanyes sense trobar mai el camí de tornada.',
 42.5680, 0.9970, 'Fades i éssers màgics', 3, 25),

('El Tresor dels Catars de Montgarri', 
 'La història del tresor ocult dels càtars al santuari de Montgarri, que mai ha estat trobat.', 
 'Al segle XIII, durant la croada albigesa, un grup de càtars va buscar refugi al remot santuari de Montgarri, a la Vall d''Aran. Abans de ser descoberts per les tropes franceses, van amagar un tresor immens en alguna caverna secreta de les muntanyes circumdants. El tresor contenia no només or i pedres precioses, sinó també textos sagrats amb coneixements ancestrals. Malgrat els segles transcorreguts i les nombroses expedicions, el tresor mai ha estat trobat. Els habitants de la zona expliquen que de tant en tant es veuen llums estranyes a la muntanya i que aquells que s''apropen massa a la cerca del tresor desapareixen misteriosament, protegits pels esperits dels càtars que encara guarden el seu secret.',
 42.7069, 0.9660, 'Tresors ocults', 4, 35),

('La Bruixa de la Vall de Boí', 
 'La història de Maria la Bruixa, que protegia els pobles de la Vall de Boí amb els seus encanteris.', 
 'A la Vall de Boí, durant el segle XVII, vivia una dona anomenada Maria que tenia el do de curar amb herbes i de predir el futur. Els habitants de Taüll, Boí i Erill la Vall acudien a ella en temps de necessitat. Quan una terrible epidèmia va assolar la regió, Maria va fer un ritual ancestral al cim del Pic de Peguera, sacrificant la seva pròpia vida per salvar els pobles. Des de llavors, els pastors asseguren que la seva ànima protegeix la vall, especialment durant les tempestes i les ventiscades. Es diu que quan algú està en perill a la muntanya, una figura femenina vestida de blanc apareix per guiar-lo cap a lloc segur. Les esglésies romàniques de la vall conserven encara avui amuletos que, segons la tradició, van ser beneïts per la pròpia Maria.',
 42.5090, 0.8376, 'Bruixes i curanderes', 2, 20),

('El Drac de la Noguera Pallaresa', 
 'Un temible drac que vivia a les gorges de la Noguera Pallaresa i aterroritzava els pobles riberencs.', 
 'En temps antics, un drac ferotge habitava a les gorges més profundes de la Noguera Pallaresa, entre Llavorsí i Rialp. La bèstia tenia la pell com l''esmalte verd del riu i respirava una boira tòxica que matava les collites i enverinava l''aigua. Els pobles de la zona vivien aterrits, ja que el drac sortia de les seves cavernes aquàtiques per devorar el bestiar i, segons deien, també algunes persones. Un dia, un cavaller valent anomenat Arnau de Pallars va decidir enfrontar-se al monstre. Després d''una batalla èpica que va durar tres dies i tres nits, va aconseguir ferir mortalment el drac. En morir, la sang de la criatura va tenyir per sempre de color rogenc certes roques del riu, que encara avui es poden veure prop de la Pobla de Segur. Es diu que l''esperit del drac encara vigila les aigües i que els ràfters més agosarats poden sentir el seu rugit entre els rapids.',
 42.4250, 1.0333, 'Dracs i monstres', 5, 50),

('Les Ànimes del Coll de Fadas', 
 'La inquietant història de les ànimes perdudes que vagen pel Coll de Fadas, buscant el descans etern.', 
 'El Coll de Fadas, un port de muntanya entre el Pallars i la Val d''Aran, és conegut per les seves aparicions espectrals. Segons la llegenda, durant una tempesta de neu del segle XVIII, una caravana de comerciants va quedar aïllada i tots van morir de fred. Des de llavors, les seves ànimes vagen pel coll durant les nits de boira, buscant el camí cap a l''altre món. Els caminants i pastors que travessen el coll expliquen haver vist figures blanquinoses que caminen en silenci i que desapareixen quan s''hi acosten. Alguns asseguren haver sentit crits lamentosos portats pel vent i haver trobat petjades a la neu que no duien enlloc. La tradició diu que aquells que deixin una espelma encesa al coll durant la nit de Tots Sants ajuden les ànimes a trobar la pau i reben la seva benedicció i protecció durant els viatges per la muntanya.',
 42.6500, 0.8800, 'Esperits i fantasmes', 3, 30);

-- Inserir administrador de mostra
INSERT INTO administradors (id, email, nom) VALUES
('00000000-0000-0000-0000-000000000000', 'admin@misticpallars.cat', 'Administrador Principal');

-- ========================================
-- COMENTARIS PER DOCUMENTACIÓ
-- ========================================

COMMENT ON TABLE usuaris IS 'Usuaris de l''aplicació mòbil Mistic Pallars';
COMMENT ON TABLE llegendes IS 'Llegendes i mites del Pallars Jussà i Sobirà';
COMMENT ON TABLE puntuacions IS 'Sistema de gamificació - punts obtinguts per usuaris';
COMMENT ON TABLE favorits IS 'Llegendes marcades com a favorites pels usuaris';
COMMENT ON TABLE valoracions IS 'Valoracions dels usuaris per les llegendes (1-5 estrelles)';
COMMENT ON TABLE administradors IS 'Usuaris amb accés a la web d''administració';
COMMENT ON TABLE categories IS 'Categories de llegendes per classificar el contingut';

-- ========================================
-- FUNCIONS PERSONALITZADES
-- ========================================

-- Funció per actualitzar la puntuació total d'un usuari
CREATE OR REPLACE FUNCTION actualitzar_puntuacio_usuari()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE usuaris 
    SET puntuacio_total = (
        SELECT COALESCE(SUM(punts), 0) 
        FROM puntuacions 
        WHERE usuari_id = NEW.usuari_id
    )
    WHERE id = NEW.usuari_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger per actualitzar puntuació automàticament
CREATE TRIGGER trigger_actualitzar_puntuacio
    AFTER INSERT OR UPDATE ON puntuacions
    FOR EACH ROW
    EXECUTE FUNCTION actualitzar_puntuacio_usuari();

-- Funció per obtenir llegendes properes
CREATE OR REPLACE FUNCTION obtenir_llegendes_properes(
    lat_usuari DECIMAL,
    lng_usuari DECIMAL,
    radi_km INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    titol VARCHAR(255),
    descripcio_curta TEXT,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    categoria VARCHAR(100),
    distancia_km DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.titol,
        l.descripcio_curta,
        l.latitud,
        l.longitud,
        l.categoria,
        ROUND(
            6371 * acos(
                cos(radians(lat_usuari)) * 
                cos(radians(l.latitud)) * 
                cos(radians(l.longitud) - radians(lng_usuari)) + 
                sin(radians(lat_usuari)) * 
                sin(radians(l.latitud))
            ),
            2
        ) AS distancia_km
    FROM llegendes l
    WHERE l.es_actiu = true
    AND (
        6371 * acos(
            cos(radians(lat_usuari)) * 
            cos(radians(l.latitud)) * 
            cos(radians(l.longitud) - radians(lng_usuari)) + 
            sin(radians(lat_usuari)) * 
            sin(radians(l.latitud))
        )
    ) <= radi_km
    ORDER BY distancia_km;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- FI DE L'ESQUEMA
-- ========================================
