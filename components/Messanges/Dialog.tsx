import { useIsFocused, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, ActivityIndicator } from "react-native";
import MessageService, {
  OpenedDialogResponse,
} from "../../services/MessageService";
import { Text } from "@rneui/base";
import { TextInput } from "react-native";
import { Icon, Button } from "@rneui/base";
import { Avatar } from "@rneui/themed";
import { t } from "i18next";

export type DialogProps = {
  dialogId: string;
};
export function Dialog(): JSX.Element {
  const [dialog, setDialog] = useState<OpenedDialogResponse>({
    dialog: {
      companionUser: {
        userGuid: "",
        userName: "",
        userEmail: "",
        userSkype: "",
        userInstagram: "",
        userFacebook: "",
      },
      messagesList: [],
    },
  });
  const [newMessage, setNewMessage] = useState<string>("");
  const [sended, setSended] = useState<boolean>(false);
  const dialogProps: DialogProps = useRoute().params as DialogProps;
  const dialogId = dialogProps.dialogId;
  const loadDialog = async () => {
    const curDialog = await MessageService.getDialog(dialogId);
    await setDialog(curDialog);
  };
  useEffect(() => {
    loadDialog();
  }, [sended]);

  return (
    <View style={styles.dialogContainer}>
      <View style={styles.topBar}>
        <View style={styles.authorContainer}>
          {dialog?.dialog.companionUser.userPhoto != null ? (
            <Avatar
            overlayContainerStyle={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignSelf: "center",
            }}
            containerStyle={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginRight: 10,
              alignSelf: "center",
            }}
            source={{
              uri: `https://res.cloudinary.com/ltopcloud/image/upload/ar_1:1,c_pad,dn_50,w_1500/${dialog?.dialog.companionUser.userPhoto.photoStr}.jpg`,
            }}
          />
          ) : (
            <Icon
              name="user"
              type="font-awesome"
              containerStyle={styles.autorIconContainer}
            />
          )}
          <Text style={[styles.authorName, { verticalAlign: "middle" }]}>
            {dialog?.dialog.companionUser.userName}
          </Text>
        </View>
        <View style={styles.socialLinks}>
          <Button
            type="clear"
            icon={{
              name: "facebook",
              type: "font-awesome",
            }}
            containerStyle={styles.iconContainer}
          />
          <Button
            icon={{
              name: "instagram",
              type: "font-awesome",
            }}
            type="clear"
            containerStyle={styles.iconContainer}
          />
          <Button
            icon={{
              name: "skype",
              type: "font-awesome",
            }}
            type="clear"
            containerStyle={styles.iconContainer}
          />
        </View>
      </View>
      <ScrollView>
        {dialog?.dialog.messagesList.map((message, i) => {
          let date = new Date(Date.parse(message.dateCreate));
          let hours = date.getHours().toString();
          let minutes =
            date.getMinutes() < 10
              ? `0${date.getMinutes()}`
              : date.getMinutes().toString();
          let prevDate =
            i > 0
              ? new Date(
                  Date.parse(dialog?.dialog.messagesList[i - 1].dateCreate)
                )
              : date;
          return (
            <View
              key={i}
              style={[
                styles.messageContainer,
                { alignSelf: message.isMainUser ? "flex-end" : "flex-start" },
              ]}
            >
              {date.getDate() - prevDate.getDate() > 0 || i == 0 ? (
                <Text style={{ textAlign: "right", padding: 5 }}>
                  {date.toLocaleDateString()}
                </Text>
              ) : (
                <></>
              )}
              <View
                style={{
                  flexDirection: message.isMainUser ? "row" : "row-reverse",
                }}
              >
                <Text>{`${hours}:${minutes}`}</Text>
                <Text
                  style={[
                    styles.messageText,
                    {
                      backgroundColor: message.isMainUser
                        ? "#E5E4E2"
                        : "#0096FF",
                    },
                  ]}
                >
                  {message.messageText}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.bottombar}>
        <TextInput
          style={styles.textField}
          placeholder={"Write your message..."}
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Button
          style={styles.sendButton}
          buttonStyle={styles.sendButton}
          type="outline"
          icon={{
            name: "paper-plane",
            type: "font-awesome",
          }}
          onPress={async () => {
            await MessageService.postNewMessage(
              newMessage,
              dialog?.dialog.companionUser.userGuid
            );
            setNewMessage("");
            setSended(!sended);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dialogContainer: {
    flex: 1,
    flexDirection: "column",
    paddingBottom: 5,
    height: 200,
  },
  topBar: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingVertical: 5,
  },
  bottombar: {
    display: "flex",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "black",
  },
  textField: {
    margin: 5,
    padding: 5,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    width: "80%",
  },
  sendButton: {
    margin: 5,
    paddingVertical: 10,
    padding: 5,
  },
  authorContainer: {
    display: "flex",
    flexDirection: "row",
    flex: 3,
  },
  authorName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  socialLinks: {
    display: "flex",
    flexDirection: "row",
    flex: 2,
  },
  autorIconContainer: {
    paddingRight: 35,
    left: 20,
    paddingTop: 8,
  },
  iconContainer: {
    borderRadius: 15,
  },
  messageContainer: {
    padding: 5,
    display: "flex",
    flexDirection: "column",
  },
  messageText: {
    fontSize: 18,
    padding: 5,
    borderRadius: 8,
    maxWidth: 300,
  },
  button: {
    borderColor: "#ffffff00",
  },
});
