const db = require('../db');

const getMe = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, email, name, profile_photo, language, is_admin, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const { name, language } = req.body;
    let profile_photo = req.body.profile_photo;

    if (req.file) {
      profile_photo = `/uploads/${req.file.filename}`;
    }

    const result = await db.query(
      'UPDATE users SET name = COALESCE($1, name), language = COALESCE($2, language), profile_photo = COALESCE($3, profile_photo) WHERE id = $4 RETURNING id, email, name, profile_photo, language',
      [name, language, profile_photo, req.user.id]
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Profile updated successfully',
    });
  } catch (err) {
    next(err);
  }
};

const deleteMe = async (req, res, next) => {
  try {
    await db.query('DELETE FROM users WHERE id = $1', [req.user.id]);
    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

const getSavedDestinations = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM saved_destinations WHERE user_id = $1',
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

const addSavedDestination = async (req, res, next) => {
  try {
    const {
      city_name,
      cityName,
      city,
      country,
      countryName,
      country_name,
      city_id,
      cityId,
    } = req.body;

    let cityNameValue =
      (typeof city_name === 'string' && city_name.trim()) ||
      (typeof cityName === 'string' && cityName.trim()) ||
      (typeof city === 'string' && city.trim()) ||
      '';

    let countryValue =
      (typeof country === 'string' && country.trim()) ||
      (typeof countryName === 'string' && countryName.trim()) ||
      (typeof country_name === 'string' && country_name.trim()) ||
      '';

    const cityIdValue =
      (Number.isInteger(city_id) && city_id) ||
      (Number.isInteger(cityId) && cityId) ||
      null;

    if (cityIdValue && (!cityNameValue || !countryValue)) {
      const cityResult = await db.query(
        'SELECT name, country FROM cities WHERE id = $1',
        [cityIdValue]
      );
      if (cityResult.rows[0]) {
        cityNameValue = cityNameValue || cityResult.rows[0].name;
        countryValue = countryValue || cityResult.rows[0].country;
      }
    }

    if (cityNameValue && !countryValue) {
      const cityResult = await db.query(
        'SELECT country FROM cities WHERE name ILIKE $1 ORDER BY id ASC LIMIT 1',
        [cityNameValue]
      );

      if (!cityResult.rows[0]) {
        const fuzzyCityResult = await db.query(
          'SELECT country FROM cities WHERE name ILIKE $1 ORDER BY id ASC LIMIT 1',
          [`%${cityNameValue}%`]
        );
        countryValue = fuzzyCityResult.rows[0]?.country || '';
      } else {
        countryValue = cityResult.rows[0].country;
      }
    }

    if (!cityNameValue || !countryValue) {
      return res.status(400).json({
        success: false,
        message: 'city_name and country are required',
      });
    }
    const result = await db.query(
      'INSERT INTO saved_destinations (user_id, city_name, country) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, cityNameValue, countryValue]
    );
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Destination saved',
    });
  } catch (err) {
    next(err);
  }
};

const deleteSavedDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM saved_destinations WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    res.json({
      success: true,
      message: 'Destination removed from saved',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMe,
  updateMe,
  deleteMe,
  getSavedDestinations,
  addSavedDestination,
  deleteSavedDestination,
};
