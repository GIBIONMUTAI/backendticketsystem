const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('./tickets.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the tickets database.');
});

db.run(`CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'Low',
  status TEXT DEFAULT 'Open',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Create a new Ticket
exports.create = (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ message: "Ticket title cannot be empty" });
  }

  const { title, description, priority, status } = req.body;

  db.run(
    `INSERT INTO tickets (title, description, priority, status) VALUES (?, ?, ?, ?)`,
    [title, description, priority || 'Low', status || 'Open'],
    function (err) {
      if (err) {
        return res.status(500).json({
          message: err.message || "Some error occurred while creating the Ticket.",
        });
      }
      db.get(`SELECT * FROM tickets WHERE id = ?`, [this.lastID], (err, row) => {
        if (err) {
          return res.status(500).json({
            message: err.message || "Some error occurred while retrieving the created Ticket.",
          });
        }
        res.status(201).json(row);
      });
    }
  );
};

// Retrieve and return all tickets from the database.
exports.findAll = (req, res) => {
  db.all(`SELECT * FROM tickets ORDER BY createdAt DESC`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: err.message || "Some error occurred while retrieving tickets.",
      });
    }
    res.json(rows);
  });
};

// Find a single ticket with a ticketId
exports.findOne = (req, res) => {
  const ticketId = req.params.ticketId;
  db.get(`SELECT * FROM tickets WHERE id = ?`, [ticketId], (err, row) => {
    if (err) {
      return res.status(500).json({
        message: "Error retrieving ticket with id " + ticketId,
      });
    }
    if (!row) {
      return res.status(404).json({
        message: "Ticket not found with id " + ticketId,
      });
    }
    res.json(row);
  });
};

// Update a ticket identified by the ticketId in the request
exports.update = (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ message: "Ticket title cannot be empty" });
  }

  const { title, description, priority, status } = req.body;
  const ticketId = req.params.ticketId;

  db.run(
    `UPDATE tickets SET title = ?, description = ?, priority = ?, status = ? WHERE id = ?`,
    [title, description, priority, status, ticketId],
    function (err) {
      if (err) {
        return res.status(500).json({
          message: "Error updating ticket with id " + ticketId,
        });
      }
      if (this.changes === 0) {
        return res.status(404).json({
          message: "Ticket not found with id " + ticketId,
        });
      }
      db.get(`SELECT * FROM tickets WHERE id = ?`, [ticketId], (err, row) => {
          if (err) {
              return res.status(500).json({
                  message: "Error retrieving updated ticket with id " + ticketId,
              });
          }
          res.json(row);
      });
    }
  );
};

// Delete a ticket with the specified ticketId in the request
exports.delete = (req, res) => {
  const ticketId = req.params.ticketId;
  db.run(`DELETE FROM tickets WHERE id = ?`, [ticketId], function (err) {
    if (err) {
      return res.status(500).json({
        message: "Could not delete ticket with id " + ticketId,
      });
    }
    if (this.changes === 0) {
      return res.status(404).json({
        message: "Ticket not found with id " + ticketId,
      });
    }
    res.json({ message: "Ticket deleted successfully!" });
  });
};