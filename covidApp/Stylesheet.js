import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - (Dimensions.get('window').height / 4),
  },
  otherComponentStyle: {
    position: 'absolute',
    bottom: (Dimensions.get('window').height / 4),
    backgroundColor: '#174157'
  },
  bottomComponentStyle: {
    height: Dimensions.get('window').height / 4,
    backgroundColor: '#233954'
  },
  countryCardStyle: {
    backgroundColor: '#233954',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 15,
    margin: 7,
    alignItems: 'center'
  },
  modalView: {
    margin: 15,
    backgroundColor: "#25252b",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  centeredView: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",

},
closeModalBtn: {
  backgroundColor: '#95959e',
  padding: 5,
  margin: 10,
  borderRadius: 5,
  borderColor: '#dadae3',
  borderWidth: 1
}
});
