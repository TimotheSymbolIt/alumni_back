//! gestion des notifications
const db = require('../db');
const { StatusCodes } = require('http-status-codes');

const getAllNotifications = async (req, res) => {
  const { userId, role } = req.user;

  //check si le profil est completé à 100%
  const {
    rows: [user],
  } = await db.query('SELECT * FROM users WHERE user_id = $1', [userId]);
  if (
    !user.age ||
    !user.description ||
    !user.city ||
    !user.professional_experience ||
    !user.avatar_url
  ) {
    msg = "Votre profil n'est pas complet";
  }

  // si c'est un admin ou moderateur il recupere le nombre de notifications
  if (role === 'admin' || role === 'moderateur') {
    // utilisateurs en attente d'activation
    const {
      rows: [users],
    } = await db.query('SELECT COUNT(*) FROM users WHERE is_active = false');
    // jobs en attente d'activation
    const {
      rows: [jobs],
    } = await db.query('SELECT COUNT(*) FROM jobs WHERE is_active = false');
    // compagnies en attente d'activation
    const {
      rows: [compagnies],
    } = await db.query(
      'SELECT COUNT(*) FROM compagnies WHERE is_active = false'
    );
    // événements en attente d'activation
    const {
      rows: [events],
    } = await db.query('SELECT COUNT(*) FROM events WHERE is_active = false');

    inactiveUsers = users.count;
    inactiveJobs = jobs.count;
    inactiveCompagnies = compagnies.count;
    inactiveEvents = events.count;

    let compteur =
      Number(inactiveUsers) +
      Number(inactiveJobs) +
      Number(inactiveCompagnies) +
      Number(inactiveEvents);

    if (msg) {
      compteur++;
    }

    const notifications = {
      compteur,
      msg,
      inactiveUsers,
      inactiveJobs,
      inactiveCompagnies,
      inactiveEvents,
    };

    res.status(StatusCodes.OK).json({ notifications });
  } else {
    // si c'est un user il recupere simplement le message
    let compteur = 0;
    if (msg) {
      compteur++;
    }
    const notifications = {
      compteur,
      msg,
    };
    console.log(compteur);

    res.status(StatusCodes.OK).json({ notifications });
  }
};

module.exports = {
  getAllNotifications,
};
