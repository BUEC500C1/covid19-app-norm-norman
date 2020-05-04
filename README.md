# COVID-19 Visualization App
Author: Gennifer Norman

## Summary

This application is designed to easily navigate through a map of the world and find regularly updated data about COVID-19 by country. The format of this app was designed with a user who is interested in regional trends in mind. The user can zoom and pan throughout the world and will be shown a scrollable list at the bottom of the map that updates in real time to reflect the visible countries on the map. When the user wants to explore the data of a specific country they simply press the button with the country's name on it and a modal will pop up with the relevant information.

## Dependencies
- `axios:` used for frontend HTTP requests
- `react-native-maps:` used for map component

## Data Manipulation Explanation

1. `country_centroids_az8.json` contains the centroids of each country as well as additional country information such as the 2 letter code corresponding to each country (ISO2). The centroids, country names, and ISO2 values are extracted from this file and stored in the variable `countryCentroidsList`.

2. When the map region is changed, the asynchronous function `onRegChangeComplete(region)` is called. This function calls the function `checkCoordsforCountries(region)` which checks the centroid coordinates in the list `countryCentroidsList` against the coordinates for the visible region to return a list of objects that contains the ISO2 values and centroid coordinates of the visible countries. This list is stored in `visibleCountriesISO2LatLong`.

3. A get request is made to `https://api.covid19api.com/countries` which returns a list of countries, their ISO2 values, and their slugs, which we will need to get country relevant data later on. This response data is filtered to include only the visible country data. To filter, the ISO2 values of the response data are compared to the ISO2 values in `visibleCountriesISO2LatLong` . The data for the visible countries is stored along with the applicable centroid coordinates in the variable `visibleCountryData` which is used to update the state.

4. When a country is selected for further investigation, the map zooms in on this country and a modal pops up with the COVID-19 data for that country. This data is collected from three API calls, each in the form `https://api.covid19api.com/total/dayone/country/{SLUG}/status/{STATUS}`. Once all the data is collected, the data is stored in the state variable `modalContent` and the modal is updated with the correct data.

## Screenshots

![first screen](/images/IMG_3718.jpeg)

Screenshot when app is first opened - defaults to only show Aruba

![scrollable list gif](/images/scroll-list.gif)

Gif to show the scrolling list feature that displays all the visible countries

![realtime update gif](/images/realtime-update.gif)

Gif to show the realtime update of the visible countries list at the bottom of screen

![open modal gif](/images/open-modal.gif)

Gif to show the modal opening and displaying the selected country's data
