-- ============================================================
--  TRAVELOOP — Useful Views & Queries
-- ============================================================

-- ============================================================
-- VIEW 1: Trip Summary (Screen 2: Dashboard, Screen 4: My Trips)
-- Shows each trip with stop count and total days
-- ============================================================
CREATE VIEW v_trip_summary AS
SELECT
    t.id,
    t.user_id,
    u.name                              AS user_name,
    t.name                              AS trip_name,
    t.start_date,
    t.end_date,
    (t.end_date - t.start_date)         AS total_days,
    t.status,
    t.is_public,
    t.total_budget,
    COUNT(DISTINCT ts.id)               AS stop_count,
    STRING_AGG(c.name, ' → ' ORDER BY ts.stop_order) AS route
FROM trips t
JOIN users u         ON u.id = t.user_id
LEFT JOIN trip_stops ts ON ts.trip_id = t.id
LEFT JOIN cities c   ON c.id = ts.city_id
GROUP BY t.id, u.name;

-- ============================================================
-- VIEW 2: Itinerary View (Screen 6: Itinerary View)
-- Day-wise layout with activities per stop
-- ============================================================
CREATE VIEW v_itinerary AS
SELECT
    t.id                                AS trip_id,
    t.name                              AS trip_name,
    ts.stop_order,
    c.name                              AS city,
    c.country,
    ts.arrival_date,
    ts.departure_date,
    sa.scheduled_date,
    sa.start_time,
    sa.end_time,
    a.name                              AS activity,
    a.category,
    COALESCE(sa.cost_override, a.cost_per_person) AS cost,
    a.duration_hours
FROM trips t
JOIN trip_stops ts      ON ts.trip_id    = t.id
JOIN cities c           ON c.id          = ts.city_id
LEFT JOIN stop_activities sa ON sa.stop_id = ts.id
LEFT JOIN activities a  ON a.id          = sa.activity_id
ORDER BY ts.stop_order, sa.scheduled_date, sa.start_time;

-- ============================================================
-- VIEW 3: Budget Breakdown (Screen 9: Budget & Cost)
-- ============================================================
CREATE VIEW v_budget_breakdown AS
SELECT
    t.id                                AS trip_id,
    t.name                              AS trip_name,
    tb.total_budget,
    tb.transport_cost,
    tb.stay_cost,
    tb.activity_cost,
    tb.meals_cost,
    tb.misc_cost,
    tb.currency,
    ROUND(tb.transport_cost / NULLIF(t.end_date - t.start_date, 0), 2) AS transport_per_day,
    ROUND(tb.stay_cost      / NULLIF(t.end_date - t.start_date, 0), 2) AS stay_per_day,
    ROUND(tb.activity_cost  / NULLIF(t.end_date - t.start_date, 0), 2) AS activity_per_day,
    ROUND(tb.meals_cost     / NULLIF(t.end_date - t.start_date, 0), 2) AS meals_per_day,
    ROUND((tb.transport_cost + tb.stay_cost + tb.activity_cost + tb.meals_cost + tb.misc_cost)
          / NULLIF(t.end_date - t.start_date, 0), 2)                  AS total_per_day,
    ROUND(((tb.transport_cost + tb.stay_cost + tb.activity_cost + tb.meals_cost + tb.misc_cost)
          / NULLIF(tb.total_budget, 0)) * 100, 1)                      AS budget_used_pct
FROM trips t
JOIN trip_budgets tb ON tb.trip_id = t.id;

-- ============================================================
-- VIEW 4: City Search Results (Screen 7: City Search)
-- ============================================================
CREATE VIEW v_city_search AS
SELECT
    c.id,
    c.name,
    c.country,
    c.region,
    c.cost_index,
    c.popularity_score,
    c.description,
    c.cover_image,
    c.currency,
    c.timezone,
    COUNT(a.id)                         AS activity_count,
    ROUND(AVG(a.cost_per_person), 2)    AS avg_activity_cost,
    ROUND(AVG(a.rating), 1)             AS avg_activity_rating
FROM cities c
LEFT JOIN activities a ON a.city_id = c.id
GROUP BY c.id;

