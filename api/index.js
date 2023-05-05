import express from "express";
import mysql from "mysql";
import cors from "cors";
import moment from "moment"
import bcrypt from "bcrypt";

const app = express()

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"saroukh"
})

app.use(express.json())
app.use(cors())

app.get("/users", (req,res)=>{
    const q = "SELECT * FROM users"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/users", async (req,res)=>{

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const q = "INSERT INTO users (`username`, `email`, `password`, `img`,`phoneNumber`) VALUES (?)"
    const values = [
        req.body.username,
        req.body.email,
        hashedPassword,
        // req.body.password,
        req.body.img,
        req.body.phoneNumber
    ]

    db.query(q, [values], (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
    } catch (err) {
        res.status(500).send()
    }
})




app.get("/", (req,res)=>{
    res.json("hello from the other side")
})

app.get("/posts", (req, res)=>{
    const q = "SELECT * FROM posts"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/posts", (req, res)=>{
    const q = "INSERT INTO posts (`title`, `desc`, `price`, `img`,`userID`,`postedAt`,`cat`) VALUES (?)"
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.img,
        req.body.userID,
        moment().format(),
        req.body.cat
    ]

    db.query(q, [values], (err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})


app.listen(5501, ()=>{
    console.log("Connected to server!")
})