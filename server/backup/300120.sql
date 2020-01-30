-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 30, 2020 at 04:55 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `overbets`
--

-- --------------------------------------------------------

--
-- Table structure for table `bet`
--

CREATE TABLE `bet` (
  `bet_id` int(11) NOT NULL,
  `bet_uid` varchar(40) NOT NULL,
  `bet_userId` int(11) NOT NULL,
  `bet_datetime` datetime NOT NULL,
  `bet_matchId` int(11) NOT NULL,
  `bet_side` int(11) NOT NULL COMMENT '0 = team one, 1 = team 2',
  `bet_amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `matches`
--

CREATE TABLE `matches` (
  `match_id` int(11) NOT NULL,
  `match_mid` int(11) NOT NULL,
  `match_datetime` datetime NOT NULL,
  `match_teamOneId` int(11) NOT NULL,
  `match_teamTwoId` int(11) NOT NULL,
  `match_ended` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `player`
--

CREATE TABLE `player` (
  `player_id` int(7) NOT NULL,
  `player_ign` varchar(20) NOT NULL,
  `player_role` int(11) NOT NULL COMMENT '0 - tanks, 1 - dps, 2 - supps, 3 - flex',
  `player_name` text NOT NULL,
  `player_country` varchar(3) NOT NULL,
  `player_team_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE `team` (
  `team_id` int(11) NOT NULL,
  `team_fullname` text NOT NULL,
  `team_shortname` varchar(10) NOT NULL,
  `team_color` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `user_battletag` varchar(100) NOT NULL,
  `user_dateregistered` datetime NOT NULL,
  `user_coins` int(11) NOT NULL DEFAULT 100,
  `user_image` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bet`
--
ALTER TABLE `bet`
  ADD PRIMARY KEY (`bet_id`),
  ADD KEY `bet_userId` (`bet_userId`),
  ADD KEY `bet_matchId` (`bet_matchId`),
  ADD KEY `bet_matchId_2` (`bet_matchId`),
  ADD KEY `bet_userId_2` (`bet_userId`);

--
-- Indexes for table `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`match_id`),
  ADD KEY `match_id` (`match_id`),
  ADD KEY `match_teamOneId` (`match_teamOneId`),
  ADD KEY `match_teamTwoId` (`match_teamTwoId`),
  ADD KEY `match_teamOneId_2` (`match_teamOneId`),
  ADD KEY `match_teamTwoId_2` (`match_teamTwoId`);

--
-- Indexes for table `player`
--
ALTER TABLE `player`
  ADD UNIQUE KEY `player_pid` (`player_id`),
  ADD KEY `player_team_id` (`player_team_id`),
  ADD KEY `player_team_id_2` (`player_team_id`);

--
-- Indexes for table `team`
--
ALTER TABLE `team`
  ADD UNIQUE KEY `team_id` (`team_id`),
  ADD KEY `team_id_2` (`team_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bet`
--
ALTER TABLE `bet`
  MODIFY `bet_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `matches`
--
ALTER TABLE `matches`
  MODIFY `match_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bet`
--
ALTER TABLE `bet`
  ADD CONSTRAINT `bet_ibfk_1` FOREIGN KEY (`bet_matchId`) REFERENCES `matches` (`match_id`),
  ADD CONSTRAINT `bet_ibfk_2` FOREIGN KEY (`bet_userId`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `matches`
--
ALTER TABLE `matches`
  ADD CONSTRAINT `matches_ibfk_1` FOREIGN KEY (`match_teamOneId`) REFERENCES `team` (`team_id`),
  ADD CONSTRAINT `matches_ibfk_2` FOREIGN KEY (`match_teamTwoId`) REFERENCES `team` (`team_id`);

--
-- Constraints for table `player`
--
ALTER TABLE `player`
  ADD CONSTRAINT `player_ibfk_1` FOREIGN KEY (`player_team_id`) REFERENCES `team` (`team_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
