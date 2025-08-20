-- Mistic Pallars - Dades de mostra per desenvolupament
-- Data: 2025-08-13

-- Inserir llegendes de mostra del Pallars
INSERT INTO llegendes (titol, descripcio_curta, text_complet, latitud, longitud, categoria) VALUES
('La Llegenda del Lac de Saboredo', 
 'Una misteriosa llegenda sobre les aigües màgiques del llac de Saboredo al Parc Nacional d''Aigüestortes.', 
 'Al cor del Parc Nacional d''Aigüestortes i Estany de Sant Maurici, el llac de Saboredo guarda una antiga llegenda. Es diu que en les seves aigües cristal·lines viuen les fades de la muntanya, que surten a la superfície durant les nits de lluna plena. Els pastors de la zona asseguren haver vist llums dansant sobre l''aigua i haver sentit càntics melodiosos que els han guiat quan s''havien perdut entre la boira. La llegenda explica que aquells que beben de les seves aigües amb cor pur obtenen la protecció de les fades per sempre més, però els que ho fan amb males intencions queden condemnats a vagar eternament per les muntanyes sense trobar mai el camí de tornada.',
 42.5680, 0.9970, 'Fades i éssers màgics'),

('El Tresor dels Catars de Montgarri', 
 'La història del tresor ocult dels càtars al santuari de Montgarri, que mai ha estat trobat.', 
 'Al segle XIII, durant la croada albigesa, un grup de càtars va buscar refugi al remot santuari de Montgarri, a la Vall d''Aran. Abans de ser descoberts per les tropes franceses, van amagar un tresor immens en alguna caverna secreta de les muntanyes circumdants. El tresor contenia no només or i pedres precioses, sinó també textos sagrats amb coneixements ancestrals. Malgrat els segles transcorreguts i les nombroses expedicions, el tresor mai ha estat trobat. Els habitants de la zona expliquen que de tant en tant es veuen llums estranyes a la muntanya i que aquells que s''apropen massa a la cerca del tresor desapareixen misteriosament, protegits pels esperits dels càtars que encara guarden el seu secret.',
 42.7069, 0.9660, 'Tresors ocults'),

('La Bruixa de la Vall de Boí', 
 'La història de Maria la Bruixa, que protegia els pobles de la Vall de Boí amb els seus encanteris.', 
 'A la Vall de Boí, durant el segle XVII, vivia una dona anomenada Maria que tenia el do de curar amb herbes i de predir el futur. Els habitants de Taüll, Boí i Erill la Vall acudien a ella en temps de necessitat. Quan una terrible epidèmia va assolar la regió, Maria va fer un ritual ancestral al cim del Pic de Peguera, sacrificant la seva pròpia vida per salvar els pobles. Des de llavors, els pastors asseguren que la seva ànima protegeix la vall, especialment durant les tempestes i les ventiscades. Es diu que quan algú està en perill a la muntanya, una figura femenina vestida de blanc apareix per guiar-lo cap a lloc segur. Les esglésies romàniques de la vall conserven encara avui amuletos que, segons la tradició, van ser beneïts per la pròpia Maria.',
 42.5090, 0.8376, 'Bruixes i curanderes'),

('El Drac de la Noguera Pallaresa', 
 'Un temible drac que vivia a les gorges de la Noguera Pallaresa i aterroritzava els pobles riberencs.', 
 'En temps antics, un drac ferotge habitava a les gorges més profundes de la Noguera Pallaresa, entre Llavorsí i Rialp. La bèstia tenia la pell com l''esmalte verd del riu i respirava una boira tòxica que matava les collites i enverinava l''aigua. Els pobles de la zona vivien aterrits, ja que el drac sortia de les seves cavernes aquàtiques per devorar el bestiar i, segons deien, també algunes persones. Un dia, un cavaller valent anomenat Arnau de Pallars va decidir enfrontar-se al monstre. Després d''una batalla èpica que va durar tres dies i tres nits, va aconseguir ferir mortalment el drac. En morir, la sang de la criatura va tenyir per sempre de color rogenc certes roques del riu, que encara avui es poden veure prop de la Pobla de Segur. Es diu que l''esperit del drac encara vigila les aigües i que els ràfters més agosarats poden sentir el seu rugit entre els rapids.',
 42.4250, 1.0333, 'Dracs i monstres'),

('Les Ànimes del Coll de Fadas', 
 'La inquietant història de les ànimes perdudes que vagen pel Coll de Fadas, buscant el descansi etern.', 
 'El Coll de Fadas, un port de muntanya entre el Pallars i la Val d''Aran, és conegut per les seves aparicions espectrals. Segons la llegenda, durant una tempesta de neu del segle XVIII, una caravana de comerciants va quedar aïllada i tots van morir de fred. Des de llavors, les seves ànimes vagen pel coll durant les nits de boira, buscant el camí cap a l''altre món. Els caminants i pastors que travessen el coll expliquen haver vist figures blanquinoses que caminen en silenci i que desapareixen quan s''hi acosten. Alguns asseguren haver sentit crits lamentosos portats pel vent i haver trobat petjades a la neu que no duien enlloc. La tradició diu que aquells que deixin una espelma encesa al coll durant la nit de Tots Sants ajuden les ànimes a trobar la pau i reben la seva benedicció i protecció durant els viatges per la muntanya.',
 42.6500, 0.8800, 'Esperits i fantasmes');

-- Inserir administrador de mostra
INSERT INTO administradors (id, email, nom) VALUES
('00000000-0000-0000-0000-000000000000', 'admin@misticpallars.cat', 'Administrador Principal');

-- Comentaris sobre les dades de mostra
COMMENT ON TABLE llegendes IS 'Taula poblada amb llegendes reals del Pallars per l''aplicació Mistic Pallars';