-- ============================================================
-- VIEW 5: Public/Shared Trips (Screen 11: Public Itinerary)
-- ============================================================
CREATE VIEW v_public_trips AS
SELECT
    t.id,
    t.share_token,
    t.name                              AS trip_name,
    u.name                              AS created_by,
    t.start_date,
    t.end_date,
    (t.end_date - t.start_date)         AS total_days,
    tb.total_budget,
    tb.currency,
    COUNT(DISTINCT ts.id)               AS stop_count,
    COUNT(DISTINCT sa.id)               AS activity_count,
    STRING_AGG(c.name, ' → ' ORDER BY ts.stop_order) AS route
FROM trips t
JOIN users u             ON u.id  = t.user_id
LEFT JOIN trip_budgets tb ON tb.trip_id = t.id
LEFT JOIN trip_stops ts  ON ts.trip_id = t.id
LEFT JOIN cities c       ON c.id = ts.city_id
LEFT JOIN stop_activities sa ON sa.stop_id = ts.id
WHERE t.is_public = TRUE
GROUP BY t.id, u.name, tb.total_budget, tb.currency;

-- ============================================================
-- VIEW 6: Admin Analytics (Screen 14: Admin Dashboard)
-- ============================================================
CREATE VIEW v_admin_stats AS
SELECT
    (SELECT COUNT(*) FROM users WHERE is_admin = FALSE)           AS total_users,
    (SELECT COUNT(*) FROM trips)                                   AS total_trips,
    (SELECT COUNT(*) FROM trips WHERE is_public = TRUE)           AS public_trips,
    (SELECT COUNT(*) FROM trips WHERE status = 'completed')       AS completed_trips,
    (SELECT ROUND(AVG(total_budget),2) FROM trip_budgets)         AS avg_trip_budget,
    (SELECT name FROM cities c
     JOIN trip_stops ts ON ts.city_id = c.id
     GROUP BY c.id, c.name ORDER BY COUNT(*) DESC LIMIT 1)       AS most_visited_city,
    (SELECT name FROM activities
     JOIN stop_activities sa ON sa.activity_id = activities.id
     GROUP BY activities.id, activities.name ORDER BY COUNT(*) DESC LIMIT 1) AS most_popular_activity;

-- ============================================================
-- USEFUL SAMPLE QUERIES
-- ============================================================

-- Q1: Get full itinerary for a trip (Screen 6)
-- SELECT * FROM v_itinerary WHERE trip_id = 'b1000000-0000-0000-0000-000000000001';

-- Q2: Search cities by region and sort by cost
-- SELECT * FROM v_city_search WHERE region = 'Asia' ORDER BY cost_index ASC;

-- Q3: Get all public trips with route
-- SELECT trip_name, created_by, route, total_days FROM v_public_trips ORDER BY total_days DESC;

-- Q4: Budget alert check — which trip days are over budget?
-- SELECT trip_id, alert_date, daily_limit, spent, (spent - daily_limit) AS overspend
-- FROM budget_day_alerts WHERE is_over = TRUE;

-- Q5: Top 5 most popular activities globally (Admin dashboard)
-- SELECT a.name, a.category, c.name AS city, COUNT(sa.id) AS times_booked, ROUND(AVG(a.rating),1) AS avg_rating
-- FROM activities a
-- JOIN cities c ON c.id = a.city_id
-- LEFT JOIN stop_activities sa ON sa.activity_id = a.id
-- GROUP BY a.id, a.name, a.category, c.name
-- ORDER BY times_booked DESC, avg_rating DESC LIMIT 5;

-- Q6: Packing checklist completion for a trip (Screen 10)
-- SELECT category, COUNT(*) AS total, SUM(CASE WHEN is_packed THEN 1 ELSE 0 END) AS packed
-- FROM packing_checklists
-- WHERE trip_id = 'b1000000-0000-0000-0000-000000000001'
-- GROUP BY category;

-- Q7: User's recent trips for Dashboard (Screen 2)
-- SELECT * FROM v_trip_summary
-- WHERE user_id = 'a1000000-0000-0000-0000-000000000001'
-- ORDER BY start_date DESC LIMIT 5;

-- Q8: All notes for a trip sorted by date (Screen 13)
-- SELECT tn.title, tn.content, tn.note_date, c.name AS stop_city
-- FROM trip_notes tn
-- LEFT JOIN trip_stops ts ON ts.id = tn.stop_id
-- LEFT JOIN cities c ON c.id = ts.city_id
-- WHERE tn.trip_id = 'b1000000-0000-0000-0000-000000000001'
-- ORDER BY tn.note_date;
