
require('dotenv').config({ path: './.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const mockLeads = [
  {
    name: "John Doe",
    phone: "555-123-4567",
    email: "john.doe@example.com",
    address: "123 Main St",
    city: "Decatur",
    state: "GA",
    zip: "30030",
    freshStartAmount: 20000,
    status: "New",
    createdAt: new Date(),
  },
  {
    name: "Jane Smith",
    phone: "555-987-6543",
    email: "jane.smith@example.com",
    address: "456 Oak Ave",
    city: "Stone Mountain",
    state: "GA",
    zip: "30083",
    freshStartAmount: 25000,
    status: "New",
    createdAt: new Date(),
  },
  {
    name: "Peter Jones",
    phone: "555-555-5555",
    email: "peter.jones@example.com",
    address: "789 Pine Ln",
    city: "Lithonia",
    state: "GA",
    zip: "30058",
    freshStartAmount: 15000,
    status: "New",
    createdAt: new Date(),
  },
  {
    name: "Mary Johnson",
    phone: "555-111-2222",
    email: "mary.johnson@example.com",
    address: "101 Maple Dr",
    city: "Clarkston",
    state: "GA",
    zip: "30021",
    freshStartAmount: 30000,
    status: "New",
    createdAt: new Date(),
  },
  {
    name: "David Williams",
    phone: "555-333-4444",
    email: "david.williams@example.com",
    address: "222 Birch Rd",
    city: "Avondale Estates",
    state: "GA",
    zip: "30002",
    freshStartAmount: 18000,
    status: "New",
    createdAt: new Date(),
  },
  {
    name: "Unprofitable Property",
    phone: "555-777-8888",
    email: "unprofitable.property@example.com",
    address: "777 Bad Deal Rd",
    city: "Atlanta",
    state: "GA",
    zip: "30303",
    freshStartAmount: 30000,
    status: "New",
    createdAt: new Date(),
    analysis: {
      marketValue: 300000,
      mortgageBalance: 250000,
      equity: 50000,
      profitPotential: -10000, // Calculated as equity - freshStartAmount - (marketValue * 0.1)
      dealScore: 40,
    },
  },
];

async function seedDB() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to the database.");

    const db = client.db("demo");
    const leadsCollection = db.collection("leads");
    const usersCollection = db.collection("users");

    await leadsCollection.deleteMany({});
    console.log("Cleared the leads collection.");

    await leadsCollection.insertMany(mockLeads);
    console.log("Inserted mock leads.");

    await usersCollection.deleteMany({});
    console.log("Cleared the users collection.");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password", salt);

    await usersCollection.insertOne({
      username: "admin",
      password: hashedPassword,
      createdAt: new Date(),
    });
    console.log("Inserted admin user.");

  } catch (err) {
    console.error("Error seeding the database:", err);
  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
}

seedDB();
