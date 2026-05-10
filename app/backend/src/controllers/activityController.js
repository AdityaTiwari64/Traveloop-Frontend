const db = require('../db');

const listActivities = async (req, res, next) => {
  try {
    const { city_id, category, max_cost } = req.query;
    let queryText = 'SELECT * FROM activities WHERE 1=1';
    const params = [];

    if (city_id) {
      params.push(city_id);
      queryText += ` AND city_id = $${params.length}`;
    }
    if (category) {
      params.push(category);
      queryText += ` AND category = $${params.length}`;
    }
    if (max_cost) {
      params.push(max_cost);
      queryText += ` AND cost_per_person <= $${params.length}`;
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

const getActivityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM activities WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
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
  listActivities,
  getActivityById,
};
