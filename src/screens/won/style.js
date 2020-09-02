const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  imageContainer: {
    width: deviceWidth,
    height: 393,
  },
  image2: {
    height: deviceHeight * 0.75,
    bottom: 0,
    position: 'absolute',
    width: '100%',
    backgroundColor: '#fff',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    // top: 60
  },
  imageLogo: {
    width: 60,
    height: 60,
    marginLeft:10,
    borderRadius: 60
  },
  loginButton: {
    backgroundColor: "#792579",
    alignSelf: "center",
    marginTop: deviceHeight * 0.8
  },
  textInput: {
    color: "#273444",
    marginTop: 0,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 20,
    marginBottom: 10
  },
  textInput2: {
    color: "#273444",
    marginTop: 10,
    marginLeft: 10,
    marginRight: 20,
    fontSize: 16,
    fontWeight: "600",
   
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
    backgroundColor: '#F36C24',
    alignSelf: "center",
    marginTop:30,
    width: deviceWidth * 0.4,
    borderRadius: 100,
    textAlign: 'center'
  },
  bottonStyle2: {
    backgroundColor: '#5B9DEE10',
    alignSelf: "center",
    width: deviceWidth * 0.4,
    borderRadius: 100,
    justifyContent: 'center',
  },
  selectStyle: {
    marginTop:30,
    backgroundColor: '#5B9DEE10',
    borderRadius: 30, borderWidth: 1, borderColor: '#5B9DEE10', marginLeft: 0, marginRight:0
  },
  selectStyle2: {
    marginTop:10,
    backgroundColor: '#5B9DEE10',
    borderRadius: 30, borderWidth: 1, borderColor: '#5B9DEE10', marginLeft: 0, marginRight:10
  },
  selectIconStyle: {
    color: '#5B9DEE',
    marginLeft: 20,
    marginRight: 10,
    
  },
  bottonStyle3: {
    backgroundColor: '#FF6161',
    alignSelf: "center",
    marginTop:30,
    width: deviceWidth * 0.87,
    borderRadius: 100,
    textAlign: 'center',
    marginBottom:50
  },
  showsm : {
    width: deviceWidth * 0.8,
    resizeMode: 'contain'
  },
  buttonimg: {
    backgroundColor: '#00000030',
  },
  bluring: {
    position: 'absolute', left: 0, right: 0, top: 0, right: 0, width: deviceWidth, height: deviceHeight, 
  },
  imageLogo2: {
    position: "relative",
    width: 72,
    height: 72,
    alignSelf: "center",
    marginTop: 40
  },
  bottonStylet: {
    backgroundColor: '#FF6161',
    alignSelf: "center",
    marginTop:30,
    width: deviceWidth * 0.82,
    borderRadius: 100,
    textAlign: 'center',
    marginBottom: 30
  },
};
