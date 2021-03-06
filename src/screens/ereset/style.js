const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  container: {
    backgroundColor:"#fff",
    paddingTop: 30
  },
  imageContainer: {
    backgroundColor: '#FF5A5A',
   
  },
  image2: {
    height: deviceHeight * 0.6,
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  imageLogo: {
    position: "absolute",
    width: 68,
    height: 56,
    marginTop: 100,
    alignSelf: "center"
  },
  loginButton: {
    backgroundColor: "#792579",
    alignSelf: "center",
    marginTop: deviceHeight * 0.8
  },
  textInput: {
    color: "black",
    marginTop: 20,
    fontSize: 25,
    fontWeight: "bold",
    marginLeft:20
  },
  textInput2: {
    color: "#121212",
    marginTop: 10,
    fontSize: 12,
    marginLeft:20,
    marginRight:20,
  },
  inputStyle: {
    alignSelf: "center",
    width: deviceWidth * 0.9,
    marginTop: 10,
    backgroundColor: 'white',
    color: 'white',
  },
  bottonStyle: {
    backgroundColor: '#FF6161',
    alignSelf: "center",
    marginTop:deviceHeight * 0.3,
    width: deviceWidth * 0.4,
    borderRadius: 100,
    textAlign: 'center'
  },
  bottonStyle2: {
    backgroundColor: '#FF6161',
    alignSelf: "center",
    marginTop:30,
    width: deviceWidth * 0.9,
    borderRadius: 100,
    textAlign: 'center'
  },
  card: {
    elevation: 3,
    backgroundColor: '#fff',
    shadowColor: '#c4c4c4',
    shadowOffset: {width: 0, height: 1.5},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginVertical: 10,
  },
};
