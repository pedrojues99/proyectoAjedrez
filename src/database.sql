create database Ajedrez;

create table usuarios(
    id SERIAL,
    nombre varchar NOT NULL,
    email varchar NOT NULL,
    contrasenna varchar NOT NULL,
    codigoCookie varchar
);

insert into usuarios(nombre, email, contrasenna) values
('Pedro', 'xpedro88x@gmail.com', '1234'),
('Ana', 'anamariajues96@gmail.com', '1234');

create table partidas(
    id SERIAL,
    jugador1 int NOT NULL,
    jugador2 int NOT NULL,
    movimientos int NOT NULL,
    posicion character varying NOT NULL,
    estado boolean NOT NULL
);

insert into partidas(jugador1, jugador2, movimientos, posicion, estado) values
('1', '2', '0', '2345643211111111000000000000000000000000000000007777777789ABCA98', true);