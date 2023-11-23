Certainly! Here's an updated version of the README.md file that includes the functions of the app:

# Google Calendar's events tracker
Effortlessly track and count upcoming, ongoing, and past events for each of your Google Calendar's calendars. Stay organized with insightful event statistics. Never miss important appointments again. Simplify event management effortlessly.

## Table of Contents
- [Google Calendar's events tracker](#google-calendars-events-tracker)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Usage](#usage)
  - [Build](#build)
  - [Functions](#functions)
  - [Contributing](#contributing)
  - [License](#license)

## Installation
1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. `Optional for count off events feature, just only for better UX on Chrome, Edge` Install plugin Chrome, Edge: `Tags for Google Calendar™"`. Link [here](https://chromewebstore.google.com/detail/tags-for-google-calendar/ncpjnjohbcgocheijdaafoidjnkpajka)

## Configuration

Before running the project, you need to configure the following environment variables in ".env":

- `REACT_APP_GOOGLE_CLIENT_ID`: Your Google client ID. Refer to [Google Calendar API](https://developers.google.com/calendar/api/quickstart/go) for instructions on obtaining a client ID.
- `REACT_APP_GOOGLE_CLIENT_KEY`: Your Google client key. Refer to [Google Calendar API](https://developers.google.com/calendar/api/quickstart/go) for instructions on obtaining a client key.
- `REACT_APP_TIME_ZONE`: Your application's time zone. For example, "Asia/Ho_Chi_Minh". Choose the appropriate time zone for your application.

Create a `.env` file and add the following lines:

```
REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
REACT_APP_GOOGLE_CLIENT_KEY=YOUR_GOOGLE_CLIENT_KEY
REACT_APP_TIME_ZONE=YOUR_APP_TIME_ZONE
```

## Usage
With the tool
1. Run `npm start` to start the development server.
2. Open your browser and navigate to `http://localhost:3000` to view the application.
With Google Calendar
1. If you want to use count off function. Change event's title with prefix `off:`. For more better UX install plugin at  `Step 3 of Installation` of [Installation](#installation)

## Build
1. Run `npm run build` to start the development server.
2. The build files will be generated in the build directory. You can deploy the contents of the build directory to a web server or hosting platform of your choice.


## Functions
The app provides the following functions for For each Calendar
1. **Function 1**: Show all events in List view
2. **Function 2**: Dashboard show Count number of past and current events
3. **Function 3**: Dashboard show Count number of future events
4. **Function 4**: Show time range from beginning event to the latest event
5. **Function 5**: Count `off:` events by change event's title with prefix `:off`. Show percentage of offline events in the past 

## Contributing
Contributions are welcome! Please follow the guidelines in [CONTRIBUTING.md](CONTRIBUTING.md) to contribute to this project.

## License
Free software! 