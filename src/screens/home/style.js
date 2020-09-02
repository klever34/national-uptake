const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;

export default {
  container: {
    backgroundColor:"#EAF3FF"
  },
  imageContainer: {
    flex: 1,
    width: null,
    height: null
  },
  logoContainer: {
    flex: 1,
    marginTop: deviceHeight / 8,
    marginBottom: 30
  },
  logo: {
    position: "absolute",
    left: Platform.OS === "android" ? 40 : 50,
    top: Platform.OS === "android" ? 35 : 60,
    width: 380,
    height: 200
  },
  loginButton: {
    backgroundColor: "white",
    alignSelf: "center",
    marginTop: deviceHeight * 0.2,
    position: 'relative',
  },
  imageLogo: {
    position: "relative",
    width: 400,
    height: 220,
    marginTop: deviceHeight * 0.2,
    alignSelf: "center"
  },
  text: {
    color: "#5B9DEE",
  },
  headerText2: {
    position: "relative",
    marginTop:20,
    alignSelf: "center",
    color: "#FF5A5A",
    textAlign: 'center',
    fontSize: 22,
  }
};
