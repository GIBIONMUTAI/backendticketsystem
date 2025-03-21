module.exports = (app) => {
    const tickets = require('../controllers/ticket.controller.js');

    // Create a new Ticket
    app.post('/tickets', tickets.create);

    // Retrieve all Tickets
    app.get('/tickets', tickets.findAll);

    // Retrieve a single Ticket with ticketId
    app.get('/tickets/:ticketId', tickets.findOne);

    // Update a Ticket with ticketId
    app.put('/tickets/:ticketId', tickets.update);

    // Delete a Ticket with ticketId
    app.delete('/tickets/:ticketId', tickets.delete);
};