import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flexGrow: 1, 
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: '#000',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#000',
    textAlign: 'left', 
    width: '100%', 
    fontWeight: 'bold'
  },   
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
    color: '#29243F',
    textAlign: 'left', 
    width: '100%', 
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
});

export default globalStyles;
