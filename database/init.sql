-- Voyanta Vacations database initialization

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacations_project`
--

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `user_id` int UNSIGNED NOT NULL,
  `vacation_id` int UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`user_id`, `vacation_id`, `created_at`, `updated_at`) VALUES
(2, 1, '2026-07-05 07:56:06', '2026-07-05 07:56:06'),
(2, 4, '2026-07-05 07:56:06', '2026-07-05 07:56:06'),
(2, 10, '2026-07-05 07:56:06', '2026-07-05 07:56:06'),
(2, 11, '2026-07-05 07:56:06', '2026-07-05 07:56:06');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Kamal', 'Weshahi', 'admin@voyanta.local', '486a8dcd2beac334c0af8d263280cdb1d423cf220588a32a58fdda136f0fd71c', 'admin', '2026-07-05 07:56:06', '2026-07-05 07:56:06'),
(2, 'Demo', 'Traveler', 'user@voyanta.local', '305e5cce9aa82302df5be7abcdf1e98b08c7a8599df5ca38ede570daf36885f8', 'user', '2026-07-05 07:56:06', '2026-07-05 07:56:06');

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `id` int UNSIGNED NOT NULL,
  `destination` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `price` decimal(10,2) UNSIGNED NOT NULL,
  `image_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`id`, `destination`, `description`, `start_date`, `end_date`, `price`, `image_name`, `created_at`, `updated_at`) VALUES
(1, 'Kyoto, Japan', 'A thoughtful journey through temple gardens, lantern-lit alleys, tea houses, and the bamboo groves of Arashiyama.', '2026-08-09', '2026-08-15', 2190.00, 'http://localhost:4566/vacation-images/kyoto.jpg', '2026-07-05 07:56:06', '2026-07-05 07:56:06'),
(2, 'Amalfi Coast, Italy', 'Clifftop villages, lemon groves, turquoise coves, and slow Mediterranean dinners along Italy’s celebrated southern coast.', '2026-09-05', '2026-09-11', 2450.00, 'http://localhost:4566/vacation-images/amalfi.jpg', '2026-07-05 07:56:06', '2026-07-05 07:56:06'),
(3, 'Reykjavik, Iceland', 'Volcanic landscapes, geothermal lagoons, waterfalls, and a guided route beneath the northern sky.', '2026-10-08', '2026-10-14', 2890.00, 'http://localhost:4566/vacation-images/reykjavik.jpg', '2026-07-05 07:56:06', '2026-07-05 07:56:06'),
(4, 'Marrakech, Morocco', 'Courtyard riads, fragrant souks, Atlas Mountain views, and a desert evening under a wide Saharan sky.', '2026-07-03', '2026-07-09', 1490.00, 'http://localhost:4566/vacation-images/marrakech.jpg', '2026-07-05 07:56:06', '2026-07-05 07:56:06'),
(5, 'Madeira, Portugal', 'Levada walks, dramatic sea cliffs, botanical gardens, and quiet Atlantic villages on the island of eternal spring.', '2026-09-18', '2026-09-24', 1790.00, 'http://localhost:4566/vacation-images/madeira.webp', '2026-07-05 07:56:06', '2026-07-05 07:56:06'),
(6, 'Bali, Indonesia', 'Rice terraces, coastal temples, waterfall trails, and a restorative stay amid the green hills of Ubud.', '2026-11-24', '2026-12-03', 2650.00, 'http://localhost:4566/vacation-images/bali.webp', '2026-07-05 07:56:06', '2026-07-05 07:56:06'),
(7, 'Patagonia, Argentina', 'Glacier viewpoints, mountain trails, and expansive southern landscapes for travelers who prefer the wild edge of the map.', '2027-01-01', '2027-01-10', 3490.00, 'http://localhost:4566/vacation-images/patagonia.jpg', '2026-07-05 07:56:06', '2026-07-05 07:56:06'),
(8, 'Paris, France', 'A compact cultural week of museums, neighborhood markets, riverside walks, and classic Parisian dining.', '2026-05-21', '2026-05-27', 2000.00, 'http://localhost:4566/vacation-images/paris.jpg', '2026-07-05 07:56:06', '2026-07-05 08:22:30'),
(9, 'Zanzibar, Tanzania', 'White-sand beaches, spice farms, coral reefs, and the layered history of Stone Town.', '2027-01-31', '2027-02-07', 2790.00, 'http://localhost:4566/vacation-images/zanzibar.jpg', '2026-07-05 07:56:06', '2026-07-05 07:56:06'),
(10, 'Vancouver, Canada', 'A city-and-nature escape pairing waterfront neighborhoods with forest trails and mountain panoramas.', '2026-07-23', '2026-07-29', 2240.00, 'http://localhost:4566/vacation-images/vancouver.webp', '2026-07-05 07:56:06', '2026-07-05 07:56:06'),
(11, 'Santorini, Greece', 'Caldera paths, whitewashed villages, volcanic beaches, and sunset dinners above the Aegean.', '2026-07-04', '2026-07-11', 2350.00, 'http://localhost:4566/vacation-images/santorini.webp', '2026-07-05 07:56:06', '2026-07-05 07:56:06'),
(12, 'Cusco, Peru', 'Andean cuisine, Inca history, Sacred Valley villages, and a carefully paced visit to Machu Picchu.', '2026-04-06', '2026-04-14', 2590.00, 'http://localhost:4566/vacation-images/cusco.jpg', '2026-07-05 07:56:06', '2026-07-05 07:56:06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`user_id`,`vacation_id`),
  ADD KEY `likes_vacation_fk` (`vacation_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email` (`email`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likes_vacation_fk` FOREIGN KEY (`vacation_id`) REFERENCES `vacations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
