import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { useFocusEffect } from '@react-navigation/native';
import PlaceholderImage from '../assets/images/user.png';

const db = openDatabase({ name: 'UserDatabase.db' });

export default function FavoriteContactList() {
  const [favoriteContacts, setFavoriteContacts] = useState([]);

  const fetchFavoriteContacts = useCallback(() => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM table_userN WHERE is_favorite = 1 ORDER BY user_name',
        [],
        (tx, res) => {
          let temp = [];
          for (let i = 0; i < res.rows.length; ++i) {
            temp.push(res.rows.item(i));
          }
          setFavoriteContacts(temp);
        }
      );
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchFavoriteContacts();
    }, [fetchFavoriteContacts])
  );

  const renderFavoriteContactItem = ({ item }) => (
    <View style={styles.contactItem}>
       <Image source={item.image_url ? { uri: item.image_url } : PlaceholderImage} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
      <Text style={styles.contactName}>{item.user_name}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Favorite Contact List</Text>

      <FlatList
        data={favoriteContacts}
        keyExtractor={(item) => item.user_id.toString()}
        renderItem={renderFavoriteContactItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  contactName: {
    fontSize: 16,
  },
});



// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList } from 'react-native';
// import { openDatabase } from 'react-native-sqlite-storage';

// const db = openDatabase({ name: 'UserDatabase.db' });

// export default function FavoriteContactList() {
//   const [favoriteContacts, setFavoriteContacts] = useState([]);

//   useEffect(() => {
//     db.transaction(txn => {
//       txn.executeSql(
//         'SELECT * FROM table_userN WHERE is_favorite = 1 ORDER BY user_name', // Fetch favorite contacts from the database
//         [],
//         (tx, res) => {
//           let temp = [];
//           for (let i = 0; i < res.rows.length; ++i) {
//             temp.push(res.rows.item(i));
//           }
//           setFavoriteContacts(temp);
//           console.warn(item.name)
//         }
//       );
//     });
//   }, []);

//   const renderFavoriteContactItem = ({ item }) => (
//     <View style={{ padding: 10, borderBottomWidth: 1 }}>
//       <Text>{item.user_name}</Text>
//     </View>
//   );

//   return (
//     <View style={{ flex: 1 }}>
//       <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>Favorite Contact List</Text>

//       <FlatList
//         data={favoriteContacts}
//         keyExtractor={(item) => item.user_id.toString()}
//         renderItem={renderFavoriteContactItem}
//       />
//     </View>
//   );
// }

