# Google Calendar Fetch Events API

This service is a simple indirection between a client and the Google Calendar API. It 
abstracts the calls to Google Calendar (and the secrets to call it) away from clients. 
Additionally, it caches events so that we may limit calls from clients to the Google 
Calendar API.

This service returns a JSON representation of a configurable max number of upcoming events.
Those events are stored in a cache with simple time-based expiry, and will refresh from the 
Google Calendar API every configurable number of minutes. The JSON format returned for events is:

```
[
  {
    "start": "2023-10-17T10:30:00-07:00",
    "end": "2023-10-17T11:00:00-07:00",
    "summary": "Meeting Summary",
    "htmlLink": "HTTP link to the event on Google Calendar",
    "location": "Location"
    "description" : "Description of the event"
  }
]
```

While designed to surface events from the TBD Open Source Calendar on TBD websites, this
API will work for any Google Calendar for which you have an API Key and the Calendar ID.

## Building

### Configuration

Copy the configuration file `.env.example` to `.env`. Fill in parameters as documented in 
the environment file. Some defaults are supplied, and others for security reasons you'll need
to attain from either the Google Calendar API console, the Google Calendar Console, or, in the 
case of TBD private assets (like the TBD Open Source Calendar), a TBD employee if you are also a 
TBD employee. 

### Node Versions

We recommend using [Node Version Manager](https://github.com/nvm-sh/nvm). The `.nvmrc` file notes which Node version to build and run on, and can be set by running:

```
$> nvm use
```

### Install and Run

Once your Node version is installed and set, build and run:

```
$> npm i
$> node app.js
```

You should see output including a line similar to the following:

```
Server running on port: 3000
```

This port is configured in the environment file `.env`. Once running, HTTP requests via `curl` or the Browser may be issued to the endpoint `/events`, for instance `http://localhost:3000/events`.