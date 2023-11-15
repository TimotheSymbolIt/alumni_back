//! gestion des events
const db = require('../db');
const { StatusCodes } = require('http-status-codes');

//getAllEvents
const getAllEvents = async (req, res) => {
  const { title } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  console.log(title);

  // Si je recherche avec le nom
  const whereClauseTitle = title
    ? `AND lower(name) LIKE lower('%${title}%')`
    : '';

  const query = `
    SELECT * FROM events
    WHERE is_active = true
    ${whereClauseTitle}
    ORDER BY created_at DESC
    LIMIT $1
    OFFSET $2
  `;
  const values = [limit, offset];

  const {
    rows: [count],
  } = await db.query(
    'SELECT COUNT(*) AS inactive_count FROM events WHERE is_active = true'
  );

  const numberOfPages = Math.ceil(count.inactive_count / limit);

  const { rows: events } = await db.query(query, values);

  res.status(StatusCodes.OK).json({ events, page, title, numberOfPages });
};

// getAllInactiveEvents
const getAllInactiveEvents = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  const query = `
    SELECT name, description, is_active, created_at, event_date, event_id FROM events
    WHERE is_active = false
    LIMIT $1
    OFFSET $2
  `;
  const values = [limit, offset];

  const { rows: events } = await db.query(query, values);

  const {
    rows: [count],
  } = await db.query(
    'SELECT COUNT(*) AS inactive_count FROM events WHERE is_active = false'
  );

  const numberOfPages = Math.ceil(count.inactive_count / limit);

  res.status(StatusCodes.OK).json({ events, count, page, numberOfPages });
};

//updateActivationEvent
const updateActivationEvent = async (req, res) => {
  const { id } = req.body;

  console.log(req.body);
  const {
    rows: [event],
  } = await db.query(
    'UPDATE events SET is_active = NOT is_active WHERE event_id = $1 RETURNING is_active ',
    [id]
  );

  console.log(event);
  res.status(StatusCodes.OK).json({ event });
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
    'INSERT INTO events(name, description, event_date, image_url) VALUES($1,$2,$3,$4) RETURNING *',
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
  const { id } = req.params;
  const { rows: events } = await db.query(
    'DELETE FROM events WHERE event_id=$1 RETURNING *',
    [id]
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
