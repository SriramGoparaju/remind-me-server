const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError, AuthenticationError } = require("apollo-server");

const User = require("../../Models/User");
const Event = require("../../Models/Event");
const { SECRET_KEY_JWT } = require("../../config");
const { validateRegister } = require("../../utils/validateRegister");
const { validatelogin } = require("../../utils/validateLogin");
const checkAuth = require("../../utils/checkAuth");

const generateToken = (user) => {
      return jwt.sign(
            {
                  id: user.id,
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
            },
            SECRET_KEY_JWT,
            { expiresIn: "2h" }
      );
};

const resolvers = {
      Query: {
            // to get all the users
            users: async () => {
                  const users = await User.find();
                  return users;
            },

            // to get all the events (will make it such that all the events are related to one specific user)
            getEvents: async (_, args) => {
                  const { userId } = args;
                  const events = await Event.find({ userId });
                  return events;
            },

            // to get one specific event based on the id
            getEvent: async (_, args) => {
                  const { eventId } = args;
                  try {
                        const event = await Event.findById(eventId);
                        if (event) {
                              return event;
                        } else {
                              throw new Error("Event not found");
                        }
                  } catch (err) {
                        throw new Error(err);
                  }
            },
      },

      Mutation: {
            async loginUser(_, args) {
                  const { email, password } = args;

                  // validate login form input
                  const { errors, valid } = validatelogin(email, password);

                  if (!valid) {
                        throw new UserInputError("Errors", { errors });
                  }

                  // checking if the user exists in the database
                  const user = await User.findOne({ email });

                  if (!user) {
                        errors.email = "This email is not registered";
                        throw new UserInputError("User email not found", {
                              errors,
                        });
                  } else {
                        const match = await bcrypt.compare(
                              password,
                              user.password
                        );
                        if (!match) {
                              errors.password = "The password is incorrect";
                              throw new UserInputError(
                                    "Password is incorrect",
                                    { errors }
                              );
                        }
                  }

                  const token = generateToken(user);

                  return {
                        ...user._doc,
                        id: user._id,
                        token,
                  };
            },

            async registerUser(_, args) {
                  const {
                        email,
                        firstName,
                        lastName,
                        password,
                        confirmPassword,
                  } = args.registerInput;

                  // Validating register form input
                  const { errors, valid } = validateRegister(
                        firstName,
                        lastName,
                        email,
                        password,
                        confirmPassword
                  );

                  if (!valid) {
                        throw new UserInputError("Errors", { errors });
                  }

                  // Checking if the user is already registered with that email
                  const user = await User.findOne({ email });

                  if (user) {
                        throw new UserInputError(
                              "Email is already registered... Try logging in",
                              {
                                    errors: {
                                          email:
                                                "The email used is already registered.. Please try logging in",
                                    },
                              }
                        );
                  }

                  // encrypting password using bcyrptjs
                  const newPassword = await bcrypt.hash(password, 12);

                  // creating new user for storing in the database
                  const newUser = new User({
                        firstName,
                        lastName,
                        password: newPassword,
                        email,
                  });

                  const res = await newUser.save();

                  const token = generateToken(res);

                  return {
                        ...res._doc,
                        id: res._id,
                        token,
                  };
            },

            async createEvent(_, args, context) {
                  const user = checkAuth(context);
                  const {
                        eventBelongsTo,
                        date,
                        priority,
                        reminderType,
                        eventType,
                        userId,
                  } = args.createEventInput;

                  const errors = {};
                  const eventPresent = await Event.findOne({
                        eventBelongsTo,
                        eventType,
                  });

                  if (
                        eventPresent &&
                        eventPresent.eventType === eventType &&
                        eventPresent.userId === userId
                  ) {
                        errors.general =
                              "An event of the same person and same event type already exists";
                        throw new UserInputError("Multiple same events", {
                              errors,
                        });
                  } else {
                        const newEvent = new Event({
                              eventBelongsTo,
                              date,
                              priority,
                              reminderType,
                              eventType,
                              userId,
                        });

                        const event = await newEvent.save();
                        return event;
                  }
            },

            async deleteEvent(_, args, context) {
                  const user = checkAuth(context);
                  const eventId = args.eventId;

                  const event = await Event.findById(eventId);
                  if (event && user.id === event.userId) {
                        await event.delete();
                        return "Event deleted seccessfully";
                  } else {
                        throw new UserInputError(
                              "The post with that ID does not exist or you are not authorized to delete the Event"
                        );
                  }
            },

            async updateEvent(_, args, context) {
                  const user = checkAuth(context);
                  const {
                        eventId,
                        eventBelongsTo,
                        date,
                        priority,
                        reminderType,
                        eventType,
                        userId,
                  } = args.updateEventInput;

                  const errors = {};
                  const eventPresent = await Event.findById(eventId);

                  if (eventPresent) {
                        if (eventPresent.userId === userId) {
                              const event = await Event.findById(eventId);
                              event.overwrite({
                                    eventBelongsTo,
                                    date,
                                    priority,
                                    reminderType,
                                    eventType,
                                    userId,
                              });
                              const returnEvent = await event.save();
                              return returnEvent;
                        } else {
                              errors.general =
                                    "You are not authorised to change the contents of the event";
                              throw new AuthenticationError(
                                    "Change not Authorized",
                                    { errors }
                              );
                        }
                  } else {
                        errors.general = "The event does not exist";
                        throw new UserInputError("Event does not exist", {
                              errors,
                        });
                  }
            },
      },
};

module.exports = resolvers;
