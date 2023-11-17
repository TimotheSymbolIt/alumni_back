//! gestion des events
const db = require('../db');
const { StatusCodes } = require('http-status-codes');
const he = require('he');
const { optimizeEventImage } = require('../utils/uploadsService');
const cloudinary = require('../utils/cloudinaryConfig');
const fs = require('fs');

//getAllEvents
const getAllEvents = async (req, res) => {
  const { title } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  // Si je recherche avec le nom
  const whereClauseTitle = title
    ? `AND lower(name) LIKE lower('%${title}%')`
    : '';

  const query = `
    SELECT * FROM events
    LEFT JOIN eventImages 
    ON events.event_id = eventImages.event_id
    WHERE is_active = true
    ${whereClauseTitle}
    ORDER BY events.created_at DESC
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

  // désechapper les caractères spéciaux de la description des events
  events.map((event) => {
    event.description = he.decode(event.description);
  });
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

  events.map((event) => {
    event.description = he.decode(event.description);
  });

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

  const {
    rows: [event],
  } = await db.query(
    'UPDATE events SET is_active = NOT is_active WHERE event_id = $1 RETURNING is_active ',
    [id]
  );

  res.status(StatusCodes.OK).json({ event });
};

//getSingleEvent
const getSingleEvent = async (req, res) => {
  const { id } = req.params;

  const {
    rows: [event],
  } = await db.query(
    `SELECT * FROM events 
      LEFT JOIN eventImages
      ON events.event_id = eventImages.event_id
      WHERE events.event_id = $1`,
    [id]
  );

  // deséchapper les caractères spéciaux de la description de l'event
  event.description = he.decode(event.description);

  res.status(StatusCodes.OK).json({ event });
};

//createEvent
const createEvent = async (req, res) => {
  const { name, description, event_date } = req.body;

  const { rows: events } = await db.query(
    'INSERT INTO events(name, description, event_date) VALUES($1,$2,$3) RETURNING *',
    [name, description, event_date]
  );

  // dossier cloudinary ou stocker les images des events
  const folder = 'foreach/events';

  const id = events[0].event_id;
  const image = await optimizeEventImage(req.files.image);
  const result = await cloudinary.uploader.upload(image.tempFilePath, {
    useTempFiles: true,
    folder: folder,
  });

  // inserer dans eventImages l'url et le public_id de l'image
  await db.query(
    'INSERT INTO eventImages(url, public_id, event_id) VALUES($1,$2,$3) RETURNING *',
    [result.secure_url, result.public_id, id]
  );

  // supprimer le fichier temporaire
  fs.unlink(image.tempFilePath, (err) => {
    if (err) {
      throw new Error('Erreur lors de la suppression du fichier temporaire');
    }
  });

  res.status(StatusCodes.CREATED).json({ events });
};

//updateEvent
const updateEvent = async (req, res) => {
  const { name, description, event_date, public_id } = req.body;
  const { id } = req.params;

  // si je recois que le public_id de l'image je supprime l'image de levent et de cloudinary
  if (public_id) {
    await cloudinary.uploader.destroy(public_id);
    await db.query('DELETE FROM eventImages WHERE public_id=$1', [public_id]);

    res.status(StatusCodes.OK).json({ msg: 'Image supprimée avec succès' });
  }

  if (!public_id) {
    // sinon je met tout a jour
    await db.query(
      'UPDATE events SET name=$1, description=$2, event_date=$3 WHERE event_id=$4 RETURNING *',
      [name, description, event_date, id]
    );

    if (req.files?.image) {
      // dossier cloudinary ou stocker les images des events
      const folder = 'foreach/events';

      const image = await optimizeEventImage(req.files.image);
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        useTempFiles: true,
        folder: folder,
      });

      // inserer dans eventImages l'url et le public_id de l'image
      await db.query(
        'INSERT INTO eventImages(url, public_id, event_id) VALUES($1,$2,$3) RETURNING *',
        [result.secure_url, result.public_id, id]
      );

      // supprimer le fichier temporaire
      fs.unlink(image.tempFilePath, (err) => {
        if (err) {
          throw new Error(
            'Erreur lors de la suppression du fichier temporaire'
          );
        }
      });
    }
    res.status(StatusCodes.OK).json({ msg: 'Event modifié avec succès' });
  }
};

//deleteEvent
const deleteEvent = async (req, res) => {
  const { id } = req.params;

  // supprimer l'image de cloudinary et de la base de données
  const { rows: eventImages } = await db.query(
    'SELECT * FROM eventImages WHERE event_id=$1',
    [id]
  );

  if (eventImages[0]) {
    const public_id = eventImages[0].public_id;
    await cloudinary.uploader.destroy(public_id);
    await db.query('DELETE FROM eventImages WHERE event_id=$1', [id]);
  }

  await db.query('DELETE FROM events WHERE event_id=$1 RETURNING *', [id]);

  res.status(StatusCodes.OK).json({ msg: 'Event supprimé avec succès' });
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
