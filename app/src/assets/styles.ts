import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  wrapper: {
    flex: 1, // Ensure the wrapper takes up the full screen
    backgroundColor: '#ffffff',
  },
  container: {
    flexGrow: 1, // Allow content to stretch and fill the available space
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start', // Align content to the top
    alignItems: 'center', // Center horizontally
    padding: 20,
  },
  text: {
    color: '#000',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#000',
    textAlign: 'left', // This aligns the text to the left
    width: '100%', // Ensure it stretches across the container
    fontWeight: 'bold'
  },   
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
    color: '#29243F',
    textAlign: 'left', // This aligns the text to the left
    width: '100%', // Ensure it stretches across the container
    fontWeight: 'bold'
  },
  detail: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#555',
    marginBottom: 5,
    marginTop: 5,
  },
  note: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#757575',
    marginTop: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  column: {
    width: '49%',
    marginBottom: 5,
  },
    
      // Images
      imageContainer: {
        flex: 1,
      },
      image: {
        width: 320,
        height: 440,
        borderRadius: 18,
      },
    
      // Footer OF PAGE with a button?
      footerContainer: {
        flex: 1 / 3,
        alignItems: 'center',
        
      },
});

export default globalStyles;
