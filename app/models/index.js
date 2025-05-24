import { MongoClient } from "mongodb"

export const db = new MongoClient("mongodb+srv://banderwardi:moniwardi@cluster0.bkfdnwr.mongodb.net/").db('basiri')