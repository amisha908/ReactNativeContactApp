import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import PlaceholderImage from '../assets/images/user.png'; // Import PlaceholderImage

const db = openDatabase({ name: 'UserDatabase.db' });

const ViewContact = ({ route }) => {
  const [contactDetails, setContactDetails] = useState(null);

  useEffect(() => {
    const { contactId } = route.params;
    fetchContactDetails(contactId);
  }, []);

  const fetchContactDetails = (contactId) => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM table_userN WHERE user_id = ?',
        [contactId],
        (tx, res) => {
          console.log("Rows fetched:", res.rows.length);
          if (res.rows.length > 0) {
            const contact = res.rows.item(0);
            console.log("Fetched contact:", contact);
            setContactDetails(contact);
          } else {
            console.log("Contact not found");
          }
        },
        (error) => {
          console.log("Error fetching contact:", error);
        }
      );
    });
  };

  console.log("Contact details:", contactDetails);

  return (
    <View style={styles.container}>
      {contactDetails ? (
        <>
          <Text style={styles.title}>Contact Details</Text>
          <View style={styles.contactContainer}>
            <Image source={contactDetails.image_url ? { uri: contactDetails.image_url } : PlaceholderImage} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.text}>{contactDetails.user_name}</Text>

              <Text style={styles.label}>Mobile Number:</Text>
              <Text style={styles.text}>{contactDetails.user_contact}</Text>

              <Text style={styles.label}>Landline Number:</Text>
              <Text style={styles.text}>{contactDetails.uuser_landline}</Text>

              {/* Add more contact details as needed */}
            </View>
          </View>
        </>
      ) : (
        <Text>Loading contact details...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    color:'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'black',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    color:'black',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  details: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color:'black',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color:'black',
  },
});

export default ViewContact;
