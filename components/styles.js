import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // First set of styles for CHAT COMPONENT
  container1: {
    flex: 1,
    backgroundColor: '#AFE1AF', // main theme color
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#AFE1AF', 
  },
  modalContent: {
    width: '80%',
    height: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input1: { 
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#EAFAF1',
  },
  clickableMessage: {
    textDecorationLine: 'underline',
  },

  container2: {
    flex: 1,
    backgroundColor: '#AFE1AF', 
    padding: 10,
  },

  container3: {
    flex: 1,
    backgroundColor: '#AFE1AF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10, 
    padding: 10,
    marginBottom: 10,
    width: '80%',
    backgroundColor: '#EAFAF1',
  },
  contactItem: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    backgroundColor: '#AFE1AF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10, 
    marginBottom: 10,
  },  
  button: {
    backgroundColor: '#27AE60',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 40, 
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#AFE1AF",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 10, 
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "#fff", 
    fontWeight: "bold",
    textAlign: "center",
  },
  blockedUserItem: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unblockButton: {
    color: 'red',
    textDecorationLine: 'underline',
  },

  // Fourth set of styles
  container4: {
    flex: 1,
    backgroundColor: '#AFE1AF', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  input2: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10, 
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#EAFAF1',
  },

  // LOGIN AND REGISTER
  container5: {
    flex: 1,
    backgroundColor: '#AFE1AF', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  input3: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10, 
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#EAFAF1',
  },
  whiteText: {
    color: 'white',
  },

  otherUserMessageText: {
   // color: 'white',
  },
  currentUserMessageText:{

  },
  currentUserMessage: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    backgroundColor: '#3498DB',
    alignSelf: 'flex-start',
  },
  otherUserMessage: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    backgroundColor: '#D1F2EB',
    alignSelf: 'flex-end', 
  },
  messageContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    backgroundColor:'#3498DB',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName:{
    color:'#fff',
    padding:20,

  },
  
});

export default styles;
