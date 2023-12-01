import { BackgroundImage } from '@rneui/base';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
export const styles = StyleSheet.create({
    productItem: {
        flex: 1,
        flexDirection: "row",
        marginBottom: 3,
        marginTop: 3,
        borderWidth: 1,
        borderColor: "#cfcfcf"
    },
    productImage: {
        flex: 3,
        height: 200,
        overflow:'hidden'
    },
    image: {
        flex: 1,
        minHeight: 200,
        minWidth: 200
    },
    productInfo: {
        flex: 3,
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 5,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // recently
    header: {
        marginTop: 25,
        fontSize: 20,
        textAlign: 'center'
    },
    // recently

    // Catalog
    container: {
        flex: 1,
        flexDirection: "column",
        paddingLeft: 5,
        paddingRight: 5,
    },
    productList: {
        marginBottom: 140
    },
    categoryRow: {
        flexDirection: "row",
        paddingLeft: 5,
        paddingRight: 5,
        height: 50,
        marginTop: 20,
    },
    containerRow: {
        flexDirection: "row",
        paddingLeft: 5,
        paddingRight: 5,
        height: 50,
    },
    dropdown: {
        flex: 1
    },
    backdropStyle: {
        flex: 1,
        marginBottom: 60,
        height: "100%",
        backgroundColor: '#bdb5b559'
    },
    overlayCustom: {
        flex: 1,
        height: "100%",
        width: "80%",
        position: 'absolute',
        right: 0
    },

    dropdownItem: {
        fontSize: 25,
    },
    filterButton: {
        flex: 1,
        padding: 5,
        color: '#fff',
    },
    filterButtonText: {
        fontSize: 18,
        flex: 1
    },
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textLoading: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        padding: 10
    },
    // end catalog
    // add declaration
    inputLeftIcon: {
        width: 40,
    }
    // end declaration
});