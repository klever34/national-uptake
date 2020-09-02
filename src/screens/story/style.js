const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  imageContainer: {
    flex: 1,
    width: deviceWidth,
    height: 447,
  },
  image2: {
    height: deviceHeight * 0.70,
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  imageLogo: {
    width: 68,
    height: 56,
    marginLeft:10
  },
  loginButton: {
    backgroundColor: "#792579",
    alignSelf: "center",
    marginTop: deviceHeight * 0.8
  },
  textInput: {
    color: "#273444",
    marginTop: 10,
    fontSize: 18,
    fontWeight: "100",
    marginLeft: 10,
    marginBottom: 10
  },
  textInput2: {
    color: "#121212",
    marginTop: 10,
    marginLeft: 10,
    marginRight: 20,
    fontSize: 16,
    fontWeight: "bold",
   
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
    backgroundColor: '#FF6161',
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
  },
  selectStyle: {
    marginTop:5,
    backgroundColor: '#5B9DEE10',
    borderRadius: 20, borderWidth: 1, borderColor: '#5B9DEE10'
  },
  selectStyle2: {
    marginTop:-10,
    backgroundColor: '#5B9DEE10',
    borderRadius: 20, borderWidth: 1, borderColor: '#5B9DEE10', marginRight: 10, marginLeft: 8,
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
    marginBottom:10
  },
  bottonStyle4: {
    backgroundColor: '#9D9D9D',
    alignSelf: "center",
    marginTop:30,
    width: deviceWidth * 0.87,
    borderRadius: 100,
    textAlign: 'center',
    marginBottom:10
  },
  imageLogo2: {
    width: 68,
    height: 56,
    marginRight:10
  },
  selectStyle3: {
    marginTop:5,
    backgroundColor: '#F4403510',
    borderRadius: 20, borderWidth: 1, borderColor: '#5B9DEE10',
    marginBottom:50
  },
  imageLogo3: {
    position: "relative",
    width: 165,
    height: 201,
    alignSelf: "center"
  },
  buttonimg: {
    backgroundColor: '#00000030',
  },
  textMain4: {
    fontSize: 24,
    textAlign: 'center',
    alignSelf: 'center',
    textAlignVertical: "center" 

    },
    buttonimg2: {
      backgroundColor: '#00000030',
      alignSelf: 'center',
      textAlign: 'center',
      width:263,
      marginBottom: 487/2
    },
    textInput2x: {
      color: "#121212",
      marginTop: 10,
      marginLeft: 10,
      marginRight: 20,
      fontSize: 16,
      fontWeight: "bold",
     
    },

    imageMain: {
      width: 266,
       height: 198,
       borderRadius: 35,
       borderWidth: 0,
       borderColor: 'white',
       overflow: "hidden",
    },
    buttonimg2: {
      backgroundColor: '#00000030',
      marginRight: 20,
    },
    textMain3: {
      fontSize: 12,
      },
      textMain: {
        fontSize: 14,
        color: '#273444',
        marginTop: 10
        },
        textMain2: {
          fontSize: 12,
          color: '#273444',
          marginTop: 10,
          marginRight: 10,
          },
          bottonEnter: {
            backgroundColor: '#FF6161',
            borderRadius: 100,
            
          },
};
