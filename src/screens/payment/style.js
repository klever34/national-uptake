const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  container: {
    backgroundColor: "#FFF",
  },
  imageContainer: {
    backgroundColor: "#FF5A5A",
  },
  image2: {
    height: deviceHeight * 0.6,
    bottom: 0,
    position: "absolute",
    width: "100%",
  },
  imageLogo: {
    position: "relative",
    width: 72,
    height: 72,
    alignSelf: "center",
  },
  loginButton: {
    backgroundColor: "#792579",
    alignSelf: "center",
    marginTop: deviceHeight * 0.8,
  },
  textInput: {
    color: "#273444",
    marginTop: 0,
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 20,
  },
  textInput2: {
    color: "#121212",
    marginTop: 10,
    alignSelf: "center",
    fontSize: 12,
    marginLeft: 20,
    marginRight: 20,
  },
  inputStyle: {
    alignSelf: "center",
    width: deviceWidth * 0.9,
    marginTop: 10,
    backgroundColor: "white",
    color: "white",
  },
  bottonStyle: {
    backgroundColor: "#FF6161",
    alignSelf: "center",
    marginTop: deviceHeight * 0.3,
    width: deviceWidth * 0.4,
    borderRadius: 100,
    textAlign: "center",
  },
  bottonStyle2: {
    backgroundColor: "#FF6161",
    alignSelf: "center",
    marginTop: 10,
    width: deviceWidth * 0.9,
    borderRadius: 100,
    textAlign: "center",
  },
  inputStyle2: {
    alignSelf: "center",
    width: deviceWidth * 0.3,
    marginTop: 10,
    backgroundColor: "white",
    color: "white",
  },
  bottonStyle4: {
    backgroundColor: "#9D9D9D20",
    alignSelf: "center",
    marginTop: 10,
    width: deviceWidth * 0.9,
    borderRadius: 100,
    textAlign: "center",
  },
  bottonStylet: {
    backgroundColor: "#FF6161",
    alignSelf: "center",
    marginTop: 30,
    width: deviceWidth * 0.82,
    borderRadius: 100,
    textAlign: "center",
    marginBottom: 30,
  },
  bluring: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    right: 0,
    width: deviceWidth,
    height: deviceHeight,
  },
  card: {
    elevation: 4,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginVertical: 10,
  },
};
