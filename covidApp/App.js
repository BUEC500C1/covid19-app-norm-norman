import React, { useState } from "react";
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Modal } from "react-native";
import { styles } from './Stylesheet.js'
import MapView from "react-native-maps";
import axios from 'axios';

import country_centroids_az8 from './country_centroids_az8.json'

const countryCentroidsList = country_centroids_az8.features.map(country => {
  return { name: country.properties.name, lat: country.properties.Latitude, long: country.properties.Longitude, iso2: country.properties.iso_a2 }
})

const App = () => {

  // state variables
  const [region, setRegion] = useState({
    latitude: 12.5208803838,
    longitude: -69.9826771125,
    latitudeDelta: 1,
    longitudeDelta: 1
  });
  const [savedRegion, setSavedRegion] = useState({});
  const [visibleMapData, setVisibleMapData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});

  async function onRegChangeComplete(region) {
    setRegion(region)

    // find visible country data
    const visibleCountriesISO2LatLong = checkCoordsforCountries(region);

    // make API call to get slug for each visible country
    axios.get('https://api.covid19api.com/countries').then( res => {

      // filter response data to only include the visible countries - validate with ISO2 values
      const visibleCountryData = res.data.filter(country => {
        if (visibleCountriesISO2LatLong.map(visibleCountry => { return visibleCountry.ISO2}).includes(country.ISO2)) {return country}
      }).map(country => { // map through relevant response data to return response data as well as applicable centroid coordinates
        let isoMatch = visibleCountriesISO2LatLong.find(visibleCountry => visibleCountry.ISO2 == country.ISO2)
        return {name: country.Country, slug: country.Slug, iso2: country.ISO2, latitude: isoMatch.Latitude, longitude: isoMatch.Longitude}
      });

      // update state with the correct visible map data
      setVisibleMapData(visibleCountryData);
      })
};

  function checkCoordsforCountries(region) {

    // calculate box boundaries to compare with centroids
    regionLatMin = region.latitude - (region.latitudeDelta / 2)
    regionLatMax = region.latitude + (region.latitudeDelta / 2)
    regionLongMin = region.longitude - (region.longitudeDelta / 2)
    regionLongMax = region.longitude + (region.longitudeDelta / 2)

    // find visible countries from centroids
    const visibleCountriesFullEntry = countryCentroidsList.filter(country => {
      if (country.lat > regionLatMin && country.lat < regionLatMax && country.long > regionLongMin && country.long < regionLongMax) {
        return country
      }
    })

    // return ISO2 values and centroid coordinates
    return visibleCountriesFullEntry.map(country => {
      return {ISO2: country.iso2, Latitude: country.lat, Longitude: country.long}
    })
  };

  function focusCountryOnPress(item) {
    // save the current region so that we can go back to it
    setSavedRegion(region);

    // get new region
    const newRegion = {
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 5,
      longitudeDelta: 5
    };

    // zoom in to new region
    setRegion(newRegion);

    var confirmed, recovered, deaths;

    // make api calls for confirmed, recovered, and death data for the specific country
    axios.get(`https://api.covid19api.com/total/dayone/country/${item.slug}/status/confirmed`).then( resConf => {
      resConf.data.length == 0 ? confirmed = 0 : confirmed = resConf.data.pop().Cases;
        axios.get(`https://api.covid19api.com/total/dayone/country/${item.slug}/status/recovered`).then( resRec => {
          resRec.data.length == 0 ? recovered = 0 : recovered = resRec.data.pop().Cases;
          axios.get(`https://api.covid19api.com/total/dayone/country/${item.slug}/status/deaths`).then( resDeath => {
            resDeath.data.length == 0 ? deaths = 0 : deaths = resDeath.data.pop().Cases;
            const content = {name: item.name, confirmed, recovered, deaths}
            setModalContent(content);
          })})
    });
    setModalVisible(true);


  };

  return (
    <View>
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
      <View style={styles.centeredView}>
      <View style={styles.modalView}>
            <Text style={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}> {modalContent.name} {'\n'}</Text>
            <Text style={{color: 'white'}}> Confirmed Cases: {modalContent.confirmed} {'\n'} Recovered: {modalContent.recovered} {'\n'} Deaths: {modalContent.deaths}</Text>

            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => {
                setModalVisible(!modalVisible);
                setRegion(savedRegion);
              }}
            >
              <Text style={{color:'white'}}>Return to Map</Text>
            </TouchableOpacity>
          </View>
          </View>
          </Modal>
          </View>
    <MapView
      style={styles.mapStyle}
      region={region}
      onRegionChangeComplete={onRegChangeComplete}
    ></MapView>
    <View style={styles.otherComponentStyle}>
    </View>
    <SafeAreaView  style={styles.bottomComponentStyle}>
    <FlatList
      data={visibleMapData}
      renderItem={({item}) => (
      <TouchableOpacity style={styles.countryCardStyle} onPress={()=>{focusCountryOnPress(item)}}>
        <Text style={{color: 'white'}}>{item.name}</Text>
      </TouchableOpacity>)}
    />
    </SafeAreaView >
    </View>
  );
};

export default App;
