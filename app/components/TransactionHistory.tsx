import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { getToken } from "./Storage/Token";
import UserServices from "./../services/UserService";
import { ProductType, Transaction } from "./TypeModels";
import { Picker } from "@react-native-picker/picker";
import { styles } from "./styles";
import { t } from "i18next";
import { Product } from "./Product";
import { Button, Icon, Overlay } from "@rneui/themed";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system";
import axios from "axios";
import * as MediaLibrary from "expo-media-library";
import * as Linking from "expo-linking";
import { shareAsync } from "expo-sharing";
interface TransactionElementProps {
  transaction: Transaction;
  lang: string;
  handler(transaction: Transaction): void;
}

function formatDateToCustomString(
  inputDate: Date,
  lang: string,
  withoutHours: boolean = false
): string {
  let options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZone: "Asia/Almaty",
  };
  if (withoutHours) {
    options = {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour12: false,
    };
  }

  return inputDate.toLocaleDateString(lang, options);
}

export function TransactionElement(
  props: TransactionElementProps
): JSX.Element {
  return (
    <View
      style={{
        margin: 5,
        marginBottom: 10,
        backgroundColor: "#cecece",
        padding: 5,
      }}
    >
      <View style={{ flexDirection: "row", borderBottomWidth: 1, height: 45 }}>
        <Text style={myStyles.prorsName}>
          {t("profile.transaction").toString()}
        </Text>
        <Text style={myStyles.propsValue}>
          {props.transaction.transactionId}
        </Text>
      </View>
      <View style={{ flexDirection: "row", borderBottomWidth: 1, height: 45 }}>
        <Text style={myStyles.prorsName}>
          {t("profile.date_transaction").toString()}
        </Text>
        <Text style={[myStyles.propsValue, { textAlign: "center" }]}>
          {formatDateToCustomString(
            new Date(props.transaction.dateCreated),
            props.lang,
            true
          )}
        </Text>
      </View>
      <View style={{ flexDirection: "row", borderBottomWidth: 1, height: 45 }}>
        <Text style={myStyles.prorsName}>{t("profile.status").toString()}</Text>
        <Text
          style={[
            myStyles.propsValueDetailsStatus,
            { color: props.transaction.color },
          ]}
        >
          {props.transaction.requestStatus}
        </Text>
      </View>
      <View style={{ flexDirection: "row", borderBottomWidth: 1, height: 45 }}>
        <Text style={myStyles.prorsName}>{t("profile.total").toString()}</Text>
        <Text style={myStyles.propsValueDetailsTotal}>
          {props.transaction.total} {props.transaction.valuteSymbol}
        </Text>
      </View>
      <Button
        buttonStyle={{
          backgroundColor: "#308ad9",
          borderWidth: 2,
          borderColor: "white",
          borderRadius: 30,
          marginTop: 10,
          marginBottom: 5,
          padding: 10,
          width: "80%",
          alignSelf: "center",
        }}
        iconRight={true}
        icon={
          <Icon
            name="download"
            type="font-awesome"
            color="white"
            size={25}
            iconStyle={{ marginLeft: 10 }}
          />
        }
        title={t("profile.view_details").toString()}
        onPress={() => {
          console.log("Todo");
          props.handler(props.transaction);
        }}
      />
    </View>
  );
}

