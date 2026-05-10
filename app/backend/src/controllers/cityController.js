const db = require('../db');

const listCities = async (req, res, next) => {
  try {
    const { region, country, sort } = req.query;
    let queryText = 'SELECT * FROM cities WHERE 1=1';
    const params = [];

    if (region) {
      params.push(region);
      queryText += ` AND region = $${params.length}`;
    }
    if (country) {
      params.push(country);
      queryText += ` AND country = $${params.length}`;
    }

    if (sort) {
      const allowedSort = ['cost_index', 'popularity_score'];
      if (allowedSort.includes(sort)) {
        queryText += ` ORDER BY ${sort} DESC`;
      }
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

const searchCities = async (req, res, next) => {
  try {
    const { q } = req.query;
    // Using v_city_search view if it exists
    const result = await db.query(
      'SELECT * FROM v_city_search WHERE name ILIKE $1 OR country ILIKE $1',
      [`%${q}%`]
    );
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    // Fallback if view doesn't exist or other error
    try {
      const fallback = await db.query(
        'SELECT * FROM cities WHERE name ILIKE $1 OR country ILIKE $1',
        [`%${req.query.q}%`]
      );
      res.json({
        success: true,
        data: fallback.rows,
      });
    } catch (fallbackErr) {
      next(err);
    }
  }
};

const getCityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM cities WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'City not found' });
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
  listCities,
  searchCities,
  getCityById,
};
