import React from 'react';
import {
    Image,
    View,
} from 'react-native';
import { ImagePickerAsset } from 'expo-image-picker';


export function renderImages(images: ImagePickerAsset[]) {
    return images.map((item) => {
        return (
            <View key={item.assetId} style={{ alignSelf: "center" }}>
                < Image
                    resizeMode='contain'
                    style={{ height: 300 }}
                    source={Image.resolveAssetSource(item)}
                />
            </View>
        );
    });
}

export function validatePhone(phone: string) {
    const availableNumbers = [
        { code: "0", regex: /^\d{10}$/ },
        { code: "+380", regex: /^\+380\d{9}$/ },
        { code: "+1", regex: /^\+1\d{10}$/ },
    ];

    const matchedNumber = availableNumbers.find(number => phone.startsWith(number.code));

    if (matchedNumber) {
        return matchedNumber.regex.test(phone);
    }

    return false;
}
