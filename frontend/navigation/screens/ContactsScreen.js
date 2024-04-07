import * as React from 'react'
import { View, Text, Button, Alert, Platform, Linking} from 'react-native';

function testSMS(to, message) {
    fetch('/send_sms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({to, message}),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

export default function ContactsScreen({navigation}) {
    return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => navigation.navigate('ContactsScreen')}
                style={{ fontSize: 26, fontWeight: 'bold' }}Contacts Screen></Text>
            <Button
                title="Send message"
                onPress={() => {
                    testSMS('+18777804236', "This text is from the app!");
                }}
            />
        </View>
        
    );
}