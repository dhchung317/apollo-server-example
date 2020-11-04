const { ApolloServer, gql } = require('apollo-server')

const { PubSub } = require('apollo-server');

const pubsub = new PubSub();

// // ... Later in your code, when you want to publish data over subscription, run:

// const payload = {
//     commentAdded: {
//         id: '1',
//         content: 'Hello!',
//     }
// };

// pubsub.publish('commentAdded', payload);
var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL)

const Location = sequelize.define('Location', {
    localeId: {
        type: Sequelize.DataTypes.STRING
    },
    latitude: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false
    },
    longitude: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false
    },
    localeId: {
        type: Sequelize.DataTypes.STRING
    },
})

const typeDefs = gql`

    type Location {
        localeId: String,
        latitude: Float!,
        longitude: Float!,
        address: String
    }

    type LocationGroup {
        uid: String,
        type: String,
        locationsObj: Locations
    }

    type Locations {
        locations: [Location]
    }

    type Query {
        locationGroup: LocationGroup!
    }

    type Subscription {
        locationGroup: LocationGroup
        locations: [Location]
    }

    # input LocationInfo {
    #     localeId: String
    #     latitude: Float!
    #     longitude: Float!
    #     address: String
    # }

    type Mutation {
        addLocation(latitude: Float!, longitude: Float!):Location!
    }
`;

const resolvers = {
    Query: {
        locationGroup: () => ({})
    },

    LocationGroup: {
        uid:() => {"placeholder ID"},
        type:() => {"placeholder TYPE"}
    },

    Locations: {
        locations: async () => {
            const places = await Location.findAll();
            return places
        }
    },

    Mutation: {
        addLocation: async (parent, args) => {
            const place = await Location.create({ latitude: args.latitude, longitude: args.longitude });
            // console.log("longitude:", place.longitude);
            pubsub.publish('locations', )
            return place
        }
    },

    Subscription: {
        locationGroup: {
            locationGroup: () => pubsub.asyncIterator('locationGroup')
        },
        locations: {
            locations: () => pubsub.asyncIterator('locations')
        }
    }

}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
})

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
})

sequelize
    .authenticate()
    .then(function (err) {
        console.log('Connection has been established successfully.');
        //   User.sync()
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

(async () => {
    await sequelize.sync({ force: true });

    // const place = await Location.create({ latitude: "1", longitiude: "0" });
    // console.log("longitude:", place.longitude);

    // const places = await Location.findAll();
    // console.log("All users:", JSON.stringify(places, null, 2));
})();
