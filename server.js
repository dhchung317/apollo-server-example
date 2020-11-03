const { ApolloServer, gql } = require('apollo-server')
var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://bwsbllqoiqyvtn:bd0e4466e4e41112f2b5f48a5b6b6f81d515c7f9da4ee62286cbc0af5d31051a@ec2-52-21-0-111.compute-1.amazonaws.com:5432/d4j89gtkj4rki0')

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

    type Query {
        locationGroup: [Location]
    }

    type Location {
        localeId: String,
        latitude: Float!,
        longitude: Float!,
        address: String
    }

    # input LocationInfo {
    #     localeId: String
    #     latitude: Float!
    #     longitude: Float!
    #     address: String
    # }

    type LocationGroup {
        uid: String,
        type: String,
        locations: [Location]
    }

    type Mutation {
        addLocation(latitude: Float!, longitude: Float!):Location!
    }
`;

const resolvers = {
    Query: {
        locationGroup: async () => {

                const places = await Location.findAll();
                console.log("All users:", JSON.stringify(places, null, 2));
                return places
        }
    },
    Mutation: {
        addLocation: async (parent, args) => {
                const place = await Location.create({ latitude: args.latitude, longitude: args.longitude});
                // console.log("longitude:", place.longitude);
                return place
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