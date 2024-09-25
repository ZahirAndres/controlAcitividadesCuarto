-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-09-2024 a las 00:38:55
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `controlactividadesutng`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cancha`
--

CREATE TABLE `cancha` (
  `idCancha` int(11) NOT NULL,
  `nombre` varchar(70) NOT NULL,
  `latitud` decimal(10,8) NOT NULL,
  `longitud` decimal(11,8) NOT NULL,
  `precio` float NOT NULL,
  `descripcion` varchar(250) DEFAULT NULL,
  `estado` varchar(15) DEFAULT NULL,
  `idResp` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `cancha`
--

INSERT INTO `cancha` (`idCancha`, `nombre`, `latitud`, `longitud`, `precio`, `descripcion`, `estado`, `idResp`) VALUES
(1, 'Cancha de Fútbol', 19.43260800, -99.13320900, 5002, 'Cancha de césped artificial', 'Disponible', 1),
(22, 'Nombre', 0.00000000, 0.00000000, 234, 'dsfdsf', 'Disponible', 4),
(27, 'dfsrgf', 21.18014281, -100.92974294, 432243, 'fghv', 'Disponible', 1),
(28, '', 21.13371931, -100.93351086, 0, '', 'Disponible', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `edificio`
--

CREATE TABLE `edificio` (
  `idEdificio` int(11) NOT NULL,
  `nombEdificio` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `edificio`
--

INSERT INTO `edificio` (`idEdificio`, `nombEdificio`) VALUES
(1, 'a');

--
-- Disparadores `edificio`
--
DELIMITER $$
CREATE TRIGGER `before_insert_in_build` BEFORE INSERT ON `edificio` FOR EACH ROW BEGIN
    -- Verifica si el nombre del edificio ya existe
    IF EXISTS (SELECT 1 FROM edificio WHERE nombEdificio = NEW.nombEdificio) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El nombre del edificio ya existe.';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `idReserva` int(11) NOT NULL,
  `horaInicio` time NOT NULL,
  `horaFin` time NOT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `areaUsar` varchar(20) NOT NULL,
  `fecha` date NOT NULL,
  `razon` varchar(5000) NOT NULL,
  `idResp` int(11) DEFAULT NULL,
  `idCancha` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `responsable`
--

CREATE TABLE `responsable` (
  `idResp` int(11) NOT NULL,
  `nombUsuario` varchar(50) NOT NULL,
  `contrasenia` varbinary(32) NOT NULL,
  `nombres` varchar(50) NOT NULL,
  `appPaterno` varchar(50) NOT NULL,
  `appMaterno` varchar(50) DEFAULT NULL,
  `telefono` varchar(10) DEFAULT NULL,
  `correoElec` varchar(260) DEFAULT NULL,
  `numControl` varchar(20) DEFAULT NULL,
  `grupo` varchar(20) DEFAULT NULL,
  `idRoles` int(11) DEFAULT NULL,
  `correoVerificado` tinyint(1) DEFAULT 0,
  `tokenVerificacion` varchar(255) DEFAULT NULL,
  `tokenExpiracion` datetime DEFAULT NULL,
  `longitud` double DEFAULT NULL,
  `latitud` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `responsable`
--

INSERT INTO `responsable` (`idResp`, `nombUsuario`, `contrasenia`, `nombres`, `appPaterno`, `appMaterno`, `telefono`, `correoElec`, `numControl`, `grupo`, `idRoles`, `correoVerificado`, `tokenVerificacion`, `tokenExpiracion`, `longitud`, `latitud`) VALUES
(1, 'MrMexico2014', 0x4c696e75783230323421, 'Zahir Andrés', 'Rodríguez', 'Mora', '4281061609', 'rodriguez.mora.zahir.15@gmail.com', '1223100456', 'GDS0632', 4, 0, NULL, NULL, -100.930421, 21.1673),
(2, 'otro', 0x4c696e75783230323421, 'Ejemplo', 'E', 'J', '4281234567', 'mrmexico2014@gmail.com', '1223456', 'GDS0632', 2, 0, NULL, NULL, 0, 0),
(3, '', 0x4c696e75783230323421, '', '', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, 0),
(4, 'propietario', 0x4c696e75783230323421, 'Maestro', 'Hernández', 'De Artes', '4342343243', 'rodrigueewrwerwea.zahir.15@gmail.com', NULL, NULL, 2, 0, NULL, NULL, 0, 0);

--
-- Disparadores `responsable`
--
DELIMITER $$
CREATE TRIGGER `before_insert_update_responsable` BEFORE INSERT ON `responsable` FOR EACH ROW BEGIN
    -- Verifica si el nombre de usuario ya existe
    IF EXISTS (SELECT 1 FROM responsable WHERE nombUsuario = NEW.nombUsuario) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El nombre de usuario ya existe.';
    END IF;

    -- Verifica si el teléfono ya existe
    IF EXISTS (SELECT 1 FROM responsable WHERE telefono = NEW.telefono) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El teléfono ya existe.';
    END IF;

    -- Verifica si el correo electrónico ya existe
    IF EXISTS (SELECT 1 FROM responsable WHERE correoElec = NEW.correoElec) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El correo electrónico ya existe.';
    END IF;

    -- Verifica si el número de control ya existe
    IF EXISTS (SELECT 1 FROM responsable WHERE numControl = NEW.numControl) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El número de control ya existe.';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `idRoles` int(11) NOT NULL,
  `rol` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`idRoles`, `rol`) VALUES
(1, 'Administrador'),
(4, 'Boss'),
(3, 'Propietario'),
(2, 'Usuario');

--
-- Disparadores `rol`
--
DELIMITER $$
CREATE TRIGGER `before_insert_in_rol` BEFORE INSERT ON `rol` FOR EACH ROW BEGIN
    -- Verifica si el nombre del rol ya existe
    IF EXISTS (SELECT 1 FROM rol WHERE rol = NEW.rol) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El nombre del rol ya existe.';
    END IF;
END
$$
DELIMITER ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cancha`
--
ALTER TABLE `cancha`
  ADD PRIMARY KEY (`idCancha`),
  ADD KEY `idResp` (`idResp`);

