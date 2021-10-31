const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// Middle ware 
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ayr4p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('Travels')
        const serviceCollection = database.collection('services')
        const orderServices = database.collection('Orders')

        //get method for service collection
        app.get('/services', async (req, res) => {
            const result = await serviceCollection.find({}).toArray();
            res.send(result)
        })
        //get method for all orders
        app.get('/orders', async (req, res) => {
            const result = await orderServices.find({}).toArray();
            res.send(result)
        })
        // get my orders
        app.get('/myOrders/:id', async (req, res) => {
            const result = await orderServices.find({ email: req.params.id }).toArray();
            res.send(result)
        })

        // post method
        app.post('/addService', async (req, res) => {
            const query = req.body;
            const result = await serviceCollection.insertOne(query);
            res.send(result)
        })
        //add order
        app.post('/addOrder', async (req, res) => {
            const query = req.body;
            const result = await orderServices.insertOne(query);
            res.send(result.acknowledged)
        })
        // delete method

        app.delete('/deleteOrder/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await orderServices.deleteOne(query);
            console.log(result)
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Travel server is running..')
})

app.listen(port, () => {
    console.log('server port is', port)
})


