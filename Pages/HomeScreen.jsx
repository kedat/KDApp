import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import ChatFaceData from "../Services/ChatFaceData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
export default function HomeScreen() {
  const [chatFaceData, setChatFaceData] = useState(ChatFaceData);
  const [selectedChatFace, setSelectedChatFace] = useState([]);
  const navgitaion = useNavigation();
  useEffect(() => {
    checkFaceId();
  }, []);

  const checkFaceId = async () => {
    const id = await AsyncStorage.getItem("chatFaceId");
    id
      ? setSelectedChatFace(ChatFaceData[id])
      : setSelectedChatFace(ChatFaceData[0]);
  };
  baseUrl =
    "https://43d7-2402-800-61f8-3861-6074-31a5-cd6d-e526.ngrok-free.app";

  const [loading, setLoading] = useState(false);
  const onChatFacePress = async (id) => {
    setSelectedChatFace(ChatFaceData[id - 1]);

    await AsyncStorage.setItem("chatFaceId", (id - 1).toString());
    setLoading(true);

    try {
      await fetch(`${baseUrl}/chat/choose_bot`, {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bot_id: ChatFaceData[id - 1].bot_id,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setLoading(false);

          console.log(data);
        });
    } catch (error) {
      console.log("🚀 ~ onChatFacePress ~ error:", error);
      setLoading(false);
    }
  };
  return (
    <View style={{ alignItems: "center", paddingTop: 90 }}>
      <Text style={[{ color: selectedChatFace?.primary }, { fontSize: 30 }]}>
        Chào mừng đến với
      </Text>
      <Text
        style={[
          { color: selectedChatFace?.primary },
          { fontSize: 30, fontWeight: "bold" },
        ]}
      >
        {selectedChatFace.name}
      </Text>
      <Image
        source={{ uri: selectedChatFace.image }}
        style={{ height: 150, width: 150, marginTop: 20 }}
      />
      {/* <Text style={{ marginTop: 30, fontSize: 25 }}>How Can I help you?</Text> */}

      <View
        style={{
          marginTop: 20,
          backgroundColor: "#F5F5F5",
          alignItems: "center",
          height: 110,
          padding: 10,
          borderRadius: 10,
        }}
      >
        <FlatList
          data={chatFaceData}
          horizontal={true}
          renderItem={({ item }) =>
            item.id != selectedChatFace.id && (
              <TouchableOpacity
                style={{ margin: 15 }}
                onPress={() => onChatFacePress(item.id)}
                disabled={loading}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 40, height: 40 }}
                />
              </TouchableOpacity>
            )
          }
        />
        <Text style={{ marginTop: 5, fontSize: 17, color: "#B0B0B0" }}>
          {loading
            ? "Đang chuẩn bị dữ liệu, vui lòng chờ"
            : "Chọn chat bot để bắt đầu"}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          { backgroundColor: selectedChatFace?.primary },
          {
            marginTop: 40,
            padding: 17,
            width: Dimensions.get("screen").width * 0.6,
            borderRadius: 100,
            alignItems: "center",
          },
        ]}
        onPress={() => navgitaion.navigate("chat")}
        disabled={loading}
      >
        <Text style={{ fontSize: 16, color: "#fff" }}>Bắt đầu</Text>
      </TouchableOpacity>
    </View>
  );
}
