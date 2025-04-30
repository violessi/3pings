import { Text, View , StyleSheet } from "react-native";
import { Link } from 'expo-router';
import { Image } from 'expo-image';

import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import globalStyles from '@/assets/styles';

// This is main page so home screen -> about

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.imageContainer}>
        {/* <ImageViewer imgSource={PlaceholderImage} /> */}
        <Button theme="primary" label="Avail a Bike" />
        <Button theme="primary" label="Return a Bike" />
      </View>
      <View style={globalStyles.footerContainer}>
        
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Text
  text: {
    color: '#fff',
  },

});
