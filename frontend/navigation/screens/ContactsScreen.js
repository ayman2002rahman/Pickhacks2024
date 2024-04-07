import * as React from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert, Platform, Linking } from 'react-native';
import * as Contacts from 'expo-contacts';
//import firebase from '../../firebaseConfig'; // Adjust this import to your firebaseConfig file's actual path

function testSMS(to, message) {
    fetch('/send_sms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, message }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

export default function ContactsScreen({ navigation }) {
    const [contacts, setContacts] = React.useState([]);
    const [selectedContacts, setSelectedContacts] = React.useState(new Set());
    const [savedContacts, setSavedContacts] = React.useState(new Set());

    React.useEffect(() => {
        loadContacts();
        //loadSavedContacts();
        
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

    // const loadSavedContacts = async () => {
    //     const dbRef = firebase.database().ref('contacts');
    //     dbRef.on('value', (snapshot) => {
    //         const data = snapshot.val() || {};
    //         const savedNumbers = new Set(Object.keys(data));
    //         setSavedContacts(savedNumbers);
    //     });
    // };

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

    // const saveContactToDatabase = (contactId, phoneNumber) => {
    //     const dbRef = firebase.database().ref(`contacts/${phoneNumber}`);
    //     dbRef.set({ contactId, phoneNumber });
    // };

    const renderContact = ({ item }) => {
        const isSelected = selectedContacts.has(item.id);
        //const isSaved = savedContacts.has(item.phoneNumbers[0].number);

        return (
            <TouchableOpacity
                style={[styles.contactItem, isSelected && styles.selected, styles.saved]}
                onPress={() => handleSelectContact(item.id, item.phoneNumbers[0].number)}
            >
                <Text style={styles.contactName}>{item.name}</Text>
                {<Text style={styles.savedText}>Saved</Text>}
            </TouchableOpacity>
        );
    };

    return(
        <View style={{ flex: 1 }}>
            <FlatList
                data={contacts}
                keyExtractor={(item) => item.id}
                renderItem={renderContact}
            />
            <Button
                title="Send message"
                onPress={() => {
                    testSMS('+18777804236', "This text is from the app!");
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
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
