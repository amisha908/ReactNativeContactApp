import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import PlaceholderImage from '../assets/images/user.png';
import ImageViewer from './ImageViewer';

const db = openDatabase({ name: 'UserDatabase.db' });

export default function AddNewContact() {
  const navigation = useNavigation(); 

  useEffect(() => {
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_userN'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_userN', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_userN(' +
                'user_id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                'user_name VARCHAR(20), ' +
                'user_contact INT(10), ' +
                'uuser_landline INT(10), ' +
                'image_url VARCHAR(255), ' +
                'is_favorite BOOLEAN)',
              []
            );
          } else {
            console.log("Table already created");
          }
        }
      );
    });
  }, []);

  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [landlineNumber, setLandlineNumber] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [photo, setPhoto] = useState(null);

  const handleSaveContact = () => {
    db.transaction(txn => {
      txn.executeSql(
        'INSERT INTO table_userN( user_name , user_contact , uuser_landline, image_url, is_favorite ) VALUES (?,?,?,?,?)',
        [name, mobileNumber, landlineNumber, photo, isFavorite ? 1 : 0],
        (tex, res) => {
          console.log(res);
        },
      );
    });
    console.log('Contact details saved:', { name, mobileNumber, landlineNumber, isFavorite, photo });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handlePickImage = async () => {
    let options = {
      storageOptions: {
        path: "image"
      }
    };
    launchImageLibrary(options, Response => {
      console.log(Response);
      setPhoto(Response.assets[0].uri);
    });
  };

  const takephoto = () => {
    const options = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
    };

    launchCamera(options, response => {
        if (response.didCancel) {
            console.log('User cancelled camera');
        } else if (response.error) {
            console.log('Camera Error: ', response.error);
        } else {
            let imageUri = response.uri || response.assets?.[0]?.uri;
            setPhoto(imageUri);
            console.log(imageUri);
        }
    });
}

  return (
    <View style={{ padding: 20 }}>
      {/* <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Add New Contact</Text> */}

      <TouchableOpacity style={{ marginBottom: 10 }}>
        <TouchableOpacity title='Take photo' style={[ styles.button, styles.photoButton]} onPress={takephoto}>
        <Text style={{color:'white'}}>
        Take photo
        </Text>
        </TouchableOpacity>
        <TouchableOpacity title='Browse Photo' style={[ styles.button, styles.photoButton]}  onPress={handlePickImage}>
        <Text style={{color:'white'}}>
          Browse Photo
        </Text>
        </TouchableOpacity>

        <ImageViewer
          placeholderImageSource={PlaceholderImage}
          selectedImage={photo}
          imageClasses={styles.image}
        />
      </TouchableOpacity>

      <TextInput
        placeholder="Name of person"
        value={name}
        onChangeText={text => setName(text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Mobile phone number"
        value={mobileNumber}
        onChangeText={text => setMobileNumber(text)}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Landline number"
        value={landlineNumber}
        onChangeText={text => setLandlineNumber(text)}
        keyboardType="numeric"
        style={styles.input}
      />

<TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
  <Text style={styles.favoriteButtonText}>Favorite</Text>
  <Text style={[styles.favoriteButtonText, isFavorite ? styles.marked : styles.unmarked]}>
    {isFavorite ? 'Marked' : 'Unmarked'}
  </Text>
</TouchableOpacity>

      <TouchableOpacity title="Save" style={[ styles.button, styles.photoButton]} onPress={handleSaveContact} >
        <Text style={{color:'white'}}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity title='Contact List' style={[ styles.button, styles.photoButton]} onPress={() => navigation.goBack()} >
        <Text style={{color:'white'}}>Contact List</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 8
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10

  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
},
photoButton: {
    backgroundColor: '#24A0ED',
    color:'white',
    
    
},
  image: {
    width: 100,
    height: 100,
    marginBottom: 5,
    marginTop:5,
    alignItems:'center',
    alignContent:'center'
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  favoriteButtonText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  marked: {
    color: 'green',
  },
  unmarked: {
    color: 'red',
  },
});

