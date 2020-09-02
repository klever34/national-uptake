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
    backgroundColor: 'white',
   
  },
  image2: {
    height: deviceHeight * 0.6,
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  imageLogo: {
    width: 68,
    height: 56,
  },
  loginButton: {
    backgroundColor: "#792579",
    alignSelf: "center",
    marginTop: deviceHeight * 0.8
  },
  textInput: {
    color: "black",
    alignSelf: "flex-start",
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
    backgroundColor: '#EF3C3C',
    alignSelf: "center",
    marginTop:deviceHeight * 0.3,
    width: deviceWidth * 0.4,
    borderRadius: 100,
    textAlign: 'center'
  },
  fixedFooter: {
    
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
    marginBottom: 30
  },
  bottonStyle2: {
    alignSelf: "center",
    borderRadius: 5,
    textAlign: 'center'
  },
  selectStyle: {
    marginTop:10,
    backgroundColor: '#5B9DEE10',
    borderRadius: 30, borderWidth: 1, borderColor: '#5B9DEE10',  marginRight: 20,
  },
  selectIconStyle: {
    color: '#5B9DEE',
    marginLeft: 20,
    marginRight: 20,
    
  },
  selectStylex: {
    marginTop:10,
    backgroundColor: '#5B9DEE10',
    borderRadius: 30, borderWidth: 1, borderColor: '#5B9DEE01',  marginRight: 20,
    
  },
  selectIconStyle2: {
    color: '#FF6161',
    marginLeft: 20,
    marginRight: 20,
    marginTop:10,
    fontSize: 20
    
  },
  selectIconStyle3: {
    color: '#5B9DEE50',
    marginLeft: 20,
    marginRight: 20,
    marginTop:10,
    fontSize: 20
    
  },
  bottoz: {
    backgroundColor: '#FF6161',
    borderRadius: 100,
    textAlign: 'center',
    marginLeft: 30,
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
  bluring: {
    position: 'absolute', left: 0, right: 0, top: 0, right: 0, width: deviceWidth, height: deviceHeight, 
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Poppins-Regular",
  },
  checkedButtonLabel: {
    color: "#2ba2d3",
  },
  uncheckedButtonLabel: {
    color: "#c4c4c4",
  },
  uncheckedButtonContainer: {
    // backgroundColor: "#fff",
  },
  checkedButtonContainer: {
    // backgroundColor: "#000",
  },
  radioButton: {
    // flexDirection: 'row',
    margin: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  radioButtonHolder: {
    borderRadius: 50,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioIcon: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "ProximaNovaReg",
  },
};
