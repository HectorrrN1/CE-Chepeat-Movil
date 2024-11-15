import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'flex-start',
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    productImage: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      marginBottom: 20,
    },
    productName: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    productPrice: {
      fontSize: 20,
      color: '#df1c24',
      marginBottom: 20,
    },
    productDescription: {
      fontSize: 16,
      color: '#666',
      marginBottom: 20,
    },
    detailsContainer: {
      backgroundColor: '#ff6e33',
      padding: 10,
      borderRadius: 10,
      marginBottom: 20,
    },
    detailsText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#fff',
    },
    detailsValue: {
      fontSize: 14,
      color: '#fff',
      marginBottom: 10,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    checkboxText: {
      marginLeft: 10,
      fontSize: 14,
      color: '#666',
    },
    purchaseButton: {
      backgroundColor: '#df1c24',
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 18,
      color: '#fff',
      fontWeight: 'bold',
    },
    errorText: {
      fontSize: 16,
      color: 'red',
      textAlign: 'center',
      marginBottom: 20,
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
    modalPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#df1c24',
      marginBottom: 20,
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
    confirmButton: {
      backgroundColor: '#df1c24',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      flex: 1,
      alignItems: 'center',
    },
    sellerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#f1f1f1',
      borderRadius: 10,
      marginBottom: 20,
    },
    sellerIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    sellerName: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    sellerRating: {
      color: '#666',
      fontSize: 14,
    },
    mapButton: {
      backgroundColor: '#1c88df', // Color diferente para el botón del mapa
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 20,
    },
  });

  export default styles;