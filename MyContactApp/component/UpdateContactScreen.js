import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, Image, StyleSheet } from 'react-native';
import PlaceholderImage from '../assets/images/user.png';
import ImageViewer from './ImageViewer';
import { launchImageLibrary } from 'react-native-image-picker';
import { openDatabase } from 'react-native-sqlite-storage';
import ContactListScreen from './ContactListScreen';
import { useNavigation } from '@react-navigation/native';

const db = openDatabase({ name: 'UserDatabase.db' });


const UpdateContactScreen = ({ route }) => {
  const { contact } = route.params;
  const [photo, setPhoto] = useState(contact.image_url); // State to store photo URI
  const [name, setName] = useState(contact.user_name);
  const [mobileNumber, setMobileNum] = useState(contact.user_contact);
  const [landlineNumber, setlandlineNumber] = useState(contact.uuser_landline);
  const navigation=useNavigation();
  useEffect(() => {
    setName(contact.user_name);
    setMobileNum(contact.user_contact);
    setlandlineNumber(contact.uuser_landline);
    // console.warn(contact);
    // console.warn(mobileNumber);
    // console.warn(landlineNumber);
  }, [contact]);

  // Function to handle updating photo
  const handleUpdatePhoto = () => {
    console.log(contact);
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.assets[0].uri; // Get the URI from the response
        setPhoto(uri); // Update the photo URI in the component state
        updatePhotoInDatabase(uri); // Update the photo URI in the database
      }
    });
  };

  // Function to update photo in the database
  const updatePhotoInDatabase = (uri) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE table_userN SET image_url = ? WHERE user_id = ?',
        [uri, contact.user_id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Photo updated in the database:', uri);
          } else {
            console.log('Failed to update photo in the database');
          }
        },
        (error) => {
          console.log('Error updating photo in the database:', error);
        }
      );
    });
  };

  // Function to update contact details in the database
  const handleUpdateEntries = () => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE table_userN SET user_name = ?, user_contact = ?, uuser_landline = ? WHERE user_id = ?',
        [name, mobileNumber, landlineNumber, contact.user_id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Entries updated in the database');
            navigation.navigate('ContactList');
          } else {
            console.log('Failed to update entries in the database');
          }
        },
        (error) => {
          console.log('Error updating entries in the database:', error);
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Update Contact</Text>
      

      {/* Display the photo */}
      <TouchableOpacity style={styles.photoContainer} onPress={handleUpdatePhoto}>
        <ImageViewer
          placeholderImageSource={PlaceholderImage}
          selectedImage={photo}
          imageClasses={styles.photo}
        />
      </TouchableOpacity>

      {/* Button to update photo */}
      <TouchableOpacity onPress={handleUpdatePhoto} style={[ styles.button, styles.photoButton]}>
        <Text style={{color:'white'}}>Update Photo</Text>
      </TouchableOpacity>

      {/* Editable fields for contact details */}
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={text => setName(text)} // Update name state
        placeholder="Enter Name"
      />
   
      <TextInput
      
        style={styles.input}
        defaultValue={mobileNumber.toString()}
        onChangeText={text => setMobileNum(text)} // Update mobile state
        placeholder="Enter Mobile Number"
      />
      <TextInput
        style={styles.input}
        value={landlineNumber.toString()}
        onChangeText={text => setlandlineNumber(text)} // Update landline state
        placeholder="Enter Landline Number"
      />

      {/* Button to update entries */}
      <TouchableOpacity onPress={handleUpdateEntries} style={[ styles.button, styles.photoButton]}>
        <Text style={{color:'white'}}>Update Entries</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
},
photoButton: {
    backgroundColor: '#007AFF',
},
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  updatePhotoButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  updateEntriesButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default UpdateContactScreen;
