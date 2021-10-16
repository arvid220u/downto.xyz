CREATE TABLE IF NOT EXISTS users (email text, pk text, primary key (email));

CREATE TABLE IF NOT EXISTS secrets (email1 text, email2 text, sk1 text, sk2 text, vk1 text, vk2 text, primary key (email1, email2));

CREATE TABLE IF NOT EXISTS likes (identifier text, submitter int, primary key (identifier));