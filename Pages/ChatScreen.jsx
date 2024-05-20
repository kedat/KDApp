import { View, Text, Image } from "react-native";
import React from "react";
import {
  Bubble,
  GiftedChat,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { FontAwesome } from "@expo/vector-icons";
import ChatFaceData from "../Services/ChatFaceData";
import AsyncStorage from "@react-native-async-storage/async-storage";

CHAT_BOT_FACE =
  "https://res.cloudinary.com/dknvsbuyy/image/upload/v1685678135/chat_1_c7eda483e3.png";
baseUrl = "https://aed0-2402-800-61f8-d7d8-2598-41df-7032-2c22.ngrok-free.app";
export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatFaceColor, setChatFaceColor] = useState();
  const [botId, setBotId] = useState("");

  useEffect(() => {
    checkFaceId();
  }, [botId]);

  const checkFaceId = async () => {
    const id = await AsyncStorage.getItem("chatFaceId");
    CHAT_BOT_FACE = id ? ChatFaceData[id]?.image : ChatFaceData[0].image;
    setChatFaceColor(ChatFaceData[id]?.primary);
    setBotId(ChatFaceData[id]?.bot_id);
    setMessages([
      {
        _id: 1,
        text: `Xin chào, tôi thuộc ${ChatFaceData[id]?.name} có thể giúp gì cho bạn?`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: CHAT_BOT_FACE,
        },
      },
    ]);
  };

  const onSend = useCallback(
    (messages = []) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
      if (messages[0].text) {
        getResponse(messages[0].text);
      }
    },
    [botId]
  );

  const getResponse = useCallback(
    async (msg) => {
      setLoading(true);
      try {
        setLoading(true);
        await fetch(`${baseUrl}/chat/chat_with_documents`, {
          method: "POST",
          mode: "cors",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bot_id: botId,
            question: msg,
          }),
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            const chatAIResp = {
              _id: Math.random() * (9999999 - 1),
              text: data.answer.output_text,
              createdAt: new Date(),
              user: {
                _id: 2,
                name: "React Native",
                avatar: CHAT_BOT_FACE,
              },
            };
            setMessages((previousMessages) =>
              GiftedChat.append(previousMessages, chatAIResp)
            );
            setLoading(false);
          });
      } catch (error) {
        console.log("🚀 ~ getResponse ~ error:", error);
        setLoading(false);
      }
    },
    [botId]
  );

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#671ddf",
          },
          left: {},
        }}
        textStyle={{
          right: {
            // fontSize:20,
            padding: 2,
          },
          left: {
            color: "#671ddf",
            // fontSize:20,
            padding: 2,
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props) => {
    //Add the extra styles via containerStyle
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          padding: 3,

          backgroundColor: "#671ddf",
          color: "#fff",
        }}
        textInputStyle={{ color: "#fff" }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={{ marginRight: 10, marginBottom: 5 }}>
          <FontAwesome
            name="send"
            size={24}
            color="white"
            resizeMode={"center"}
          />
        </View>
      </Send>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <GiftedChat
        messages={messages}
        isTyping={loading}
        multiline={true}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
      />
    </View>
  );
}
