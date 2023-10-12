// For reading in env vars from '.env' file
require('dotenv').config();
// Logging
const winston = require('winston');

/*
 * Configuration
 * 
 * Externalized through environment variables, which may be set either in `.env` or on the system.
 */
// Calendar ID to read events from. Can be attained via the "Calendar ID" field in Google Calendar > Calendar Settings > Integrate Calendar
const CALENDAR_ID = process.env.CALENDAR_ID;
// This is configured in the Google Cloud Console under Credentials
const API_KEY = process.env.API_KEY;
// Number of events we'll fetch from the API; default to 10 if undefined
const NUM_EVENTS_TO_FETCH = process.env.NUM_EVENTS_TO_FETCH || 10;
// Logging verbosity, default to "info" (which is quiet as to not pollute server logs; "verbose" is where we send event output)
const LOG_VERBOSITY = process.env.LOG_VERBOSITY || "info";

/*
 * Set up logging
 */
const logger = winston.createLogger({
  level: LOG_VERBOSITY,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console() //,
    // If we want file-based logging
    // new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

/* 
 * Hold the calendar events
 */
var calendarEvents;

/*
 * Precondition checks
 */
if (CALENDAR_ID === undefined) {
  throw new Error("env var 'CALENDAR_ID' is required. Attain from Google Calendar > Calendar Settings > Integrate Calendar");
}
if (API_KEY === undefined) {
  throw new Error("env var 'API_KEY' is required. Attain from Google Cloud Console > Google API > Credentials");
}

// Constants
const { google } = require('googleapis');
const cal = google.calendar({
  version: 'v3',
  auth: API_KEY
});

/**
 * Lists the upcoming events for CALENDAR_ID
 *  
 * @return An array of calendar events, each event with fields: start, end, summary, hangoutLink, htmlLink, location, description
 */
async function fetchEvents() {
  const calendar = cal;
  const calEvents = [];
  const res = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: new Date().toISOString(),
    maxResults: NUM_EVENTS_TO_FETCH,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    logger.verbose('No upcoming events found.');
    return calEvents;
  }
  logger.verbose('Next (max) ' + NUM_EVENTS_TO_FETCH + ' Events:');
  events.map((event, i) => {

    // Hold the object
    const calEvent = new Object();
    calEvent.start = event.start.dateTime || event.start.date;
    calEvent.end = event.end.dateTime || event.end.date;
    calEvent.summary = event.summary;
    calEvent.hangoutLink = event.hangoutLink;
    calEvent.htmlLink = event.htmlLink;
    calEvent.location = event.location;
    calEvent.description = event.description;

    calEvents.push(calEvent);

    const eventDetail = "\nSummary: " + calEvent.summary + "\nHangout Link: " +
      calEvent.hangoutLink + "\nHTML Link: " +
      calEvent.htmlLink + "\nLocation: " +
      calEvent.location + "\nStart: " +
      calEvent.start + "\nEnd: " +
      calEvent.end + "\nDescription: " +
      calEvent.description + "\n"
    logger.verbose(eventDetail);
  });
  return calEvents;
}

// Fire away
fetchEvents().then(
  response => {
    calendarEvents = response;
    logger.verbose(JSON.stringify(calendarEvents));
  }
)
