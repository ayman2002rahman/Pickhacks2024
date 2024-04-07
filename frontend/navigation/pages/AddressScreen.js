import * as React from 'react'
import { View, Text } from 'react-native';

export default function AddressScreen({navigation}) {
    return(
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => navigation.navigate('AddressScreen')}
                style={{ fontSize: 26, fontWeight: 'bold' }}Address Screen></Text>
        </View>
    );
}