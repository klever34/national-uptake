const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  container: {
    backgroundColor:"#EAF3FF"
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
    marginTop: deviceHeight * 0.15,
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
    color: "black",
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: 'center',
    alignSelf: "center",
    textAlignVertical: "center"
  },
  imageMain: {
    width: 343,
     height: 200,
     alignSelf: "center",
     borderRadius: 35,
     borderWidth: 0,
     borderColor: 'white',
     overflow: "hidden",
  },
  textMain: {
    fontSize: 14,
    color: '#273444',
  marginTop: 10,
  marginLeft: 15,
  },
  textMain2: {
  backgroundColor: 'white',
  fontSize: 12,
  marginTop: 10,
  marginRight: 10
  },
  textMain3: {
    fontSize: 10,
    
    },
textMain4: {
      fontSize: 24,
      textAlign: 'center',
      alignSelf: 'center',
      textAlignVertical: "center" 

      },
  bottonEnter: {
    backgroundColor: '#FF6161',
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
    fontSize: 14,
    color: '#273444',
    marginRight: 20,
    marginTop: 10,
    marginLeft: 10
    },
    buttonimg: {
      backgroundColor: '#00000030',
      alignSelf: 'center',
      textAlign: 'center',
      width:263
    },
    imageLogox: {
      position: "relative",
      alignSelf: "center"
    },
    imageLogoxx: {
      position: "relative",
      alignSelf: "center",
      width: 56,
      height: 56
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
