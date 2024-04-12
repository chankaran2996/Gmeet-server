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

  const calendar =  google.calendar({
    version:"v3",
    auth:process.env.API_KEY,
  })

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

app.get("/google/redirect",async (req,res)=>{
    // console.log(req.query);
    const code = req.query.code;
    // This will provide an object with the access_token and refresh_token.
// Save these somewhere safe so they can be used at a later time.
const {tokens} = await oauth2Client.getToken(code)
oauth2Client.setCredentials(tokens);

    res.send({msg:"Its working",token:tokens})
})

app.get("/schedule_event",async (req,res)=>{
    const event = {
        'summary': 'Create test',
        'location': 'Akshaya Today',
        'description': 'A chance to hear more about Google\'s developer products.',
        'start': {
          'dateTime': '2024-04-13T09:00:00-07:00',
          'timeZone': 'Asia/Kolkata',
        },
        'end': {
          'dateTime': '2024-04-13T17:00:00-07:00',
          'timeZone': 'Asia/Kolkata',
        },
        'recurrence': [
          'RRULE:FREQ=DAILY;COUNT=2'
        ],
        'attendees': [
          {'email': 'chandrasekaran2996@gmail.com'},
          {'email': 'chandrasekaran@guvi.in'},
        ],
        'reminders': {
          'useDefault': false,
          'overrides': [
            {'method': 'email', 'minutes': 24 * 60},
            {'method': 'popup', 'minutes': 10},
          ],
        },
      };
    let result= await calendar.events.insert({
        calendarId:"primary",
        auth:oauth2Client,
        requestBody:event

    })
    res.send({msg:"created"});
})
 
app.listen(port,()=>{
    console.log("Server connected on prot ",port)
})