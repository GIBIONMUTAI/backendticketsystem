// app/models/ticket.model.js
const db = require('../../config/database.config');

module.exports = {
    findAll: (callback) => {
        db.all("SELECT * FROM tickets", [], callback);
    },
    findById: (id, callback) => {
        db.get("SELECT * FROM tickets WHERE id = ?", [id], callback);
    },
    create: (ticket, callback) => {
        db.run("INSERT INTO tickets (title, description, priority, status) VALUES (?, ?, ?, ?)", [ticket.title, ticket.description, ticket.priority, ticket.status], callback);
    },
    update: (id, ticket, callback) => {
        db.run("UPDATE tickets SET title = ?, description = ?, priority = ?, status = ? WHERE id = ?", [ticket.title, ticket.description, ticket.priority, ticket.status, id], callback);
    },
    delete: (id, callback) => {
        db.run("DELETE FROM tickets WHERE id = ?", [id], callback);
    }
};