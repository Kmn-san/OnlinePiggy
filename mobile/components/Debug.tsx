import { useAuth } from "@clerk/clerk-expo";
import { View, Button, Alert } from "react-native";

export default function TokenDebugButton() {
  const { getToken, userId } = useAuth();

  const handleGetToken = async () => {
    try {
      const token = await getToken();
      console.log("========================================");
      console.log("🔑 CLERK BEARER TOKEN FOR POSTMAN:");
      console.log(token);
      console.log("========================================");
      
      if (!token) {
        Alert.alert("No Token", "User is not fully logged in or token is null.");
      } else {
        Alert.alert("Success!", "Check your Metro terminal console for your Bearer token.");
      }
    } catch (error) {
      console.error("Error getting token:", error);
    }
  };

  return (
    <View style={{ margin: 20, padding: 10 }}>
      <Button title="Print Clerk Token to Console" onPress={handleGetToken} />
    </View>
  );
}