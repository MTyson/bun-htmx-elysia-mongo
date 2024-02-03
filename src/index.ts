import { Elysia } from "elysia";
import { staticPlugin } from '@elysiajs/static';
const { MongoClient } = require('mongodb');

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .get('/clicked', () => 'FooBar')
  .get("/db", async () => {

    const url = "mongodb://127.0.0.1:27017/quote?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0";

    const client = new MongoClient(url, { useUnifiedTopology: true });
try {

    await client.connect();

    const database = client.db('quote');
    const collection = database.collection('quotes');

    const result = await collection.insertOne({"quote":"Thought is the grandchild of ignorance.",
      "author":"Swami Venkatesananda"});
    console.log(`String inserted with ID: ${result.insertedId}`);

  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
	  return "OK";
  })
  .get("/quotes", async () => {

const url = "mongodb://127.0.0.1:27017/quote?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0";

      const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
      await client.connect();

      const database = client.db('quote');
      const collection = database.collection('quotes');

      const quotes = await collection.find().toArray();

      // Build the HTML table structure
      let html = '<table border="1">';
      html += '<tr><th>Quote</th><th>Author</th></tr>';
      for (const quote of quotes) {
        html += `<tr><td>${quote.quote}</td><td>${quote.author}</td></tr>`;
      }
      html += '</table>';

      return html;
    } catch (error) {
      console.error(error);
      return "Error fetching quotes";
    } finally {
      await client.close();
    }

  })
  app.post("/add-quote", async (req) => {
    const url = "mongodb://127.0.0.1:27017/quote?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0";

    try {
        const client = new MongoClient(url, { useUnifiedTopology: true });
        await client.connect();

        const database = client.db('quote');
        const collection = database.collection('quotes');

        const quote = req.body.quote;
        const author = req.body.author;

        await collection.insertOne({ quote, author });

	 const newRow = `<tr><td><span class="math-inline">\{quote\}</td\><td\></span>{author}</td></tr>`;
    return newRow;
        //return "Quote added successfully";
    } catch (error) {
        console.error(error);
        return "Error adding quote";
    } finally {
        await client.close();
    }
})
  .use(staticPlugin())
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
