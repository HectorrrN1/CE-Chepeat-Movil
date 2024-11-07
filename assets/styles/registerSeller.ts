import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      marginTop: 35,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    imageTextContainer: {
      position: 'absolute',
      top: 10,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: 25,
      height: 25,
      marginRight: 5,
    },
    imageText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#999',
    },
    title: {
      fontSize: 34,
      fontWeight: '600',
      color: '#333',
      marginBottom: 50,
      marginTop: 100,
    },
    inputContainer: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 25,
      height: 50,
      justifyContent: 'center',
      paddingHorizontal: 15,
      backgroundColor: '#FFFFFF',
      width: '100%',
      marginBottom: 15,
    },
    input: {
      fontSize: 16,
      color: '#333',
    },
    inputStyle: {
      width: '100%',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      width: '100%',
    },
    checkboxLabel: {
      marginLeft: 8,
      fontSize: 14,
      color: '#333',
    },
    link: {
      color: '#df1c24',
      textDecorationLine: 'underline',
    },
    formButton: {
      width: '100%',
      marginBottom: 15,
      backgroundColor: '#df1c24',
      borderRadius: 25,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    formContainer: {
      alignItems: 'center',
      width: '100%',
    },
    formText: {
      color: '#333',
      fontSize: 14,
    },
    errorText: {
      color: 'red',
      marginBottom: 10,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      position: 'relative',
    },
    iconContainer: {
      position: 'absolute',
      right: 10,
      zIndex: 1,
      height: 40,
      paddingHorizontal: 10, // Espacio alrededor del icono
    },
    mapContainer: {
      width: '100%',
      height: 150,
      alignItems: 'center',
      marginBottom: 10,
      borderRadius: 20,
    },
    map: {
      width: '100%',
      height: '100%',
      borderRadius: 20,
    },
  });

  export default styles;