export function TransactionHistory(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const [transaction, setTransaction] = useState<Transaction[]>([]);
  const [lang, setLang] = useState<string>("en");
  const [selectTransaction, setSelectTransaction] = useState<Transaction>({
    id: 0,
    transactionId: "",
    userName: "",
    comments: "",
    payDetailId: null,
    dateCreated: "",
    dateUpdated: "",
    total: 0,
    unit: 0,
    valuteSymbol: "",
    requestStatus: "",
    color: "black",
  });
  const [visible, setVisible] = useState(false);

  const setOverlayTransaction = (transaction: Transaction) => {
    setSelectTransaction(transaction);
    setVisible(!visible);
  };
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    (async () => {
      let transaction: Transaction[] = await UserServices.GetMyTransactions();
      let value = await AsyncStorage.getItem("@language_settings");
      value = value ? (value == "ua" ? "uk" : value) : "en";
      await setLang(value);
      transaction = transaction.map((item) => {
        let newItem = item;
        newItem.color = "#d78700";
        switch (item.requestStatus) {
          case "Waiting for payment":
            newItem.requestStatus = t("transaction.status_waiting").toString();
            newItem.color = "#d78700";
            break;
          case "Delivered":
            newItem.requestStatus = t(
              "transaction.status_delivered"
            ).toString();
            newItem.color = "#288759";
            break;
          case "Cancelled":
            newItem.requestStatus = t(
              "transaction.status_cancelled"
            ).toString();
            newItem.color = "#c74540";
            break;
        }

        return newItem;
      });
      setTransaction(transaction);
      setIsLoading(false);
    })();
  }, [isFocused]);

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
    <View>
      <View style={{}}>
        <FlatList
          data={transaction}
          renderItem={({ item }) => (
            <TransactionElement
              key={item.id}
              transaction={item}
              handler={setOverlayTransaction}
              lang={lang}
            />
          )}
          onEndReachedThreshold={0.2}
        />
      </View>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <View style={{ width: "90%" }}>
          <View style={myStyles.prorsDetailsContainer}>
            <Text style={myStyles.prorsNameDetails}>
              {t("profile.transaction").toString()}
            </Text>
            <Text style={myStyles.propsValueDetals}>
              {selectTransaction.transactionId}
            </Text>
          </View>
          <View style={myStyles.prorsDetailsContainer}>
            <Text style={myStyles.prorsNameDetails}>
              {t("profile.user").toString()}
            </Text>
            <Text style={myStyles.propsValueDetals}>
              {selectTransaction.userName}
            </Text>
          </View>
          <View style={myStyles.prorsDetailsContainer}>
            <Text style={myStyles.prorsNameDetails}>
              {t("profile.total").toString()}
            </Text>
            <Text style={myStyles.propsValueDetailsTotal}>
              {selectTransaction.total} {selectTransaction.valuteSymbol}
            </Text>
          </View>
          <View style={myStyles.prorsDetailsContainer}>
            <Text style={myStyles.prorsNameDetails}>
              {t("profile.date_transaction").toString()}
            </Text>
            <Text style={myStyles.propsValueDetals}>
              {formatDateToCustomString(
                new Date(selectTransaction.dateCreated),
                lang
              )}
            </Text>
          </View>
          <View style={myStyles.prorsDetailsContainer}>
            <Text style={myStyles.prorsNameDetails}>
              {t("profile.date_update").toString()}
            </Text>
            <Text style={myStyles.propsValueDetals}>
              {formatDateToCustomString(
                new Date(selectTransaction.dateUpdated),
                lang
              )}
            </Text>
          </View>
          <View style={myStyles.prorsDetailsContainer}>
            <Text style={myStyles.prorsNameDetails}>
              {t("profile.status").toString()}
            </Text>
            <Text
              style={[
                myStyles.propsValueDetailsStatus,
                { color: selectTransaction.color },
              ]}
            >
              {selectTransaction.requestStatus}
            </Text>
          </View>
          <View>
            <Button
              buttonStyle={{
                backgroundColor: "#308ad9",
                borderWidth: 2,
                borderColor: "white",
                borderRadius: 30,
                marginTop: 10,
                marginBottom: 5,
                padding: 10,
                width: "80%",
                alignSelf: "center",
              }}
              iconRight={true}
              icon={
                <Icon
                  name="mail-forward"
                  type="font-awesome"
                  color="white"
                  size={25}
                  iconStyle={{ marginLeft: 10 }}
                />
              }
              title={t("profile.send_details_to_email").toString()}
              onPress={async () => {
                let response = await UserServices.SendDetailsTransactionToEmail(
                  selectTransaction.transactionId
                );
                if (response == true) {
                  Alert.alert(
                    t("transaction.alert").toString(),
                    t("profile.send_details_to_email_done").toString()
                  );
                }
              }}
            />
            {isLoadingPdf && (
              <Text style={[styles.textLoading, { alignSelf: "center" }]}>
                {t("catalog.loading").toString()} <ActivityIndicator />
              </Text>
            )}
            <Button
              buttonStyle={{
                backgroundColor: "#308ad9",
                borderWidth: 2,
                borderColor: "white",
                borderRadius: 30,
                marginTop: 10,
                marginBottom: 5,
                padding: 10,
                width: "80%",
                alignSelf: "center",
              }}
              iconRight={true}
              icon={
                <Icon
                  name="download"
                  type="font-awesome"
                  color="white"
                  size={25}
                  iconStyle={{ marginLeft: 10 }}
                />
              }
              title={t("profile.download_details").toString()}
              onPress={async () => {
                const pdfUrl = `https://ltop.shop/MyOffice/GetPDFTemplate?transactionGuid=${selectTransaction.transactionId}`;
                setIsLoadingPdf(true);
                const token: string = await getToken();
                const downloadFromAPI = async () => {
                  const filename = `${selectTransaction.transactionId}.pdf`;
                  const result = await FileSystem.downloadAsync(
                    pdfUrl,
                    FileSystem.documentDirectory + filename,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  save(
                    result.uri,
                    selectTransaction.transactionId + ".pdf",
                    "application/pdf"
                  );
                };
                downloadFromAPI();

                const save = async (uri: any, filename: any, mimetype: any) => {
                  if (Platform.OS === "android") {
                    const permissions =
                      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
                    if (permissions.granted) {
                      const base64 = await FileSystem.readAsStringAsync(uri, {
                        encoding: FileSystem.EncodingType.Base64,
                      });
                      await FileSystem.StorageAccessFramework.createFileAsync(
                        permissions.directoryUri,
                        filename,
                        mimetype
                      )
                        .then(async (uri) => {
                          await FileSystem.writeAsStringAsync(uri, base64, {
                            encoding: FileSystem.EncodingType.Base64,
                          });
                          setIsLoadingPdf(false);
                          Alert.alert(
                            t("transaction.alert").toString(),
                            t("transaction.downloaded").toString()
                          );
                        })
                        .catch((e) => console.log(e));
                    } else {
                      setIsLoadingPdf(false);
                      shareAsync(uri);
                    }
                  } else {
                    setIsLoadingPdf(false);
                    shareAsync(uri);
                  }
                };
              }}
            />
          </View>
        </View>
      </Overlay>
    </View>
  );
}

const myStyles = StyleSheet.create({
  prorsName: {
    width: "38%",
    fontSize: 18,
    alignSelf: "center",
  },
  propsValue: {
    width: "62%",
    alignSelf: "center",
  },
  prorsDetailsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    height: 45,
  },
  prorsNameDetails: {
    width: "42%",
    fontSize: 18,
    alignSelf: "center",
  },
  propsValueDetals: {
    width: "58%",
    alignSelf: "center",
    textAlign: "center",
  },
  propsValueDetailsStatus: {
    width: "58%",
    alignSelf: "center",
    fontSize: 18,
    textAlign: "center",
  },
  propsValueDetailsTotal: {
    color: "#191",
    width: "58%",
    alignSelf: "center",
    fontSize: 18,
    textAlign: "center",
  },
});
