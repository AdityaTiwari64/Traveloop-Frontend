-- ============================================================
--  TRAVELOOP — Seed Data (Realistic)
-- ============================================================

-- ============================================================
-- USERS  (10 users, 1 admin)
-- ============================================================
INSERT INTO users (id, name, email, password_hash, profile_photo, language, is_admin) VALUES
('a1000000-0000-0000-0000-000000000001', 'Aarav Shah',       'aarav@example.com',    '$2b$12$KIXhash1', 'https://i.pravatar.cc/150?img=1',  'en', FALSE),
('a1000000-0000-0000-0000-000000000002', 'Priya Mehta',      'priya@example.com',    '$2b$12$KIXhash2', 'https://i.pravatar.cc/150?img=2',  'en', FALSE),
('a1000000-0000-0000-0000-000000000003', 'Rohan Verma',      'rohan@example.com',    '$2b$12$KIXhash3', 'https://i.pravatar.cc/150?img=3',  'hi', FALSE),
('a1000000-0000-0000-0000-000000000004', 'Sofia Patel',      'sofia@example.com',    '$2b$12$KIXhash4', 'https://i.pravatar.cc/150?img=4',  'en', FALSE),
('a1000000-0000-0000-0000-000000000005', 'Liam Chen',        'liam@example.com',     '$2b$12$KIXhash5', 'https://i.pravatar.cc/150?img=5',  'en', FALSE),
('a1000000-0000-0000-0000-000000000006', 'Emma Nakamura',    'emma@example.com',     '$2b$12$KIXhash6', 'https://i.pravatar.cc/150?img=6',  'en', FALSE),
('a1000000-0000-0000-0000-000000000007', 'Carlos Ramírez',   'carlos@example.com',   '$2b$12$KIXhash7', 'https://i.pravatar.cc/150?img=7',  'es', FALSE),
('a1000000-0000-0000-0000-000000000008', 'Aisha Khan',       'aisha@example.com',    '$2b$12$KIXhash8', 'https://i.pravatar.cc/150?img=8',  'en', FALSE),
('a1000000-0000-0000-0000-000000000009', 'Ethan Williams',   'ethan@example.com',    '$2b$12$KIXhash9', 'https://i.pravatar.cc/150?img=9',  'en', FALSE),
('a1000000-0000-0000-0000-000000000010', 'Admin User',       'admin@traveloop.com',  '$2b$12$ADMINhash','https://i.pravatar.cc/150?img=10', 'en', TRUE);

