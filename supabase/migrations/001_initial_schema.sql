-- Mistic Pallars - Esquema inicial de base de dades
-- Data: 2025-08-13

-- Extensió per UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
    data_puntuacio TIMESTAMP DEFAULT NOW()
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

-- Índexs per optimitzar consultes
CREATE INDEX idx_llegendes_actiu ON llegendes(es_actiu);
CREATE INDEX idx_llegendes_categoria ON llegendes(categoria);
CREATE INDEX idx_llegendes_coordenades ON llegendes(latitud, longitud);
CREATE INDEX idx_puntuacions_usuari ON puntuacions(usuari_id);
CREATE INDEX idx_favorits_usuari ON favorits(usuari_id);
CREATE INDEX idx_valoracions_llegenda ON valoracions(llegenda_id);

-- Comentaris per documentació
COMMENT ON TABLE usuaris IS 'Usuaris de l''aplicació mòbil Mistic Pallars';
COMMENT ON TABLE llegendes IS 'Llegendes i mites del Pallars Jussà i Sobirà';
COMMENT ON TABLE puntuacions IS 'Sistema de gamificació - punts obtinguts per usuaris';
COMMENT ON TABLE favorits IS 'Llegendes marcades com a favorites pels usuaris';
COMMENT ON TABLE valoracions IS 'Valoracions dels usuaris per les llegendes (1-5 estrelles)';
COMMENT ON TABLE administradors IS 'Usuaris amb accés a la web d''administració';