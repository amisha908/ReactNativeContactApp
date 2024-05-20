import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Button, StyleSheet } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PlaceholderImage from '../assets/images/user.png';
import FavoriteContactList from './FavoriteContactList';
import { SearchBar } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Swipeable } from 'react-native-gesture-handler';

var db = openDatabase({ name: 'UserDatabase.db' });

export default function ContactListScreen() {
  const [userList, setUserList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openedItem, setOpenedItem] = useState(null); // State to keep track of the opened Swipeable item
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const fetchUserList = useCallback(() => {
    db.transaction(txn => {
      txn.executeSql('SELECT * FROM table_userN ORDER BY user_name', [], (tx, res) => {
        let temp = [];
        for (let i = 0; i < res.rows.length; ++i) {
          temp.push(res.rows.item(i));
        }
        setUserList(temp);
      });
    });
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchUserList();
    }
  }, [isFocused, fetchUserList]);

  const handleUpdateContact = (contact) => {
    navigation.navigate('UpdateContact', { contact });
  };

  const handleDeleteContact = (contact) => {
    db.transaction(txn => {
      txn.executeSql('DELETE FROM table_userN WHERE user_id = ?', [contact.user_id], (tx, res) => {
        fetchUserList();
      });
    });
  };

  const renderContactItem = ({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
      onSwipeableOpen={() => {
        // Set the opened item when Swipeable is opened
        setOpenedItem(item);
      }}
      onSwipeableClose={() => {
        // Reset the opened item when Swipeable is closed
        setOpenedItem(null);
      }}
      overshootRight={false}
      friction={2}
    >
      <TouchableOpacity onPress={() => navigation.navigate('ViewContact', { contactId: item.user_id })} style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1 }}>
        <Image source={item.image_url ? { uri: item.image_url } : PlaceholderImage} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
        <Text style={{fontSize:15, color:'black'}}>{item.user_name}</Text>
      </TouchableOpacity>
    </Swipeable>
  );

  const renderRightActions = (progress, dragX, item) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 1],
    });
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => handleUpdateContact(item)} style={[styles.actionButton, styles.editButton]}>
          <FontAwesome name="edit" size={20} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteContact(item)} style={[styles.actionButton, styles.deleteButton]}>
          <FontAwesome name="trash" size={20} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
        <SearchBar
          placeholder="Search"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
          containerStyle={{ flex: 1, backgroundColor: 'transparent', borderBottomColor: 'transparent', borderTopColor: 'transparent' }}
          inputContainerStyle={{ backgroundColor: '#e0e0e0', borderRadius: 20 }}
          inputStyle={{ color: 'black' }}
        />
        <TouchableOpacity style={styles.favoriteIcon} onPress={() => navigation.navigate(FavoriteContactList)}>
          <FontAwesome name="heart" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={userList.filter(user => user.user_name.toLowerCase().includes(searchQuery.toLowerCase()))}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.user_id.toString()}
      />
      <TouchableOpacity style={[styles.button, styles.photoButton]} onPress={() => navigation.navigate('AddNewContact')}>
        <Text style={{ color: 'white' }}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  favoriteIcon: {
    padding: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#24A0ED',
  },
  photoButton: {
    backgroundColor: '#24A0ED',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
    paddingHorizontal: 15,
  },
  
});


// import React, { useEffect, useState, useCallback } from 'react';
// import { View, Text, TouchableOpacity, FlatList, Image, Button, StyleSheet } from 'react-native';
// import { openDatabase } from 'react-native-sqlite-storage';
// import { useNavigation, useIsFocused } from '@react-navigation/native';
// import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icon
// import PlaceholderImage from '../assets/images/user.png';
// import FavoriteContactList from './FavoriteContactList';
// import Icon2 from 'react-native-vector-icons/Entypo';
// import { SearchBar } from 'react-native-elements';
// import { SwipeListView } from 'react-native-swipe-list-view';
// import { Swipeable } from 'react-native-gesture-handler';

// var db = openDatabase({ name: 'UserDatabase.db' });

// export default function ContactListScreen() {
//   const [userList, setUserList] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigation = useNavigation();
//   const isFocused = useIsFocused();

//   const fetchUserList = useCallback(() => {
//     db.transaction(txn => {
//       txn.executeSql('SELECT * FROM table_userN ORDER BY user_name', [], (tx, res) => {
//         let temp = [];
//         for (let i = 0; i < res.rows.length; ++i) {
//           temp.push(res.rows.item(i));
//         }
//         setUserList(temp);
//       });
//     });
//   }, []);

//   useEffect(() => {
//     if (isFocused) {
//       fetchUserList();
//     }
//   }, [isFocused, fetchUserList]);

//   const handleUpdateContact = (contact) => {
//     navigation.navigate('UpdateContact', { contact });
//   };

//   const handleDeleteContact = (contact) => {
//     db.transaction(txn => {
//       txn.executeSql('DELETE FROM table_userN WHERE user_id = ?', [contact.user_id], (tx, res) => {
//         fetchUserList();
//       });
//     });
//   };

//   const renderContactItem = ({ item }) => (
//     <TouchableOpacity onPress={() => navigation.navigate('ViewContact', { contactId: item.user_id })} style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1 }}>
//       <Image source={item.image_url ? { uri: item.image_url } : PlaceholderImage} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
//       <Text style={{fontSize:15, color:'black'}}>{item.user_name}</Text>
//       <TouchableOpacity onPress={() => handleUpdateContact(item)} style={{ marginLeft: 'auto', marginRight: 10 }}>
//         <FontAwesome name="edit" size={20} color="blue" />
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => handleDeleteContact(item)} style={{ marginRight: 10 }}>
//         <FontAwesome name="trash" size={20} color="red" />
//       </TouchableOpacity>
//     </TouchableOpacity>
//   );

//   return (
    
//     <View style={{ flex: 1 }}>
//       <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
//         <SearchBar
//           placeholder="Search"
//           onChangeText={(text) => setSearchQuery(text)}
//           value={searchQuery}
//           containerStyle={{ flex: 1, backgroundColor: 'transparent', borderBottomColor: 'transparent', borderTopColor: 'transparent' }}
//           inputContainerStyle={{ backgroundColor: '#e0e0e0', borderRadius: 20 }}
//           inputStyle={{ color: 'black' }}
//         />
//         <TouchableOpacity style={styles.favoriteIcon} onPress={() => navigation.navigate(FavoriteContactList)}>
//           <FontAwesome name="heart" size={24} color="red" />
//         </TouchableOpacity>
//       </View>
      

//       <FlatList
//         data={userList.filter(user => user.user_name.toLowerCase().includes(searchQuery.toLowerCase()))}
//         renderItem={renderContactItem}
//         keyExtractor={(item) => item.user_id.toString()}
//       />
     

//       <TouchableOpacity style={[styles.button, styles.photoButton]} onPress={() => navigation.navigate('AddNewContact')}>
//         <Text style={{ color: 'white' }}>Add</Text>
//       </TouchableOpacity>
//     </View>
   
//   );
// }

// const styles = StyleSheet.create({
//   favoriteIcon: {
//     padding: 10,
//   },
//   button: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 100,
//     marginBottom: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#24A0ED',
//   },
//   photoButton: {
//     backgroundColor: '#24A0ED',
//   },
// });

