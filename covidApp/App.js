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

    const visibleCountriesISO2LatLong = checkCoordsforCountries(region);

    axios.get('https://api.covid19api.com/countries').then( res => {
      const visibleCountryData = res.data.filter(country => {
        if (visibleCountriesISO2LatLong.map(visibleCountry => { return visibleCountry.ISO2}).includes(country.ISO2)) {return country}
      }).map(country => {
        let isoMatch = visibleCountriesISO2LatLong.find(visibleCountry => visibleCountry.ISO2 == country.ISO2)
        return {name: country.Country, slug: country.Slug, iso2: country.ISO2, latitude: isoMatch.Latitude, longitude: isoMatch.Longitude}
      });

      setVisibleMapData(visibleCountryData);
      })


        // axios.get(`https://api.covid19api.com/total/dayone/country/${country.Slug}/status/confirmed`).then( resConf => {
        //   resConf.data.length == 0 ? confirmed = 0 : confirmed = resConf.data.pop().Cases;
        //   axios.get(`https://api.covid19api.com/total/dayone/country/${country.Slug}/status/recovered`).then( resRec => {
        //     resRec.data.length == 0 ? recovered = 0 : recovered = resRec.data.pop().Cases;
        //     axios.get(`https://api.covid19api.com/total/dayone/country/${country.Slug}/status/deaths`).then( resDeath => {
        //       resDeath.data.length == 0 ? deaths = 0 : deaths = resDeath.data.pop().Cases;
        //       var countryData = { name: country.Country, slug: country.Slug, confirmed, recovered, deaths };
        //       visibleData.push(countryData);
        //       visibleMapData = visibleData;
        //       setVisibleMapData(visibleData)
        //     })
        //   })
        // })
      //})


};

  function checkCoordsforCountries(region) {
    regionLatMin = region.latitude - (region.latitudeDelta / 2)
    regionLatMax = region.latitude + (region.latitudeDelta / 2)
    regionLongMin = region.longitude - (region.longitudeDelta / 2)
    regionLongMax = region.longitude + (region.longitudeDelta / 2)

    const visibleCountriesFullEntry = countryCentroidsList.filter(country => {
      if (country.lat > regionLatMin && country.lat < regionLatMax && country.long > regionLongMin && country.long < regionLongMax) {
        return country
      }
    })

    return visibleCountriesFullEntry.map(country => {
      return {ISO2: country.iso2, Latitude: country.lat, Longitude: country.long}
    })
  };

  function focusCountryOnPress(item) {
    setSavedRegion(region);
    const newRegion = {
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 5,
      longitudeDelta: 5
    };
    setRegion(newRegion);
    var confirmed, recovered, deaths;
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
