import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      marginBottom: 0,
      marginTop: 35,
    },
    keyboardAvoidingView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 10,
    },
    logo: {
      width: 250,
      height: 250,
    },
    title: {
      fontSize: 22,
      fontWeight: '600',
      color: '#333',
      marginTop: -10,
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
      marginBottom: 30,
      textAlign: 'center',
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
    Button: {
      width: '100%',
      marginBottom: 30,
      backgroundColor: '#df1c24',
      borderRadius: 25,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    forgotPassword: {
      color: '#df1c24',
      fontSize: 14,
      marginBottom: 10,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
      width: '100%',
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: '#ccc',
    },
    dividerText: {
      marginHorizontal: 10,
      color: '#999',
    },
    signupContainer: {
      alignItems: 'center',
      width: '100%',
    },
    signupText: {
      color: '#7e7e7e',
      fontSize: 14,
      marginBottom: 20,
      marginTop: 10,
    },
    text: {
      width: '97%',
      height: 25,
      fontSize: 16,
      fontWeight: 'bold',
    },
    errorText: {
      color: 'red',
      marginBottom: 10,
      fontSize: 12,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semi-transparente
    },
    modalContainer: {
      width: 300,
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 15,
    },
    modalButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    cancelButton: {
      backgroundColor: '#666',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginRight: 10,
      flex: 1,
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 18,
      color: '#fff',
      fontWeight: 'bold',
    },
  });
  
  export default styles;