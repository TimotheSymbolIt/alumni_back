//! gestion des events
const db = require('../db');
const { StatusCodes } = require('http-status-codes');

//getAllEvents
const getAllEvents = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 2;
  const offset = (page - 1) * limit;

  const query = `
    SELECT * FROM events
    WHERE is_active = true
    ORDER BY created_at DESC
    LIMIT $1
    OFFSET $2
  `;

  const values = [limit, offset];

  const { rows: events } = await db.query(query, values);

  res.status(StatusCodes.OK).json({ events, page });
};

// getAllInactiveEvents
const getAllInactiveEvents = async (_req, res) => {
  const { rows: events } = await db.query(
    'SELECT * FROM events WHERE is_active = false'
  );
  const {
    row: [count],
  } = await db.query('SELECT COUNT(*) FROM events WHERE is_active = false');

  res.status(StatusCodes.OK).json({ events, count });
};

//updateActivationEvent
const updateActivationEvent = async (req, res) => {
  const { event_id, is_active } = req.body;
  const { rows: events } = await db.query(
    'UPDATE events SET is_active = $1 WHERE event_id = $2 RETURNING *',
    [is_active, event_id]
  );
  res.status(StatusCodes.OK).json({ events });
};

//getSingleEvent
const getSingleEvent = async (req, res) => {
  const { id } = req.params;
  const { rows: events } = await db.query(
    'SELECT * FROM events WHERE event_id = $1',
    [id]
  );
  res.status(StatusCodes.OK).json({ events });
};

//createEvent
const createEvent = async (req, res) => {
  const { name, description, date, image_url } = req.body;
  const { rows: events } = await db.query(
    'INSERT INTO events(name, description, date, image_url) VALUES($1,$2,$3,$4) RETURNING *',
    [name, description, date, image_url]
  );
  res.status(StatusCodes.CREATED).json({ events });
};

//updateEvent
const updateEvent = async (req, res) => {
  const { event_id, name, description, date, image_url } = req.body;
  const { rows: events } = await db.query(
    'UPDATE events SET name=$1, description=$2, date=$3, image_url=$4 WHERE event_id=$5 RETURNING *',
    [name, description, date, image_url, event_id]
  );
  res.status(StatusCodes.OK).json({ events });
};

//deleteEvent
const deleteEvent = async (req, res) => {
  const { event_id } = req.body;
  const { rows: events } = await db.query(
    'DELETE FROM events WHERE event_id=$1 RETURNING *',
    [event_id]
  );
  res.status(StatusCodes.OK).json({ events });
};

module.exports = {
  getAllEvents,
  getAllInactiveEvents,
  updateActivationEvent,
  getSingleEvent,
  createEvent,
  updateEvent,
  deleteEvent,
};
