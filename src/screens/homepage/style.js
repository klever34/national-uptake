const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  imageContainer: {
    flex: 1,
    width: null,
    height: null
  },
  image2: {
    height: deviceHeight * 0.88,
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  imageLogo: {
    position: "relative",
    width: 66,
    height: 67,
    alignSelf: "center",
    marginTop: deviceHeight * 0.07,
  },
  imageLogo2: {
    position: "relative",
    width: 66,
    height: 67,
    alignSelf: "center",
  },
  loginButton: {
    backgroundColor: "#FF5A5A",
    alignSelf: "center",
    marginTop: 20,
    width: deviceWidth * 0.9,
  },
  textInput: {
    color: "#121212",
    marginTop: 10,
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 20
  },
  textInput2: {
    color: "#121212",
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 15,
    justifyContent: "center",
    textAlignVertical: "center",textAlign: "center",
  },
  textInput3: {
    color: "#121212",
    marginTop: 20,
    alignSelf: "center",
    fontSize: 12,
  },
  inputStyle: {
    alignSelf: "center",
    width: deviceWidth * 0.9,
    marginTop: 30
  },
  bottonStyle: {
    backgroundColor: '#FF5A5A',
    alignSelf: "center",
    marginTop:30,
    borderRadius: 100,
    textAlign: 'center',
    marginBottom: 50,
  },
  bottonStyle2: {
    backgroundColor: '#FF5A5A',
    alignSelf: "center",
    marginTop:30,
    borderRadius: 100,
    textAlign: 'center',
    marginBottom: 50,
    width: deviceWidth * 0.6,
  },
  fixedFooter: {
    
  }
};
