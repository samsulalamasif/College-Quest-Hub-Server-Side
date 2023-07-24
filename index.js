const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000
require("dotenv").config();
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vqy99hm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();
        const collegesCollection = client.db("College-Quest-Hub").collection("colleges")
        const admissionCollection = client.db("College-Quest-Hub").collection("admission")
        const reviewsCollection = client.db("College-Quest-Hub").collection("reviews")


        // search text
        const indexKeys = { name: 1 };
        const indexOptions = { name: "name" };
        const result = await collegesCollection.createIndex(indexKeys, indexOptions);


        // all colleges
        app.get("/colleges", async (req, res) => {
            const cursor = collegesCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get("/review", async (req, res) => {
            const cursor = reviewsCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })


        app.get("/collegeSearch/:text", async (req, res) => {
            const text = req.params.text
            const result = await collegesCollection.find({
                $or: [{ name: { $regex: text, $options: "i" } }]
            }).toArray()
            res.send(result)
        })




        // college details
        app.get("/colleges/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await collegesCollection.findOne(query)
            res.send(result)
        })


        // admission
        app.post("/admission", async (req, res) => {
            const admission = req.body
            const result = await admissionCollection.insertOne(admission)
            res.send(result)
        })



        // my college data
        app.get("/admission/:email", async (req, res) => {
            const result = await admissionCollection.find({ email: req.params.email }).toArray()
            res.send(result)
        })

        // review
        app.post("/review", async (req, res) => {
            const review = req.body
            const result = await reviewsCollection.insertOne(review)
            res.send(result)
        })

        app.get("/review", async (req, res) => {
            const cursor = reviewsCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);









app.get("/", (req, res) => {
    res.send("College Quest Hub Server Side Running")
})

app.listen(port, () => {
    console.log(`College Quest Hub Server Side Running: ${port}`);
})

