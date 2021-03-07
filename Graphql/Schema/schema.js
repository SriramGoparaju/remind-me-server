const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    password: String!
    email: String!
    token: String!
  }

  type Event {
    id: ID!
    eventBelongsTo: String!
    date: String!
    priority: String!
    reminderType: String!
    eventType: String!
    userId: String!
  }

  input RegisterInput {
    email: String!
    firstName: String!
    lastName: String!
    password: String!
    confirmPassword: String!
  }

  input CreateEventInput {
    eventBelongsTo: String!
    date: String!
    priority: String!
    reminderType: String!
    eventType: String!
    userId: String!
  }

  input UpdateEventInput {
    eventId: String!
    eventBelongsTo: String!
    date: String!
    priority: String!
    reminderType: String!
    eventType: String!
    userId: String!
  }

  type Query {
    users: [User]
    getEvents(userId: String): [Event]
    getEvent(eventId: String!): Event
  }

  type Mutation {
    registerUser(registerInput: RegisterInput): User
    loginUser(email: String!, password: String!): User!
    createEvent(createEventInput: CreateEventInput!): Event!
    updateEvent(updateEventInput: UpdateEventInput): Event!
    deleteEvent(eventId: String!): String!
  }
`;
