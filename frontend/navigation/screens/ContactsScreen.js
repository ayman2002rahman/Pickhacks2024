import * as React from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Linking,
} from "react-native";
import * as Contacts from "expo-contacts";
import { realtimeDb } from "../../firebaseConfig"; // Adjust this import to your firebaseConfig file's actual path
import { ref, set, onValue } from "firebase/database";
import * as Location from "expo-location";

function testSMS(to, message) {
  fetch("http://10.106.93.50:5001/send_sms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ to, message }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text(); // Use text() here as the response might not be JSON
    })
    .then((text) => {
      try {
        const data = JSON.parse(text); // Safely attempt to parse the text as JSON
        console.log(data);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
    })
    .catch((error) => console.error("Error:", error));
}

export default function ContactsScreen({ navigation }) {
  const [contacts, setContacts] = React.useState([]);
  const [selectedContacts, setSelectedContacts] = React.useState(new Set());
  const [savedContacts, setSavedContacts] = React.useState(new Set());

  React.useEffect(() => {
    loadContacts();
    loadSavedContacts();
  }, []);

  const loadContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });
      setContacts(data);
    }
  };

  const loadSavedContacts = async () => {
    const dbRef = ref(realtimeDb, "contacts");
    onValue(dbRef, (snapshot) => {
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
    }
    setSelectedContacts(updatedSelection);
  };

  const saveSelectedContactsToDatabase = () => {
    selectedContacts.forEach((contactId) => {
      const contact = contacts.find((c) => c.id === contactId);
      if (contact && contact.phoneNumbers && contact.phoneNumbers.length > 0) {
        const phoneNumber = contact.phoneNumbers[0].number;
        const dbRef = ref(realtimeDb, `contacts/${phoneNumber}`);
        set(dbRef, { contactId, phoneNumber });
      }
    });
    // Optionally clear selection after saving
    setSelectedContacts(new Set());
  };

  const sendMessageToSavedContacts = async () => {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const { latitude, longitude } = location.coords;
    const message = `This is an automated message from OnTrack:

Alert: Dheeraj just screamed. Please check up on them.
  
Last known location: (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
    savedContacts.forEach((phoneNumber) => {
      console.log("Sending message to", phoneNumber);
      testSMS(phoneNumber, message);
    });
  };

  const renderContact = ({ item }) => {
    const isSelected = selectedContacts.has(item.id);
    const isSaved =
      item.phoneNumbers &&
      item.phoneNumbers.length > 0 &&
      savedContacts.has(item.phoneNumbers[0].number);

    return (
      <TouchableOpacity
        style={[
          styles.contactItem,
          isSaved
            ? styles.saved
            : isSelected
            ? styles.selected
            : styles.unsaved,
        ]}
        onPress={() =>
          handleSelectContact(
            item.id,
            item.phoneNumbers ? item.phoneNumbers[0].number : ""
          )
        }
      >
        <Text style={styles.contactName}>{item.name}</Text>
        {isSaved && <Text style={styles.savedText}>Saved</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Button
        title="Save Selected Contacts"
        onPress={saveSelectedContactsToDatabase}
      />
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
      />
      <Button
        title="Send Message to Saved Contacts"
        onPress={sendMessageToSavedContacts}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contactItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  selected: {
    backgroundColor: "#ddf4ff", // Light blue for selected but not yet saved
  },
  saved: {
    backgroundColor: "#e0ffe0", // Green for saved contacts
  },
  unsaved: {
    backgroundColor: "#cccccc", // Grey for not selected
  },
  savedText: {
    color: "green",
    fontWeight: "bold",
  },
  contactName: {
    fontSize: 16,
  },
});
