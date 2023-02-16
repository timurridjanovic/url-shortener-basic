const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const shortid = require('shortid')

const Schema = mongoose.Schema

const ShortenedUrlSchema = new Schema({
  _id: { type: String, index: true },
  longUrl: String,
  shortUrl: String,
  counter: { type: Number, default: 0 }
}, { _id: false, timestamps: true });

const ShortenedUrl = mongoose.model("ShortenedUrl", ShortenedUrlSchema)

const saveUrl = async (req) => {
  const { body: { url } } = req
  const domain = req.get('origin')

  const longUrl = url
  const newUrlId = shortid.generate()
  const urlFound = await ShortenedUrl.findById(newUrlId);
  if (!urlFound) {
    const shortUrl = `${domain}/${newUrlId}`
    const newShortenedUrl = new ShortenedUrl({ _id: newUrlId, longUrl, shortUrl })
    const insertedUrl = await newShortenedUrl.save()
    return insertedUrl
  } else {
    return saveUrl(req)
  }
}

const createShortenedUrl = async (req, res) => {
  try {
    const insertedUrl = await saveUrl(req)
    return res.status(201).json(insertedUrl);
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}


const apiRouter = () => {
  const router = express.Router();

  router.post('/create-shortened-url', createShortenedUrl)

  return router;
}

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/:id', async (req, res) => {
  try {
    const { params: { id } } = req
    const urlFound = await ShortenedUrl.findById(id);
    if (urlFound) {
      const longUrl = urlFound.longUrl
      res.redirect(longUrl)
    } else {
      throw new Error('short url not found')
    }
  } catch (err) {
    console.error(err)
    res.send(err.message)
  }
})



app.use(bodyParser.json())
app.use('/api', apiRouter())


const start = async () => {
  try {
    const mongoDb = "mongodb://127.0.0.1/url_shortener";
    await mongoose.connect(mongoDb)
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
};

start()
