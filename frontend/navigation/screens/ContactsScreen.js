import * as React from 'react'
import { View, Text, Button, Alert} from 'react-native';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import * as Contacts from 'expo-contacts';
import firebase from './firebaseConfig'; // Adjust the import path as necessary

export default function ContactsScreen({navigation}) {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [savedContacts, setSavedContacts] = useState(new Set());

  useEffect(() => {
    loadContacts();
    loadSavedContacts();
  }, []);

  const loadContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });
      setContacts(data);
    }
  };

  const loadSavedContacts = async () => {
    const dbRef = firebase.database().ref('contacts');
    dbRef.on('value', (snapshot) => {
      const data = snapshot.val() || {};
      const savedNumbers = new Set(Object.keys(data));
      setSavedContacts(savedNumbers);
    });
  };

  const handleSelectContact = (contactId, phoneNumber) => {
    const updatedSelection = new Set(selectedContacts);
    if (updatedSelection.has(contactId)) {
      updatedSelection.delete(contactId);
    } else {
      updatedSelection.add(contactId);
      saveContactToDatabase(contactId, phoneNumber);
    }
    setSelectedContacts(updatedSelection);
  };

  const saveContactToDatabase = (contactId, phoneNumber) => {
    const dbRef = firebase.database().ref(`contacts/${phoneNumber}`);
    dbRef.set({ contactId, phoneNumber });
  };

  const renderContact = ({ item }) => {
    const isSelected = selectedContacts.has(item.id);
    const isSaved = savedContacts.has(item.phoneNumbers[0].number);

    return (
      <TouchableOpacity
        style={[styles.contactItem, isSelected && styles.selected, isSaved && styles.saved]}
        onPress={() => handleSelectContact(item.id, item.phoneNumbers[0].number)}
      >
        <Text style={styles.contactName}>{item.name}</Text>
        <Text>{item.phoneNumbers[0].number}</Text>
        {isSaved && <Text style={styles.savedText}>Saved</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
      />

        <Text
            onPress={() => navigation.navigate('ContactsScreen')}
            style={{ fontSize: 26, fontWeight: 'bold' }}Contacts Screen></Text>
        <Button
            title="Send message"
            onPress={() => Alert.alert('do whatever')}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contactItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  selected: {
    backgroundColor: '#ddf4ff',
  },
  saved: {
    backgroundColor: '#e0ffe0',
  },
  savedText: {
    color: 'green',
    fontWeight: 'bold',
  },
  contactName: {
    fontSize: 16,
  },
});