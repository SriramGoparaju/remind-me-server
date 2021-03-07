// Dependency imports
const { ApolloServer, gql } = require("apollo-server");
const Mongoose = require("mongoose");

const { MONGODB } = require("./config");

// local imports
const typeDefs = require("./Graphql/Schema/schema");
const resolvers = require("./Graphql/Resolvers/resolvers");

const PORT = process.env.port || 5000;

// Creating a new server and passing request through context
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => ({ req }),
});

//Connecting to mongoose
Mongoose.connect(MONGODB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(() => {
	console.log("mongoDB connected");
	server
		.listen({ port: PORT })
		.then((res) => {
			console.log(`Server running on ${res.url}`);
		})
		.catch((err) => {
			console.error(err);
		});
});
