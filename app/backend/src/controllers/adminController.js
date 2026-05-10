const db = require('../db');

const getStats = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM v_admin_stats');
    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

const listAllUsers = async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, email, name, is_admin, created_at FROM users ORDER BY created_at DESC');
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

const listAllTrips = async (req, res, next) => {
  try {
    const { status, user_id } = req.query;
    let queryText = 'SELECT * FROM trips WHERE 1=1';
    const params = [];

    if (user_id) {
      params.push(user_id);
      queryText += ` AND user_id = $${params.length}`;
    }

    const result = await db.query(queryText, params);
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStats,
  listAllUsers,
  listAllTrips,
};
