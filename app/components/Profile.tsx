import { storeToken, getToken, removeToken } from "./Storage/Token";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Icon, Button } from "@rneui/base";
import {
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
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { LoginModel, LoginResponse } from "./TypeModels";
import { Authorized } from "./Authorized";
import { useTranslation } from "react-i18next";
import LanguagesBar from "./LaguagesBar";
import CurrencyBar from "./CurrencyBar";

export type ProductDetailsStackParamList = {
  Registration: {} | undefined;
};
interface CustomProfileProps {
  callbackSetAutorize?: (status: boolean) => void;
  optionButtons: boolean;
}
export function Profile(props: CustomProfileProps): JSX.Element {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token != "") {
        await setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    })();
  }, [isFocused, isAuthenticated]);

  const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const Login = async () => {
    const data: LoginModel = {
      Email: email,
      Password: password,
      RememberMe: rememberMe,
    };
    try {
      const loginRequest = new Request(
        "https://ltop.shop/Account/LoginMobile",
        {
          method: "POST",
          mode: "cors",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      fetch(loginRequest)
        .then((response) => {
          //console.log("response", response);
          return response.json();
        })
        .then(async (data: LoginResponse) => {
          if (data.success) {
            console.log("data.success", data);
            await storeToken(data.token);
            setIsAuthenticated(true);
            if (props.callbackSetAutorize) {
              props.callbackSetAutorize(true);
            }
          }
        })
        .catch((reason) => {
          const message = "Incorrect email or password!";
          console.log(message, reason);
          showToast(t("login.popUp_msg").toString());
        });
    } catch (error) {
      console.log(error);
    }
  };
  const Logout = async () => {
    await removeToken();
    setIsAuthenticated(false);
    console.log("Logout");
  };
  if (isLoading) {
    return (
      <View style={styles.loader}>
        {isLoading && (
          <Text style={styles.textLoading}>
            {t("catalog.loading").toString()} <ActivityIndicator />
          </Text>
        )}
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <Authorized LogoutCallback={Logout} />
      ) : (
        <View>
          <ScrollView>
            <View
              style={styles.button}
              onTouchStart={() => {
                console.log("Logo");
              }}
            >
              <Image
                style={styles.logo}
                source={require("../content/images/logo.png")}
              />
            </View>
            <View>
              <TextInput
                style={styles.textField}
                placeholder="Email"
                onChangeText={setEmail}
                keyboardType="email-address"
                value={email}
                defaultValue="oleinikov@sunpoint.com.ua"
              />
              <TextInput
                style={styles.textField}
                placeholder={t("login.password").toString()}
                secureTextEntry={true}
                onChangeText={setPassword}
                value={password}
                defaultValue="cupIsMine23"
              />
            </View>
            {/* <Button
                            title={t('login.signIn_btn').toString()}
                            titleStyle={styles.text}
                            type='clear'
                            buttonStyle={styles.signInBtn}
                            onPress={async () => {
                                await Login();
                            }} /> */}
            <Button
              buttonStyle={{
                backgroundColor: "#308ad9",
                borderWidth: 2,
                borderColor: "white",
                borderRadius: 30,
                marginBottom: 10,
                padding: 10,
                width: "50%",
                alignSelf: "center",
              }}
              iconRight={true}
              icon={
                <Icon
                  name="arrow-right"
                  type="font-awesome"
                  color="white"
                  size={25}
                  iconStyle={{ marginLeft: 10 }}
                />
              }
              title={t("login.signIn_btn").toString()}
              onPress={async () => {
                await Login();
              }}
            />
          </ScrollView>
          {props.optionButtons != false && (
            <View style={styles.footer}>
              <LanguagesBar />
              <CurrencyBar />
            </View>
          )}
          {/* <View style={styles.footer}>
                        <Button 
                        color="#0055ff" 
                        title="Register" 
                        buttonStyle={styles.button}
                        onPress={() => {
                            navigation.navigate("Registration")
                        }} />
                    </View> */}
        </View>
      )}

      {/* <View>
            <Pressable style={styles.button} onPress={() => { setSignUp(false) }}>
                <Text style={styles.text}>Register</Text>
            </Pressable>
            </View> */}
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
    paddingVertical: 15,
    borderWidth: 1,
    borderRadius: 10,
  },
  tinyLogo: {
    width: 20,
    height: 20,
  },
  customButton: {
    color: "#FFF",
    backgroundColor: "#fff",
  },
  footer: {
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
  signInBtn: {
    //marginHorizontal: 5,
    //borderRadius: 3,
    paddingVertical: 20,
    marginHorizontal: 5,
    elevation: 1,
    borderColor: "black",
  },
  button: {
    paddingVertical: 20,
    //elevation: 1,
    //borderRadius: 5,
    borderColor: "black",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    padding: 10,
  },
  logo: {
    width: 160,
    height: 80,
    alignSelf: "center",
    //marginLeft: 30
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textLoading: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    padding: 10,
  },
});