--
-- Indices de la tabla `edificio`
--
ALTER TABLE `edificio`
  ADD PRIMARY KEY (`idEdificio`),
  ADD UNIQUE KEY `nombEdificio` (`nombEdificio`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`idReserva`),
  ADD KEY `idResp` (`idResp`),
  ADD KEY `idCancha` (`idCancha`);

--
-- Indices de la tabla `responsable`
--
ALTER TABLE `responsable`
  ADD PRIMARY KEY (`idResp`),
  ADD UNIQUE KEY `nombUsuario` (`nombUsuario`),
  ADD UNIQUE KEY `telefono` (`telefono`),
  ADD UNIQUE KEY `correoElec` (`correoElec`),
  ADD KEY `idRoles` (`idRoles`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`idRoles`),
  ADD UNIQUE KEY `rol` (`rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cancha`
--
ALTER TABLE `cancha`
  MODIFY `idCancha` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `edificio`
--
ALTER TABLE `edificio`
  MODIFY `idEdificio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `idReserva` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `responsable`
--
ALTER TABLE `responsable`
  MODIFY `idResp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `idRoles` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cancha`
--
ALTER TABLE `cancha`
  ADD CONSTRAINT `cancha_ibfk_1` FOREIGN KEY (`idResp`) REFERENCES `responsable` (`idResp`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`idResp`) REFERENCES `responsable` (`idResp`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`idCancha`) REFERENCES `cancha` (`idCancha`) ON DELETE SET NULL;

--
-- Filtros para la tabla `responsable`
--
ALTER TABLE `responsable`
  ADD CONSTRAINT `responsable_ibfk_1` FOREIGN KEY (`idRoles`) REFERENCES `rol` (`idRoles`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
