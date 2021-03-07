const {Schema, model} = require('mongoose');

const eventSchema = new Schema({
    eventBelongsTo: String,
    date: String,
    priority: String,
    reminderType: String,
    eventType: String,
    userId: String
});

module.exports = model('Event', eventSchema);