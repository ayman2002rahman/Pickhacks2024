import * as React from 'react'
import { View, Text } from 'react-native';

export default function ContactsScreen({navigation}) {
    return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => navigation.navigate('ContactsScreen')}
                style={{ fontSize: 26, fontWeight: 'bold' }}Contacts Screen></Text>
        </View>
    );
}