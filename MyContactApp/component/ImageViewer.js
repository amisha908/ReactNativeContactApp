import { Image, StyleSheet } from "react-native";

export default function ImageViewer({ placeholderImageSource, selectedImage, imageClasses }) {
    const imageSource = selectedImage  ? { uri: selectedImage } : placeholderImageSource;
 
    return <Image source={imageSource} style={imageClasses}/>;
  }
 