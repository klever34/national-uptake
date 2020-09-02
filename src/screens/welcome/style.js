const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  container: {
    backgroundColor:"#FFF"
  },
  imageContainer: {
   
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
    color: "white",
    marginTop: deviceHeight * 0.06,
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "bold"
  },
  textInput2: {
    color: "#121212",
    marginTop: deviceHeight * 0.2,
    alignSelf: "center",
    fontSize: 12,
  },
  inputStyle: {
    alignSelf: "center",
    width: deviceWidth * 0.9,
    marginTop: 10,
    backgroundColor: '#EF3C3C',
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
    marginTop:20,
    width: deviceWidth * 0.93,
    borderRadius: 100,
    textAlign: 'center',
    
  },
  bottonStyle3: {
    backgroundColor: '#EAF3FF',
    alignSelf: "center",
    marginTop:20,
    width: deviceWidth * 0.93,
    borderRadius: 100,
    textAlign: 'center',
    borderColor: '#FF6161',
    borderWidth: 1,
  },
  wrapper: {},
  slide1: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide2: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide3: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
    textAlign: "center",
    marginLeft:10,
    marginRight:10,
  },
  dot: {
    backgroundColor: 'white'
  }
};
