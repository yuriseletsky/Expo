import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Button,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

export function Registration(): JSX.Element {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <TextInput
            style={styles.textField}
            placeholder="Full name"
            defaultValue=""
          />
          <TextInput
            style={styles.textField}
            placeholder="Email"
            keyboardType="email-address"
            defaultValue=""
          />
          <TextInput
            style={styles.textField}
            placeholder="Password"
            secureTextEntry={true}
            defaultValue=""
          />
          <TextInput
            style={styles.textField}
            placeholder="Confirm Password"
            secureTextEntry={true}
            defaultValue=""
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button color="#0055ff" title="Registration" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  textField: {
    margin: 5,
    padding: 5,
    borderWidth: 1,
    borderRadius: 10,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  customButton: {
    color: "#FFF",
    backgroundColor: "#fff",
  },
  footer: {
    marginBottom: 20,
    borderRadius: 10,
    margin: "auto",
    backgroundColor: "red",
    color: "black",
    textDecorationLine: "underline",
  },
  customButtonRegistration: {
    marginLeft: 30,
    backgroundColor: "red",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    padding: 10,
  },
});
