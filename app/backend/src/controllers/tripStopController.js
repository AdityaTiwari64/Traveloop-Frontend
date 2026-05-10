const db = require('../db');

const getStops = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const result = await db.query(
      'SELECT ts.*, c.name as city_name FROM trip_stops ts JOIN cities c ON ts.city_id = c.id WHERE ts.trip_id = $1 ORDER BY ts.stop_order ASC',
      [tripId]
    );
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

const addStop = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { city_id, arrival_date, departure_date, stop_order } = req.body;
    if (!city_id || !arrival_date || !departure_date) {
      return res.status(400).json({
        success: false,
        message: 'city_id, arrival_date, and departure_date are required',
      });
    }
    let stopOrderValue = Number.isInteger(stop_order)
      ? stop_order
      : Number.isInteger(Number(stop_order))
        ? Number(stop_order)
        : null;

    if (stopOrderValue === null) {
      const orderResult = await db.query(
        'SELECT COALESCE(MAX(stop_order), 0) + 1 AS next_order FROM trip_stops WHERE trip_id = $1',
        [tripId]
      );
      stopOrderValue = Number(orderResult.rows[0]?.next_order) || 1;
    }
    const result = await db.query(
      'INSERT INTO trip_stops (trip_id, city_id, arrival_date, departure_date, stop_order) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [tripId, city_id, arrival_date, departure_date, stopOrderValue]
    );
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Stop added to trip',
    });
  } catch (err) {
    next(err);
  }
};

const updateStop = async (req, res, next) => {
  try {
    const { stopId } = req.params;
    const { arrival_date, departure_date, stop_order } = req.body;
    const result = await db.query(
      'UPDATE trip_stops SET arrival_date = COALESCE($1, arrival_date), departure_date = COALESCE($2, departure_date), stop_order = COALESCE($3, stop_order) WHERE id = $4 RETURNING *',
      [arrival_date, departure_date, stop_order, stopId]
    );
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Stop updated',
    });
  } catch (err) {
    next(err);
  }
};

const deleteStop = async (req, res, next) => {
  try {
    const { stopId } = req.params;
    await db.query('DELETE FROM trip_stops WHERE id = $1', [stopId]);
    res.json({
      success: true,
      message: 'Stop removed from trip',
    });
  } catch (err) {
    next(err);
  }
};

const addActivityToStop = async (req, res, next) => {
  try {
    const { stopId } = req.params;
    const { activity_id, scheduled_date, start_time, notes } = req.body;
    let scheduledDateValue = scheduled_date;

    if (!activity_id) {
      return res.status(400).json({
        success: false,
        message: 'activity_id is required',
      });
    }

    if (!scheduledDateValue) {
      const stopResult = await db.query(
        'SELECT arrival_date FROM trip_stops WHERE id = $1',
        [stopId]
      );
      scheduledDateValue = stopResult.rows[0]?.arrival_date || null;
    }

    if (!scheduledDateValue) {
      return res.status(400).json({
        success: false,
        message: 'scheduled_date is required',
      });
    }
    const result = await db.query(
      'INSERT INTO stop_activities (stop_id, activity_id, scheduled_date, start_time, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [stopId, activity_id, scheduledDateValue, start_time, notes]
    );
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Activity added to stop',
    });
  } catch (err) {
    next(err);
  }
};

const deleteActivityFromStop = async (req, res, next) => {
  try {
    const { stopId, activityId } = req.params;
    await db.query(
      'DELETE FROM stop_activities WHERE stop_id = $1 AND activity_id = $2',
      [stopId, activityId]
    );
    res.json({
      success: true,
      message: 'Activity removed from stop',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStops,
  addStop,
  updateStop,
  deleteStop,
  addActivityToStop,
  deleteActivityFromStop,
};
