import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Login_Fun, reset_login } from "../../Redux/AuthSlice";
import Toast from "react-native-toast-message";
import axios from "axios";
import { useMutation } from "react-query";
import { checkOtp, setOtpEmail } from "../../Redux/OnboardingSlice";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

const SignIn = ({ onSetAuth }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { otpemail } = useSelector((state) => state?.OnboardingSlice);

  console.log({
    s: otpemail,
  });

  const { user_isLoading, user_data, user_message } = useSelector(
    (state) => state?.Auth
  );

  const handleLogin = () => {
    // Dispatch the login action with username and password
    dispatch(setOtpEmail(email));
    dispatch(Login_Fun({ email, password }));
  };

  useEffect(() => {
    if (user_message === "Email not verified!") {
      // navigation.navigate("OtpScreen");
      dispatch(checkOtp(true));
    }

    // dispatch(reset_login());

    return () => {};
  }, [user_message]);

  const Resend_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}api/auth/send-otp`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //   "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, data_info, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: `${success?.data?.message} `,
        });
        dispatch(checkOtp(true));

        // onPress={() => onSetAuth("sign-in")}
      },

      onError: (error) => {
        console.log({
          error: error,
        });
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message} `,
          //   text2: ` ${error?.response?.data?.errorMsg} `,
        });
      },
    }
  );

  return (
    <View style={styles.container}>
      {/* inputs container*/}
      <View style={styles.inputGroup}>
        {/* heading texts */}
        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: 24, lineHeight: 36, fontWeight: "900" }}>
            Log In
          </Text>
        </View>

        {/* username */}
        <View style={styles.inputContainer}>
          <Text style={styles.labels}>Email</Text>
          <TextInput
            style={styles.inputs}
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Enter your email"
          />
        </View>

        {/* password */}
        <View style={styles.inputContainer}>
          <Text style={styles.labels}>Password</Text>
          <TextInput
            style={styles.inputs}
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
        </View>
      </View>

      {Resend_Mutation?.isLoading && (
        <ActivityIndicator size="large" color="blue" />
      )}

      {user_message === "Email not verified!" && (
        <TouchableOpacity
          onPress={() =>
            Resend_Mutation.mutate({
              email: otpemail,
            })
          }
        >
          <Text
            style={{
              fontSize: 16,
              color: "#06094F",
              fontWeight: "400",
              lineHeight: 23,
            }}
          >
            Click To verify your email {otpemail}
          </Text>
          {/* <Text style={{ fontWeight: "500" }}>{otpemail}</Text> */}
        </TouchableOpacity>
      )}

      {/* action buttons */}
      <View
        style={{
          justifyContent: "flex-end",
          alignContent: "flex-center",
          flex: 3,
          paddingVertical: 30,
          gap: 10,
        }}
      >
        <Pressable
          onPress={handleLogin} // Call handleLogin function on button press
          style={{
            padding: 10,
            borderRadius: 5,
            backgroundColor: "#001272",
          }}
        >
          {user_isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "700",
                lineHeight: 24.05,
              }}
            >
              Log In
            </Text>
          )}
        </Pressable>
        <View style={{ justifyContent: "center" }}>
          <Pressable>
            <Text style={{ fontSize: 14, lineHeight: 22.4 }}>
              You do not have an account?{" "}
              <Text
                onPress={() => onSetAuth("sign-up")}
                style={{ fontSize: 16, fontWeight: "500", lineHeight: 25.6 }}
              >
                Sign Up
              </Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
    gap: 20,
    justifyContent: "space-between",
  },

  inputGroup: {
    gap: 10,
  },

  inputContainer: {
    gap: 5,
  },

  labels: {
    fontSize: 14,
    fontWeight: "500",
  },

  inputs: {
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 7,
  },
});
