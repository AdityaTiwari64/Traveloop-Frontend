const db = require('../db');

const getNotes = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const result = await db.query(
      'SELECT * FROM trip_notes WHERE trip_id = $1',
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

const addNote = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { title, content, note_date, stop_id } = req.body;
    const contentValue = typeof content === 'string' ? content.trim() : '';
    if (!contentValue) {
      return res.status(400).json({
        success: false,
        message: 'content is required',
      });
    }
    const result = await db.query(
      'INSERT INTO trip_notes (trip_id, title, content, note_date, stop_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [tripId, title, contentValue, note_date, stop_id]
    );
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Note added',
    });
  } catch (err) {
    next(err);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { title, content, note_date, stop_id } = req.body;
    const result = await db.query(
      'UPDATE trip_notes SET title = COALESCE($1, title), content = COALESCE($2, content), note_date = COALESCE($3, note_date), stop_id = COALESCE($4, stop_id) WHERE id = $5 RETURNING *',
      [title, content, note_date, stop_id, noteId]
    );
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Note updated',
    });
  } catch (err) {
    next(err);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    await db.query('DELETE FROM trip_notes WHERE id = $1', [noteId]);
    res.json({
      success: true,
      message: 'Note deleted',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
};
