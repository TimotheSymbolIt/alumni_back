const db = require("../db");
const he = require("he");

const getAllEvents = async (req, res) => {
	const { title } = req.query;
	const page = Number(req.query.page) || 1;
	const limit = 5;
	const offset = (page - 1) * limit;

	// Si je recherche avec le nom
	const whereClauseTitle = title
		? `AND lower(name) LIKE lower('%${title}%')`
		: "";

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
		"SELECT COUNT(*) AS inactive_count FROM events WHERE is_active = true"
	);

	const numberOfPages = Math.ceil(count.inactive_count / limit);

	const { rows: events } = await db.query(query, values);

	// désechapper les caractères spéciaux de la description des events
	events.map((event) => {
		event.description = he.decode(event.description);
	});

	res.status(200).json({ events, page, title, numberOfPages });
};

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

	res.status(200).json({ event });
};

module.exports = {
	getAllEvents,
	getSingleEvent,
};
