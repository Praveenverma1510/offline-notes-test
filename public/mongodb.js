import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
  tls: true,
  tlsAllowInvalidCertificates: false, // Only for testing, not production
  retryWrites: true,
  retryReads: true
}

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

  client = new MongoClient(uri, options)
  clientPromise = client.connect()
  console.log('mongodb connected')


export default clientPromise
