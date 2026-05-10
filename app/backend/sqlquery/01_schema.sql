-- ============================================================
--  TRAVELOOP — PostgreSQL Schema
--  Covers all 14 screens from the product spec
--  Generated for Odoo Hackathon
-- ============================================================

-- Enable useful extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ============================================================
-- 1. USERS  (Screen 1: Login/Signup, Screen 12: Profile/Settings)
-- ============================================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100)  NOT NULL,
    email           CITEXT        NOT NULL UNIQUE,
    password_hash   TEXT          NOT NULL,
    profile_photo   TEXT,                          -- URL / path
    language        VARCHAR(10)   DEFAULT 'en',
    is_admin        BOOLEAN       DEFAULT FALSE,
    is_active       BOOLEAN       DEFAULT TRUE,
    created_at      TIMESTAMPTZ   DEFAULT NOW(),
    updated_at      TIMESTAMPTZ   DEFAULT NOW()
);

-- ============================================================
-- 2. SAVED DESTINATIONS  (Screen 12: Profile — saved destinations list)
-- ============================================================
CREATE TABLE saved_destinations (
    id          SERIAL PRIMARY KEY,
    user_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    city_name   VARCHAR(100) NOT NULL,
    country     VARCHAR(100) NOT NULL,
    saved_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- ============================================================
-- 3. CITIES  (Screen 7: City Search)
-- ============================================================
CREATE TABLE cities (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    country         VARCHAR(100)    NOT NULL,
    region          VARCHAR(100),
    latitude        NUMERIC(9,6),
    longitude       NUMERIC(9,6),
    cost_index      NUMERIC(5,2),   -- relative cost score 1–100
    popularity_score NUMERIC(5,2),  -- 1–100
    description     TEXT,
    cover_image     TEXT,           -- URL
    currency        VARCHAR(10),
    timezone        VARCHAR(50)
);

-- ============================================================
-- 4. ACTIVITIES  (Screen 8: Activity Search)
-- ============================================================
CREATE TABLE activities (
    id              SERIAL PRIMARY KEY,
    city_id         INT          NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name            VARCHAR(200) NOT NULL,
    category        VARCHAR(50)  NOT NULL,   -- sightseeing | food | adventure | culture | shopping
    description     TEXT,
    duration_hours  NUMERIC(4,1),
    cost_per_person NUMERIC(10,2),
    image_url       TEXT,
    rating          NUMERIC(2,1) CHECK (rating BETWEEN 0 AND 5)
);

-- ============================================================
-- 5. TRIPS  (Screen 3: Create Trip, Screen 4: My Trips)
-- ============================================================
CREATE TABLE trips (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    cover_photo     TEXT,
    start_date      DATE         NOT NULL,
    end_date        DATE         NOT NULL,
    is_public       BOOLEAN      DEFAULT FALSE,   -- Screen 11: Shared/Public
    share_token     VARCHAR(64)  UNIQUE,          -- public URL token
    total_budget    NUMERIC(12,2),
    status          VARCHAR(20)  DEFAULT 'planning' CHECK (status IN ('planning','ongoing','completed','cancelled')),
    created_at      TIMESTAMPTZ  DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- ============================================================
-- 6. TRIP STOPS  (Screen 5: Itinerary Builder)
-- ============================================================
CREATE TABLE trip_stops (
    id              SERIAL PRIMARY KEY,
    trip_id         UUID         NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    city_id         INT          NOT NULL REFERENCES cities(id),
    stop_order      SMALLINT     NOT NULL DEFAULT 1,         -- for reordering
    arrival_date    DATE         NOT NULL,
    departure_date  DATE         NOT NULL,
    notes           TEXT,
    CONSTRAINT valid_stop_dates CHECK (departure_date >= arrival_date)
);

-- ============================================================
-- 7. STOP ACTIVITIES  (Screen 5 & 6: Builder + View)
-- ============================================================
CREATE TABLE stop_activities (
    id              SERIAL PRIMARY KEY,
    stop_id         INT          NOT NULL REFERENCES trip_stops(id) ON DELETE CASCADE,
    activity_id     INT          NOT NULL REFERENCES activities(id),
    scheduled_date  DATE         NOT NULL DEFAULT CURRENT_DATE,
    start_time      TIME,
    end_time        TIME,
    cost_override   NUMERIC(10,2),   -- override default activity cost
    notes           TEXT
);

-- ============================================================
-- 8. BUDGET BREAKDOWN  (Screen 9: Trip Budget & Cost Breakdown)
-- ============================================================
CREATE TABLE trip_budgets (
    id              SERIAL PRIMARY KEY,
    trip_id         UUID         NOT NULL REFERENCES trips(id) ON DELETE CASCADE UNIQUE,
    total_budget    NUMERIC(12,2) NOT NULL DEFAULT 0,
    transport_cost  NUMERIC(12,2) DEFAULT 0,
    stay_cost       NUMERIC(12,2) DEFAULT 0,
    activity_cost   NUMERIC(12,2) DEFAULT 0,
    meals_cost      NUMERIC(12,2) DEFAULT 0,
    misc_cost       NUMERIC(12,2) DEFAULT 0,
    currency        VARCHAR(10)   DEFAULT 'USD',
    updated_at      TIMESTAMPTZ   DEFAULT NOW()
);

-- Per-day budget alerts
CREATE TABLE budget_day_alerts (
    id          SERIAL PRIMARY KEY,
    trip_id     UUID    NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    alert_date  DATE    NOT NULL,
    daily_limit NUMERIC(10,2) NOT NULL,
    spent       NUMERIC(10,2) DEFAULT 0,
    is_over     BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- 9. PACKING CHECKLIST  (Screen 10: Packing Checklist)
-- ============================================================
CREATE TABLE packing_checklists (
    id          SERIAL PRIMARY KEY,
    trip_id     UUID         NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    item_name   VARCHAR(200) NOT NULL,
    category    VARCHAR(50)  DEFAULT 'general' CHECK (category IN ('clothing','documents','electronics','toiletries','general')),
    is_packed   BOOLEAN      DEFAULT FALSE,
    created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- ============================================================
-- 10. TRIP NOTES / JOURNAL  (Screen 13: Trip Notes)
-- ============================================================
CREATE TABLE trip_notes (
    id          SERIAL PRIMARY KEY,
    trip_id     UUID    NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    stop_id     INT     REFERENCES trip_stops(id) ON DELETE SET NULL,  -- optional: link to a stop
    title       VARCHAR(200),
    content     TEXT    NOT NULL,
    note_date   DATE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11. SOCIAL SHARING  (Screen 11: Shared/Public Itinerary)
-- ============================================================
CREATE TABLE trip_shares (
    id              SERIAL PRIMARY KEY,
    trip_id         UUID         NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    shared_by       UUID         NOT NULL REFERENCES users(id),
    shared_with     UUID         REFERENCES users(id),  -- NULL = public
    permission      VARCHAR(20)  DEFAULT 'view' CHECK (permission IN ('view','copy')),
    shared_at       TIMESTAMPTZ  DEFAULT NOW()
);

-- ============================================================
-- 12. ADMIN / ANALYTICS  (Screen 14: Admin Dashboard)
-- ============================================================
CREATE TABLE platform_analytics (
    id              SERIAL PRIMARY KEY,
    recorded_date   DATE         NOT NULL UNIQUE,
    total_users     INT          DEFAULT 0,
    new_users       INT          DEFAULT 0,
    total_trips     INT          DEFAULT 0,
    new_trips       INT          DEFAULT 0,
    public_trips    INT          DEFAULT 0,
    top_city_id     INT          REFERENCES cities(id),
    avg_trip_budget NUMERIC(10,2)
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_trips_user        ON trips(user_id);
CREATE INDEX idx_trips_public      ON trips(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_trip_stops_trip   ON trip_stops(trip_id);
CREATE INDEX idx_stop_act_stop     ON stop_activities(stop_id);
CREATE INDEX idx_activities_city   ON activities(city_id);
CREATE INDEX idx_notes_trip        ON trip_notes(trip_id);
CREATE INDEX idx_packing_trip      ON packing_checklists(trip_id);
CREATE INDEX idx_cities_name       ON cities(name);
CREATE INDEX idx_cities_country    ON cities(country);

-- ============================================================
-- AUTO-UPDATE updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated    BEFORE UPDATE ON users    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_trips_updated    BEFORE UPDATE ON trips    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_notes_updated    BEFORE UPDATE ON trip_notes FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_budget_updated   BEFORE UPDATE ON trip_budgets FOR EACH ROW EXECUTE FUNCTION update_timestamp();
