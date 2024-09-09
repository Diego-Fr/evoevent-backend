const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()


const client = new MongoClient(process.env.DB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

const saveCheckoutId = async (checkout_obj) =>{
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
    
        
        // Send a ping to confirm a successful connection
        let db = client.db("evoevent")
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
        const collection = db.collection("checkout");
    
        let obj = {
            checkout_id: checkout_obj.id,
            status: checkout_obj.status,
            email_confirmation: null,
            created_at: new Date(),
            updated_at: new Date(),
        }
    
        const result = await collection.insertOne(obj);
    
        console.log(
          `A document was inserted with the _id: ${result.insertedId}`,
       );
        
      } catch(e){
        console.log(e);
        
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

const getCheckout = async checkout_id =>{
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        
        let db = client.db("evoevent")
    
        const collection = db.collection("checkout");
    
        let result = await collection.findOne({
            checkout_id: checkout_id
        })
    
        console.log(result)

        return result
        
    } catch(e){
        console.log(e);
    
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

module.exports = {saveCheckoutId, getCheckout}