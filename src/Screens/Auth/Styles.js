import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
    },
    error: {
      color: 'red',
      marginBottom: 10,
    },
    title:{
        alignContent:'center',
        justifyContent:'center',
        alignItems:'center',
        marginTop:20,
        height:100
    },
    titletext:{
        fontSize:25,
        fontWeight:'bold',
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#0084ff',
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
      marginTop: 4,
    },
  });