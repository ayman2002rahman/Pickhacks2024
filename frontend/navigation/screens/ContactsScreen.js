import * as React from 'react'
import { View, Text, Button, Alert} from 'react-native';

export default function ContactsScreen({navigation}) {
    return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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