import express from "express";
import {google} from "googleapis";
import 'dotenv/config';



const app = express();

const port = 8000;

// creating responce for home routs
app.get("/", (req, res) => {
    res.status(200).json("Sucessfully connected");
  });

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL 
  );

  // generate a url that asks permissions for  Google Calendar scopes
const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/meetings.space.created'
];


app.get("/google",(req,res)=>{
    const url = oauth2Client.generateAuthUrl({
        access_type:'online',
        scope:scopes
    })
    res.redirect(url);
});

app.get("/google/redirect",(req,res)=>{
    // console.log(req.query);
    const token = req.query.code;
    res.send("Its working")
})
 
app.listen(port,()=>{
    console.log("Server connected on prot ",port)
})