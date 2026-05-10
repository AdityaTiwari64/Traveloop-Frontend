const db = require('../db');
const crypto = require('crypto');

const listTrips = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM v_trip_summary WHERE user_id = $1',
      [req.user.id]
    );
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

const createTrip = async (req, res, next) => {
  try {
    const { name, description, start_date, end_date } = req.body;
    const tripNameValue = typeof name === 'string' ? name.trim() : '';
    if (!tripNameValue || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'name, start_date, and end_date are required',
      });
    }
    const result = await db.query(
      'INSERT INTO trips (user_id, name, description, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, tripNameValue, description, start_date, end_date]
    );
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Trip created successfully',
    });
  } catch (err) {
    next(err);
  }
};

const getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM trips WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    
    // Get itinerary from view
    const itinerary = await db.query(
      'SELECT * FROM v_itinerary WHERE trip_id = $1',
      [id]
    );

    res.json({
      success: true,
      data: {
        ...result.rows[0],
        itinerary: itinerary.rows
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, start_date, end_date, is_public, cover_photo } = req.body;
    const result = await db.query(
      'UPDATE trips SET name = COALESCE($1, name), description = COALESCE($2, description), start_date = COALESCE($3, start_date), end_date = COALESCE($4, end_date), is_public = COALESCE($5, is_public), cover_photo = COALESCE($6, cover_photo) WHERE id = $7 AND user_id = $8 RETURNING *',
      [name, description, start_date, end_date, is_public, cover_photo, id, req.user.id]
    );
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Trip updated successfully',
    });
  } catch (err) {
    next(err);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM trips WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    res.json({
      success: true,
      message: 'Trip deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

const shareTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { shared_with_email } = req.body;
    
    // Simple share logic: update is_public or add to trip_shares
    const shareToken = crypto.randomBytes(16).toString('hex');
    
    await db.query(
      'UPDATE trips SET share_token = $1, is_public = true WHERE id = $2 AND user_id = $3',
      [shareToken, id, req.user.id]
    );

    if (shared_with_email) {
      // Look up user by email
      const userRes = await db.query('SELECT id FROM users WHERE email = $1', [shared_with_email]);
      if (userRes.rows.length > 0) {
        await db.query(
          'INSERT INTO trip_shares (trip_id, shared_by, shared_with) VALUES ($1, $2, $3)',
          [id, req.user.id, userRes.rows[0].id]
        );
      }
    }

    res.json({
      success: true,
      data: { share_token: shareToken },
      message: 'Trip shared successfully',
    });
  } catch (err) {
    next(err);
  }
};

const getPublicTrip = async (req, res, next) => {
  try {
    const { share_token } = req.params;
    const result = await db.query(
      'SELECT * FROM v_public_trips WHERE share_token = $1',
      [share_token]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Public trip not found' });
    }
    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listTrips,
  createTrip,
  getTripById,
  updateTrip,
  deleteTrip,
  shareTrip,
  getPublicTrip,
};
