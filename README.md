# Surf Notification Email Alert

## Description
This surf app uses weather data from SMHI api(Swedish Meteorological and Hydrological Institute) and detects if good surf conditions might be expected at Knäbäckshusen in Sweden. If good conditions can be expected, every subscriber will receive a notification by email the day before.

Knäbäckshusen is well-known by surfers in the area as a spot that at times can deliver great surfing conditions, for being in the Baltic Sea. Since the Baltic Sea is rather narrow, the only times surf conditions can be favorable in Knäbäckshusen is when the wind is onshore for some time and then, either shifts to offshore, or decreases drastically. Such conditions occour very rarely and in order to be able to spot such an instance surfers must constantly be monitoring surfing apps.

## Features
- **API**: SMHI weather api is called for wind conditions.  
- **Database**: Users can subscribe/unsubscribe to the service. 
- **Email**: Nodemail send email to the subscribers if the conditions are expected to be favorable. 

## Technologies
- **Backend**: NodeJS, Express, Axios
- **Frontend**: HTML, CSS, JavaScript
- **Database**: MongoDB

## Licens
Caroline Eklund holds the license. 

## Deployment
The app is currently deployed on Render for free, and therfore the loading of the app is slow.  
