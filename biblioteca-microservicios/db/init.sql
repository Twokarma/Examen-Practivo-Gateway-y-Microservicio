-- =====================================================================
--  Biblioteca Digital - Esquema y datos de prueba
--  Se ejecuta automáticamente la PRIMERA vez que arranca el contenedor
--  de PostgreSQL (volumen vacío), gracias a /docker-entrypoint-initdb.d
-- =====================================================================

-- ---------------------------- TABLAS ---------------------------------
CREATE TABLE IF NOT EXISTS autores (
    id            SERIAL PRIMARY KEY,
    nombre        VARCHAR(150) NOT NULL,
    nacionalidad  VARCHAR(80)
);

CREATE TABLE IF NOT EXISTS libros (
    id                SERIAL PRIMARY KEY,
    titulo            VARCHAR(200) NOT NULL,
    isbn              VARCHAR(30)  NOT NULL UNIQUE,
    "anioPublicacion" INTEGER,
    disponible        BOOLEAN NOT NULL DEFAULT TRUE,
    "autorId"         INTEGER REFERENCES autores(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_libros_autor ON libros ("autorId");

-- ------------------------ DATOS DE PRUEBA ----------------------------
-- 10 autores
INSERT INTO autores (id, nombre, nacionalidad) VALUES
 (1,  'Gabriel García Márquez', 'Colombiana'),
 (2,  'Isabel Allende',         'Chilena'),
 (3,  'Mario Vargas Llosa',     'Peruana'),
 (4,  'Jorge Luis Borges',      'Argentina'),
 (5,  'George R. R. Martin',    'Estadounidense'),
 (6,  'J. K. Rowling',          'Británica'),
 (7,  'Julio Cortázar',         'Argentina'),
 (8,  'Pablo Neruda',           'Chilena'),
 (9,  'Alcides Arguedas',       'Boliviana'),
 (10, 'Jaime Sáenz',            'Boliviana');

-- 20 libros (algunos no disponibles, para probar el campo "disponible")
INSERT INTO libros (id, titulo, isbn, "anioPublicacion", disponible, "autorId") VALUES
 (1,  'Cien años de soledad',                            '978-0307474728', 1967, TRUE,  1),
 (2,  'El amor en los tiempos del cólera',               '978-0307389732', 1985, TRUE,  1),
 (3,  'Crónica de una muerte anunciada',                 '978-1400034956', 1981, FALSE, 1),
 (4,  'La casa de los espíritus',                        '978-0553383805', 1982, TRUE,  2),
 (5,  'Eva Luna',                                        '978-0553383812', 1987, TRUE,  2),
 (6,  'La ciudad y los perros',                          '978-8420471839', 1963, TRUE,  3),
 (7,  'Conversación en La Catedral',                     '978-8420471846', 1969, FALSE, 3),
 (8,  'Ficciones',                                       '978-0802130303', 1944, TRUE,  4),
 (9,  'El Aleph',                                        '978-0142437889', 1949, TRUE,  4),
 (10, 'Juego de tronos',                                 '978-8496208964', 1996, TRUE,  5),
 (11, 'Choque de reyes',                                 '978-8496208971', 1998, FALSE, 5),
 (12, 'Harry Potter y la piedra filosofal',              '978-8478884452', 1997, TRUE,  6),
 (13, 'Harry Potter y la cámara secreta',                '978-8478884957', 1998, TRUE,  6),
 (14, 'Rayuela',                                         '978-8437604572', 1963, TRUE,  7),
 (15, 'Bestiario',                                       '978-8420471853', 1951, FALSE, 7),
 (16, 'Veinte poemas de amor y una canción desesperada', '978-9500721455', 1924, TRUE,  8),
 (17, 'Canto general',                                   '978-9500721462', 1950, TRUE,  8),
 (18, 'Raza de bronce',                                  '978-9995420001', 1919, TRUE,  9),
 (19, 'Pueblo enfermo',                                  '978-9995420018', 1909, FALSE, 9),
 (20, 'Felipe Delgado',                                  '978-9995420025', 1979, TRUE,  10);

-- Ajusta las secuencias para que los próximos INSERT (desde la API) no choquen con los ids cargados
SELECT setval(pg_get_serial_sequence('autores', 'id'), (SELECT MAX(id) FROM autores));
SELECT setval(pg_get_serial_sequence('libros',  'id'), (SELECT MAX(id) FROM libros));
