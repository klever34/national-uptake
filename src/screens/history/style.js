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
    position: "relative",
    marginTop: deviceHeight * 0.2,
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
    backgroundColor: '#EF3C3C',
    alignSelf: "center",
    marginTop:deviceHeight * 0.3,
    width: deviceWidth * 0.4,
    borderRadius: 100,
    textAlign: 'center'
  },
  bottonStyle2: {
    backgroundColor: '#5B9DEE',
    alignSelf: "center",
    marginTop:30,
    width: deviceWidth * 0.9,
    borderRadius: 100,
    textAlign: 'center'
  },
  barStyle: {
    backgroundColor: '##5B9DEE',
    width: deviceWidth * 0.15,
    borderRadius: 100,
    alignSelf: 'flex-end'
  },
  robStyle: {
    backgroundColor: '##5B9DEE',
    width: deviceWidth * 0.15,
    borderRadius: 100,
    alignSelf: 'flex-end'
  },
  centerText: {
    // color: "black",
    marginTop: 10,
    fontSize: 20,
    textAlign: 'center',
    alignSelf: "center",
    textAlignVertical: "center"
  },
  imageMain: {
    width: 266,
     height: 186
  },
  textMain: {
  fontSize: 12,
  color: 'black',
  marginTop: 10
  },
  textMain2: {
  backgroundColor: 'white',
  fontSize: 12,
  marginTop: 10,
  marginRight: 10
  },
  textMain3: {
    fontSize: 12,
    },
  bottonEnter: {
    backgroundColor: '#EF3C3C',
    width: deviceWidth * 0.4,
    borderRadius: 100,
    
  },
  bottonEnter2: {
    backgroundColor: '#EF3C3C',
    width: deviceWidth * 0.2,
    borderRadius: 100,
    alignItems: 'flex-start'
    
  },
  textMain2: {
    fontSize: 12,
    color: 'black',
    },
  selectStyle: {
    marginTop:10,
    marginRight: 20
  },
  selectIconStyle: {
    color: '#5B9DEE',
    marginLeft: 20,
    marginRight: 10
  }
};
