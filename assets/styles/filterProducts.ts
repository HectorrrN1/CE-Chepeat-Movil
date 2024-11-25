import { StyleSheet, Dimensions } from 'react-native';

const { width: viewportWidth } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      marginBottom: 0,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    searchContainer: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 10,
      marginTop: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 25,
      height: 50,
      alignItems: 'center',
      paddingHorizontal: 15,
      backgroundColor: '#FFFFFF',
      width: '100%',
      marginBottom: 15,
    },
    input: {
      fontSize: 16,
      color: '#333',
      flex: 1,
    },
    searchIcon: {
      marginLeft: 8,
    },
    products: {
      marginTop: 20,
      flex: 1,
    },
    headerProduct: {
    
      fontSize: 20,
    },
    productCard: {
      backgroundColor: '#f7f7f7',
      borderRadius: 10,
      width: (viewportWidth / 2) - 25,
      padding: 10,
      margin: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    productImage: {
      width: '100%',
      height: 120,
      borderRadius: 10,
      marginBottom: 10,
    },
    productName: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 5,
    },
    productPrice: {
      fontSize: 14,
      color: '#df1c24',
      fontWeight: 'bold',
    },
    productStock: {
      fontSize: 12,
      color: '#999',
    },
    productButton: {
      fontSize: 12,
      color: '#df1c24',
      marginTop: 10,
      fontWeight: '600',
    },
    modalOverlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sidebarContainer: {
      flex: 1,
      backgroundColor: '#fff',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: 300,
      borderRightWidth: 1,
      borderRightColor: '#e0e0e0',
      shadowColor: '#000',
      shadowOffset: { width: -2, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 5,
    },
    noProductsText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
      },
      sliderLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff6e33',
        marginVertical: 10,
        textAlign: 'center',
      },
      slider: {
        width: '90%',
        height: 40,
        alignSelf: 'center',
        marginVertical: 20,
      },
  });