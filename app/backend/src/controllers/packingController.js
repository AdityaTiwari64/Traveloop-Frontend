const db = require('../db');

const getPackingList = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const result = await db.query(
      'SELECT * FROM packing_checklists WHERE trip_id = $1',
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

const addItem = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { item_name, category } = req.body;
    const itemNameValue = typeof item_name === 'string' ? item_name.trim() : '';
    if (!itemNameValue) {
      return res.status(400).json({
        success: false,
        message: 'item_name is required',
      });
    }

    // Normalize and validate category to match DB CHECK constraint
    const rawCat = typeof category === 'string' ? category.trim().toLowerCase() : '';
    let categoryValue = 'general';
    if (rawCat) {
      if (['clothing', 'clothes', 'apparel'].includes(rawCat)) categoryValue = 'clothing';
      else if (['documents', 'document', 'docs', 'papers'].includes(rawCat)) categoryValue = 'documents';
      else if (['electronics', 'electronic', 'gadgets'].includes(rawCat)) categoryValue = 'electronics';
      else if (['toiletries', 'toiletry', 'toilets'].includes(rawCat)) categoryValue = 'toiletries';
      else if (['general', 'misc', 'other', 'miscellaneous'].includes(rawCat)) categoryValue = 'general';
      else categoryValue = 'general';
    }

    const result = await db.query(
      'INSERT INTO packing_checklists (trip_id, item_name, category) VALUES ($1, $2, $3) RETURNING *',
      [tripId, itemNameValue, categoryValue]
    );
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Item added to checklist',
    });
  } catch (err) {
    next(err);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { is_packed, item_name } = req.body;
    const result = await db.query(
      'UPDATE packing_checklists SET is_packed = COALESCE($1, is_packed), item_name = COALESCE($2, item_name) WHERE id = $3 RETURNING *',
      [is_packed, item_name, itemId]
    );
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Item updated',
    });
  } catch (err) {
    next(err);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    await db.query('DELETE FROM packing_checklists WHERE id = $1', [itemId]);
    res.json({
      success: true,
      message: 'Item removed from checklist',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPackingList,
  addItem,
  updateItem,
  deleteItem,
};