-- ============================================================
-- CITIES  (20 real cities with data)
-- ============================================================
INSERT INTO cities (id, name, country, region, latitude, longitude, cost_index, popularity_score, description, cover_image, currency, timezone) VALUES
(1,  'Paris',          'France',       'Europe',       48.8566,   2.3522,   78, 97, 'The City of Light, home to the Eiffel Tower and world-class cuisine.',       'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', 'EUR', 'Europe/Paris'),
(2,  'Tokyo',          'Japan',        'Asia',         35.6762, 139.6503,   72, 96, 'A bustling metropolis blending ultramodern and traditional Japan.',            'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf', 'JPY', 'Asia/Tokyo'),
(3,  'New York',       'USA',          'Americas',     40.7128, -74.0060,   85, 95, 'The city that never sleeps — Times Square, Central Park, and more.',          'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9', 'USD', 'America/New_York'),
(4,  'Bali',           'Indonesia',    'Asia',         -8.3405, 115.0920,   38, 92, 'Tropical paradise with rice terraces, temples, and stunning beaches.',        'https://images.unsplash.com/photo-1537996194471-e657df975ab4', 'IDR', 'Asia/Makassar'),
(5,  'Barcelona',      'Spain',        'Europe',       41.3851,   2.1734,   65, 91, 'Gaudí architecture, tapas, and vibrant nightlife on the Mediterranean.',      'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216', 'EUR', 'Europe/Madrid'),
(6,  'Dubai',          'UAE',          'Middle East',  25.2048,  55.2708,   80, 90, 'Ultra-modern skyline, luxury shopping, and desert adventures.',               'https://images.unsplash.com/photo-1512453979798-5ea266f8880c', 'AED', 'Asia/Dubai'),
(7,  'Rome',           'Italy',        'Europe',       41.9028,  12.4964,   68, 94, 'Eternal city with the Colosseum, Vatican, and iconic Italian food.',          'https://images.unsplash.com/photo-1552832230-c0197dd311b5', 'EUR', 'Europe/Rome'),
(8,  'Bangkok',        'Thailand',     'Asia',         13.7563, 100.5018,   35, 89, 'Vibrant street life, ornate temples, and incredible street food.',            'https://images.unsplash.com/photo-1508009603885-50cf7c579365', 'THB', 'Asia/Bangkok'),
(9,  'Sydney',         'Australia',    'Oceania',      -33.8688, 151.2093,  75, 88, 'Opera House, Bondi Beach, and a stunning harbour city.',                      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9', 'AUD', 'Australia/Sydney'),
(10, 'Amsterdam',      'Netherlands',  'Europe',       52.3676,   4.9041,   70, 87, 'Canal houses, world-class museums, and a legendary cycling culture.',         'https://images.unsplash.com/photo-1584003564911-2f346b7d5a08', 'EUR', 'Europe/Amsterdam'),
(11, 'Istanbul',       'Turkey',       'Europe/Asia',  41.0082,  28.9784,   45, 86, 'Where East meets West — mosques, bazaars, and the Bosphorus.',               'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200', 'TRY', 'Europe/Istanbul'),
(12, 'Kyoto',          'Japan',        'Asia',         35.0116, 135.7681,   60, 90, 'Ancient temples, geisha districts, and stunning bamboo forests.',             'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e', 'JPY', 'Asia/Tokyo'),
(13, 'Prague',         'Czech Republic','Europe',      50.0755,  14.4378,   50, 85, 'Fairy-tale Old Town, Gothic cathedrals, and affordable European charm.',      'https://images.unsplash.com/photo-1541849546-216549ae216d', 'CZK', 'Europe/Prague'),
(14, 'Cape Town',      'South Africa', 'Africa',       -33.9249,  18.4241,  48, 84, 'Table Mountain, Cape Point, and incredible winelands.',                      'https://images.unsplash.com/photo-1580060839134-75a5edca2e99', 'ZAR', 'Africa/Johannesburg'),
(15, 'Lisbon',         'Portugal',     'Europe',       38.7223,  -9.1393,   55, 83, 'Trams, tiles, fado music, and the best custard tarts in the world.',          'https://images.unsplash.com/photo-1555881400-74d7acaacd8b', 'EUR', 'Europe/Lisbon'),
(16, 'Santorini',      'Greece',       'Europe',       36.3932,  25.4615,   74, 93, 'Iconic white-washed cliffs, blue domes, and volcanic caldera views.',         'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff', 'EUR', 'Europe/Athens'),
(17, 'Singapore',      'Singapore',    'Asia',          1.3521, 103.8198,   82, 88, 'A gleaming city-state famous for food, Gardens by the Bay, and order.',       'https://images.unsplash.com/photo-1525625293386-3f8f99389edd', 'SGD', 'Asia/Singapore'),
(18, 'Marrakech',      'Morocco',      'Africa',       31.6295,  -7.9811,   32, 82, 'Medina souks, Jemaa el-Fna square, and vibrant Moroccan culture.',            'https://images.unsplash.com/photo-1597211833712-5e41faa202ea', 'MAD', 'Africa/Casablanca'),
(19, 'Reykjavik',      'Iceland',      'Europe',       64.1466, -21.9426,   88, 80, 'Northern Lights, geysers, and dramatic volcanic landscapes.',                 'https://images.unsplash.com/photo-1539593395743-7da5ee10ff07', 'ISK', 'Atlantic/Reykjavik'),
(20, 'Mumbai',         'India',        'Asia',         19.0760,  72.8777,   28, 85, 'Bollywood capital, Gateway of India, and incredible street food scene.',      'https://images.unsplash.com/photo-1595658658481-d53d3f999875', 'INR', 'Asia/Kolkata');

-- ============================================================
-- ACTIVITIES  (4–5 per city, 20 cities = ~80 activities)
-- ============================================================
INSERT INTO activities (city_id, name, category, description, duration_hours, cost_per_person, image_url, rating) VALUES
-- Paris (1)
(1, 'Eiffel Tower Visit',         'sightseeing', 'Skip the line tickets to the iconic iron tower with panoramic views.',        2.5, 32.00, 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f', 4.7),
(1, 'Louvre Museum Tour',         'culture',     'Explore Da Vinci, ancient Egypt, and the Mona Lisa.',                         3.0, 22.00, 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622', 4.8),
(1, 'Seine River Cruise',         'sightseeing', 'One-hour evening cruise past Notre-Dame and the Musée d''Orsay.',             1.0, 17.00, 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a', 4.6),
(1, 'Montmartre Food Walk',       'food',        'Taste croissants, cheese, and wine in the artistic Montmartre quarter.',      2.5, 65.00, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0', 4.5),
(1, 'Versailles Day Trip',        'culture',     'Full-day guided tour of the Palace of Versailles and its grand gardens.',     6.0, 55.00, 'https://images.unsplash.com/photo-1592889429024-4e5ef4fb8cad', 4.7),
-- Tokyo (2)
(2, 'Tsukiji Fish Market Tour',   'food',        'Early morning sushi breakfast and guided market walk.',                        3.0, 45.00, 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc', 4.6),
(2, 'Shibuya Crossing & Walk',    'sightseeing', 'Experience the world''s busiest pedestrian crossing and surrounding streets.',2.0, 0.00,  'https://images.unsplash.com/photo-1542051841857-5f90071e7989', 4.5),
(2, 'teamLab Planets',            'culture',     'Immersive digital art museum in Toyosu.',                                      2.0, 32.00, 'https://images.unsplash.com/photo-1635873674997-65be7a851cdb', 4.8),
(2, 'Mount Fuji Day Trip',        'adventure',   'Guided day trip to Mount Fuji with lakeside lunch.',                           8.0, 85.00, 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65', 4.9),
(2, 'Harajuku Street Tour',       'shopping',    'Walk Takeshita Street and explore Harajuku fashion culture.',                  2.5, 0.00,  'https://images.unsplash.com/photo-1519984388953-d2406bc725e1', 4.3),
-- New York (3)
(3, 'Statue of Liberty Cruise',   'sightseeing', 'Ferry to Liberty Island with access to the crown.',                           4.0, 25.00, 'https://images.unsplash.com/photo-1462189694702-29b00be6e67e', 4.7),
(3, 'Central Park Bike Tour',     'adventure',   'Guided cycling tour through all 843 acres of Central Park.',                  2.5, 40.00, 'https://images.unsplash.com/photo-1534430480872-3498386e7856', 4.6),
(3, 'Broadway Show',              'culture',     'Evening Broadway musical in the Theater District.',                            3.0, 120.00,'https://images.unsplash.com/photo-1503095396549-807759245b35', 4.9),
(3, 'Brooklyn Food Tour',         'food',        'Taste pizza, bagels, and craft beer across Brooklyn neighborhoods.',           4.0, 75.00, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5', 4.5),
(3, 'Metropolitan Museum',        'culture',     'Explore 5,000 years of art across 17 curatorial departments.',                3.0, 30.00, 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3', 4.8),
-- Bali (4)
(4, 'Tegallalang Rice Terrace',   'sightseeing', 'Walk through stunning UNESCO-listed rice paddies in Ubud.',                   2.0, 5.00,  'https://images.unsplash.com/photo-1555400038-63f5ba517a47', 4.7),
(4, 'Uluwatu Temple Sunset',      'culture',     'Cliffside temple with traditional Kecak fire dance at sunset.',               2.5, 8.00,  'https://images.unsplash.com/photo-1537944434965-cf4679d1a598', 4.8),
(4, 'Bali Cooking Class',         'food',        'Morning market visit then hands-on Balinese cooking class.',                  4.0, 35.00, 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f', 4.8),
(4, 'White Water Rafting',        'adventure',   'Thrilling rafting on the Ayung River through jungle gorges.',                 3.0, 30.00, 'https://images.unsplash.com/photo-1530866536-8603a16296ab', 4.6),
(4, 'Seminyak Beach Club',        'sightseeing', 'Afternoon at a luxury Seminyak beach club with pool and sunset views.',       4.0, 20.00, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', 4.4),
-- Barcelona (5)
(5, 'Sagrada Família Tour',       'culture',     'Skip-the-line entry to Gaudí''s unfinished masterpiece.',                    2.0, 26.00, 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4', 4.9),
(5, 'Gothic Quarter Walk',        'sightseeing', 'Guided walk through the medieval streets of the Gothic Quarter.',             2.0, 18.00, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64', 4.6),
(5, 'Barceloneta Beach Day',      'adventure',   'Beach volleyball, paddleboarding, and seafood paella lunch.',                  5.0, 40.00, 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4', 4.5),
(5, 'Tapas & Wine Tour',          'food',        'Evening tapas crawl across 4 bars in El Born neighborhood.',                  3.5, 70.00, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0', 4.7),
-- Dubai (6)
(6, 'Burj Khalifa At the Top',    'sightseeing', 'Observatory deck on levels 124 & 125 of the world''s tallest building.',     1.5, 45.00, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c', 4.7),
(6, 'Desert Safari',              'adventure',   'Dune bashing, camel riding, and a BBQ dinner under the stars.',               6.0, 80.00, 'https://images.unsplash.com/photo-1542401886-65d6c61db217', 4.8),
(6, 'Dubai Mall & Aquarium',      'shopping',    'Visit the massive Dubai Mall and its underwater aquarium tunnel.',             3.0, 35.00, 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55', 4.5),
-- Rome (7)
(7, 'Colosseum & Roman Forum',    'culture',     'Skip-the-line access to the ancient amphitheater and Forum.',                 3.0, 18.00, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5', 4.8),
(7, 'Vatican Museums & Sistine',  'culture',     'Guided tour of the Vatican Museums and Sistine Chapel.',                      4.0, 35.00, 'https://images.unsplash.com/photo-1531572753322-ad063cecc140', 4.9),
(7, 'Roman Food Tour',            'food',        'Pasta, gelato, and espresso tasting in Trastevere.',                          3.0, 60.00, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0', 4.7),
-- Bangkok (8)
(8, 'Grand Palace & Wat Phra',    'culture',     'Explore Thailand''s most sacred temple and royal palace complex.',            3.0, 15.00, 'https://images.unsplash.com/photo-1508009603885-50cf7c579365', 4.7),
(8, 'Floating Market Tour',       'food',        'Longtail boat tour of Damnoen Saduak floating market.',                       5.0, 40.00, 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a', 4.6),
(8, 'Thai Cooking Class',         'food',        'Morning market tour + cook 4 authentic Thai dishes.',                         4.0, 35.00, 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f', 4.8),
-- Sydney (9)
(9, 'Sydney Opera House Tour',    'culture',     'Backstage guided tour of this UNESCO World Heritage landmark.',               1.5, 42.00, 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9', 4.7),
(9, 'Bondi to Coogee Walk',       'adventure',   'Iconic 6km coastal cliff walk with stops at beautiful beaches.',              3.0, 0.00,  'https://images.unsplash.com/photo-1509114397022-ed747cca3f65', 4.8),
(9, 'Sydney Harbour Cruise',      'sightseeing', 'Two-hour dinner cruise on Sydney Harbour.',                                   2.0, 95.00, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 4.6),
-- Amsterdam (10)
(10,'Anne Frank House',           'culture',     'Guided visit to the secret annex where Anne Frank hid during WWII.',          1.5, 16.00, 'https://images.unsplash.com/photo-1584003564911-2f346b7d5a08', 4.8),
(10,'Canal Boat Tour',            'sightseeing', 'One-hour open-top boat cruise through Amsterdam''s famous canals.',           1.0, 18.00, 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4', 4.6),
(10,'Rijksmuseum',                'culture',     'Home to Rembrandt and Vermeer masterpieces.',                                  2.5, 22.00, 'https://images.unsplash.com/photo-1584710208580-ee0f5e5c6fc8', 4.8),
-- Istanbul (11)
(11,'Hagia Sophia & Blue Mosque', 'culture',     'Visit two of Istanbul''s greatest Byzantine and Ottoman landmarks.',          3.0, 0.00,  'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200', 4.8),
(11,'Grand Bazaar Shopping',      'shopping',    'Explore 4,000 shops across 61 covered streets.',                              3.0, 0.00,  'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd', 4.5),
(11,'Bosphorus Sunset Cruise',    'sightseeing', 'Cruise between Europe and Asia at golden hour.',                              2.0, 25.00, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64', 4.7),
-- Kyoto (12)
(12,'Fushimi Inari Shrine',       'sightseeing', 'Walk through thousands of torii gates up the sacred mountain.',               3.0, 0.00,  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e', 4.9),
(12,'Arashiyama Bamboo Grove',    'sightseeing', 'Stroll through the ethereal bamboo forest at dawn.',                          1.5, 0.00,  'https://images.unsplash.com/photo-1528360983277-13d401cdc186', 4.8),
(12,'Tea Ceremony Experience',    'culture',     'Authentic matcha tea ceremony in a traditional Kyoto tea house.',             1.5, 40.00, 'https://images.unsplash.com/photo-1545048702-79362596cdc9', 4.7);

-- ============================================================
-- TRIPS  (8 sample trips across different users)
-- ============================================================
INSERT INTO trips (id, user_id, name, description, start_date, end_date, is_public, share_token, total_budget, status) VALUES
('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'European Dream',      'Paris, Barcelona & Rome in 14 days',          '2025-06-01', '2025-06-14', TRUE,  'share_EUR_dream_2025',   3500.00, 'planning'),
('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 'Southeast Asia Hop', 'Bali, Bangkok & Singapore adventure',          '2025-07-10', '2025-07-24', TRUE,  'share_SEA_hop_2025',     2200.00, 'planning'),
('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', 'Japan Deep Dive',    'Tokyo and Kyoto cultural immersion',           '2025-08-05', '2025-08-18', FALSE, NULL,                     4000.00, 'planning'),
('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000004', 'Middle East Explorer','Dubai and Istanbul in 10 days',               '2025-09-01', '2025-09-10', TRUE,  'share_ME_explore_2025',  2800.00, 'planning'),
('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000005', 'Oceania Adventure',  'Sydney and beyond',                           '2025-05-15', '2025-05-25', FALSE, NULL,                     3200.00, 'ongoing'),
('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', 'Morocco & Portugal', 'Marrakech and Lisbon in one trip',            '2024-10-01', '2024-10-12', TRUE,  'share_MP_2024',          1800.00, 'completed'),
('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000006', 'Greek Island Escape','Santorini sun and sea',                       '2025-08-20', '2025-08-27', TRUE,  'share_greek_2025',       2500.00, 'planning'),
('b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000007', 'NYC & Cape Town',    'Contrasting cities across two hemispheres',   '2025-11-01', '2025-11-15', FALSE, NULL,                     5000.00, 'planning');

-- ============================================================
-- TRIP STOPS
-- ============================================================
INSERT INTO trip_stops (trip_id, city_id, stop_order, arrival_date, departure_date) VALUES
-- European Dream: Paris → Barcelona → Rome
('b1000000-0000-0000-0000-000000000001', 1,  1, '2025-06-01', '2025-06-05'),
('b1000000-0000-0000-0000-000000000001', 5,  2, '2025-06-05', '2025-06-10'),
('b1000000-0000-0000-0000-000000000001', 7,  3, '2025-06-10', '2025-06-14'),
-- Southeast Asia Hop: Bali → Bangkok → Singapore
('b1000000-0000-0000-0000-000000000002', 4,  1, '2025-07-10', '2025-07-16'),
('b1000000-0000-0000-0000-000000000002', 8,  2, '2025-07-16', '2025-07-21'),
('b1000000-0000-0000-0000-000000000002', 17, 3, '2025-07-21', '2025-07-24'),
-- Japan Deep Dive: Tokyo → Kyoto
('b1000000-0000-0000-0000-000000000003', 2,  1, '2025-08-05', '2025-08-11'),
('b1000000-0000-0000-0000-000000000003', 12, 2, '2025-08-11', '2025-08-18'),
-- Middle East: Dubai → Istanbul
('b1000000-0000-0000-0000-000000000004', 6,  1, '2025-09-01', '2025-09-06'),
('b1000000-0000-0000-0000-000000000004', 11, 2, '2025-09-06', '2025-09-10'),
-- Oceania: Sydney
('b1000000-0000-0000-0000-000000000005', 9,  1, '2025-05-15', '2025-05-25'),
-- Morocco & Portugal
('b1000000-0000-0000-0000-000000000006', 18, 1, '2024-10-01', '2024-10-06'),
('b1000000-0000-0000-0000-000000000006', 15, 2, '2024-10-06', '2024-10-12'),
-- Greek Escape: Santorini
('b1000000-0000-0000-0000-000000000007', 16, 1, '2025-08-20', '2025-08-27'),
-- NYC & Cape Town
('b1000000-0000-0000-0000-000000000008', 3,  1, '2025-11-01', '2025-11-08'),
('b1000000-0000-0000-0000-000000000008', 14, 2, '2025-11-08', '2025-11-15');

-- ============================================================
-- STOP ACTIVITIES  (assign activities to stops)
-- ============================================================
INSERT INTO stop_activities (stop_id, activity_id, scheduled_date, start_time, end_time) VALUES
-- Paris stop (stop_id=1): activities 1-5
(1, 1, '2025-06-02', '10:00', '12:30'),   -- Eiffel Tower
(1, 2, '2025-06-03', '09:00', '12:00'),   -- Louvre
(1, 3, '2025-06-03', '19:00', '20:00'),   -- Seine Cruise
(1, 4, '2025-06-04', '11:00', '13:30'),   -- Montmartre Food Walk
-- Barcelona stop (stop_id=2)
(2, 21,'2025-06-06', '10:00', '12:00'),   -- Sagrada Família
(2, 22,'2025-06-07', '14:00', '16:00'),   -- Gothic Quarter
(2, 24,'2025-06-08', '19:00', '22:30'),   -- Tapas & Wine Tour
-- Rome stop (stop_id=3)
(3, 28,'2025-06-11', '09:00', '12:00'),   -- Colosseum
(3, 29,'2025-06-12', '09:00', '13:00'),   -- Vatican
(3, 30,'2025-06-13', '18:00', '21:00'),   -- Roman Food Tour
-- Bali stop (stop_id=4)
(4, 16,'2025-07-12', '08:00', '10:00'),   -- Rice Terrace
(4, 17,'2025-07-13', '17:00', '19:30'),   -- Uluwatu Sunset
(4, 18,'2025-07-14', '08:00', '12:00'),   -- Cooking Class
(4, 19,'2025-07-15', '09:00', '12:00'),   -- Rafting
-- Bangkok stop (stop_id=5)
(5, 31,'2025-07-17', '09:00', '12:00'),   -- Grand Palace
(5, 33,'2025-07-18', '09:00', '13:00'),   -- Cooking Class
-- Tokyo stop (stop_id=7)
(7, 6, '2025-08-06', '06:00', '09:00'),   -- Tsukiji
(7, 8, '2025-08-07', '10:00', '12:00'),   -- teamLab
(7, 9, '2025-08-09', '07:00', '15:00'),   -- Mt Fuji
-- Kyoto stop (stop_id=8)
(8, 41,'2025-08-12', '07:00', '10:00'),   -- Fushimi Inari
(8, 42,'2025-08-13', '06:30', '08:00'),   -- Bamboo Grove
(8, 43,'2025-08-14', '14:00', '15:30');   -- Tea Ceremony

-- ============================================================
-- TRIP BUDGETS
-- ============================================================
INSERT INTO trip_budgets (trip_id, total_budget, transport_cost, stay_cost, activity_cost, meals_cost, misc_cost, currency) VALUES
('b1000000-0000-0000-0000-000000000001', 3500.00,  850.00,  1200.00,  650.00,  550.00, 250.00, 'USD'),
('b1000000-0000-0000-0000-000000000002', 2200.00,  600.00,   700.00,  420.00,  350.00, 130.00, 'USD'),
('b1000000-0000-0000-0000-000000000003', 4000.00, 1100.00,  1500.00,  700.00,  480.00, 220.00, 'USD'),
('b1000000-0000-0000-0000-000000000004', 2800.00,  750.00,   950.00,  550.00,  380.00, 170.00, 'USD'),
('b1000000-0000-0000-0000-000000000005', 3200.00,  900.00,  1100.00,  600.00,  420.00, 180.00, 'AUD'),
('b1000000-0000-0000-0000-000000000006', 1800.00,  450.00,   650.00,  350.00,  250.00, 100.00, 'EUR'),
('b1000000-0000-0000-0000-000000000007', 2500.00,  600.00,  1100.00,  380.00,  300.00, 120.00, 'USD'),
('b1000000-0000-0000-0000-000000000008', 5000.00, 1300.00,  1800.00,  900.00,  650.00, 350.00, 'USD');

-- ============================================================
-- BUDGET DAY ALERTS
-- ============================================================
INSERT INTO budget_day_alerts (trip_id, alert_date, daily_limit, spent, is_over) VALUES
('b1000000-0000-0000-0000-000000000001', '2025-06-02', 250.00, 210.00, FALSE),
('b1000000-0000-0000-0000-000000000001', '2025-06-03', 250.00, 285.00, TRUE),
('b1000000-0000-0000-0000-000000000002', '2025-07-12', 150.00, 138.00, FALSE),
('b1000000-0000-0000-0000-000000000003', '2025-08-06', 280.00, 310.00, TRUE);

-- ============================================================
-- PACKING CHECKLISTS
-- ============================================================
INSERT INTO packing_checklists (trip_id, item_name, category, is_packed) VALUES
-- European Dream
('b1000000-0000-0000-0000-000000000001', 'Passport',               'documents',    TRUE),
('b1000000-0000-0000-0000-000000000001', 'Travel Insurance',       'documents',    TRUE),
('b1000000-0000-0000-0000-000000000001', 'Euros (cash)',           'documents',    FALSE),
('b1000000-0000-0000-0000-000000000001', 'Lightweight Jacket',     'clothing',     TRUE),
('b1000000-0000-0000-0000-000000000001', 'Comfortable Sneakers',   'clothing',     TRUE),
('b1000000-0000-0000-0000-000000000001', 'Phone Charger',          'electronics',  TRUE),
('b1000000-0000-0000-0000-000000000001', 'Universal Adapter',      'electronics',  FALSE),
('b1000000-0000-0000-0000-000000000001', 'Sunscreen SPF 50',       'toiletries',   FALSE),
-- Southeast Asia Hop
('b1000000-0000-0000-0000-000000000002', 'Passport',               'documents',    TRUE),
('b1000000-0000-0000-0000-000000000002', 'Visa printouts',         'documents',    TRUE),
('b1000000-0000-0000-0000-000000000002', 'Swimwear (x3)',          'clothing',     TRUE),
('b1000000-0000-0000-0000-000000000002', 'Mosquito Repellent',     'toiletries',   TRUE),
('b1000000-0000-0000-0000-000000000002', 'Portable Power Bank',    'electronics',  FALSE),
-- Japan Deep Dive
('b1000000-0000-0000-0000-000000000003', 'JR Rail Pass',           'documents',    FALSE),
('b1000000-0000-0000-0000-000000000003', 'IC Card (Suica)',        'documents',    FALSE),
('b1000000-0000-0000-0000-000000000003', 'Formal Outfit',          'clothing',     TRUE),
('b1000000-0000-0000-0000-000000000003', 'Pocket WiFi',            'electronics',  TRUE),
('b1000000-0000-0000-0000-000000000003', 'Cash in JPY',            'documents',    FALSE);

-- ============================================================
-- TRIP NOTES / JOURNAL
-- ============================================================
INSERT INTO trip_notes (trip_id, stop_id, title, content, note_date) VALUES
('b1000000-0000-0000-0000-000000000001', 1, 'Eiffel Tower Tips',       'Book tickets at least 2 weeks in advance — sold out same day. Best photos from Trocadéro gardens at sunset.',  '2025-06-02'),
('b1000000-0000-0000-0000-000000000001', 1, 'Hotel Check-in Info',     'Hotel Le Marais — check-in from 15:00. Contact: +33 1 42 78 47 22. Room 304 booked.',                          '2025-06-01'),
('b1000000-0000-0000-0000-000000000001', 2, 'Barcelona Reminders',     'Sagrada Família requires booking the tower separately. Gothic Quarter — watch belongings.',                      '2025-06-05'),
('b1000000-0000-0000-0000-000000000002', 4, 'Bali Driver Contact',     'Wayan — local driver, English speaking. Number: +62 812-3456-7890. Reliable, good rates.',                    '2025-07-10'),
('b1000000-0000-0000-0000-000000000003', 7, 'Tokyo Must Eat',          '1. Ichiran Ramen in Shinjuku  2. Tsukemen at Fuunji  3. Conveyor belt sushi near Tsukiji.',                   '2025-08-05'),
('b1000000-0000-0000-0000-000000000003', 8, 'Kyoto Temple Notes',      'Fushimi Inari — go before 7am to avoid crowds. Bring cash for temple entry fees. Most ATMs accept foreign cards at 7-Eleven.', '2025-08-11');

-- ============================================================
-- TRIP SHARES
-- ============================================================
INSERT INTO trip_shares (trip_id, shared_by, shared_with, permission) VALUES
('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', NULL,                                          'view'),   -- public
('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'copy'),
('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', NULL,                                          'view'),
('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 'view'),
('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000006', NULL,                                          'view');

-- ============================================================
-- SAVED DESTINATIONS
-- ============================================================
INSERT INTO saved_destinations (user_id, city_name, country) VALUES
('a1000000-0000-0000-0000-000000000001', 'Tokyo',     'Japan'),
('a1000000-0000-0000-0000-000000000001', 'Santorini', 'Greece'),
('a1000000-0000-0000-0000-000000000002', 'Paris',     'France'),
('a1000000-0000-0000-0000-000000000002', 'New York',  'USA'),
('a1000000-0000-0000-0000-000000000003', 'Bali',      'Indonesia'),
('a1000000-0000-0000-0000-000000000004', 'Kyoto',     'Japan'),
('a1000000-0000-0000-0000-000000000005', 'Cape Town', 'South Africa');

-- ============================================================
-- PLATFORM ANALYTICS  (Screen 14: Admin Dashboard)
-- ============================================================
INSERT INTO platform_analytics (recorded_date, total_users, new_users, total_trips, new_trips, public_trips, top_city_id, avg_trip_budget) VALUES
('2025-04-01', 120,  8,  85,  6, 38, 2,  2850.00),
('2025-04-08', 134, 14,  96,  11,42, 1,  2920.00),
('2025-04-15', 151, 17, 110,  14,48, 4,  3010.00),
('2025-04-22', 168, 17, 128,  18,55, 2,  3080.00),
('2025-04-29', 189, 21, 147,  19,61, 5,  3150.00),
('2025-05-06', 214, 25, 171,  24,70, 1,  3200.00);
