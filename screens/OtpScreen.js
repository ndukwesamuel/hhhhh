import AppScreen from "../components/shared/AppScreen";
import React, { useState, useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import OtpForm from "../ ./OtpForm";
import Toast from "react-native-toast-message";
import axios from "axios";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  checkOtp,
  reser_otp,
  reset_otpemail,
  setOtpEmail,
} from "../Redux/OnboardingSlice";
import { reset_login } from "../Redux/AuthSlice";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

const OtpScreen = ({ navigation, onSetAuth }) => {
  const { otpemail, otp: otpdata } = useSelector(
    (state) => state?.OnboardingSlice
  );
  const dispatch = useDispatch();
  console.log({
    otpdata,
  });
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const length = 4;

  const handleChange = (index, value) => {
    const newCode = code.split("");
    newCode[index] = value;
    setCode(newCode.join(""));
    if (index === length - 1) {
      inputRefs.current[index]?.blur();
    } else if (value !== "") {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const Resend_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}api/auth/send-otp`;

      let datas = {
        email: otpemail,
        otp: code,
      };
      console.log({
        datas,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //   "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, datas, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: `${success?.data?.message} `,
        });
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

  const Verify_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}api/auth/verify-otp`;

      let datas = {
        email: otpemail,
        otp: code,
      };
      console.log({
        datas,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //   "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, datas, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: `${success?.data?.message} `,
        });

        dispatch(checkOtp(false));
        dispatch(reset_otpemail());
        dispatch(reset_login());
        onSetAuth("sign-in");
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
    <AppScreen>
      <TouchableOpacity
        style={{
          position: "relative",
          top: 10,
          left: 30,
          borderWidth: 1,
          padding: 5,
          borderRadius: 10,
          width: 35,
        }}
        onPress={() => {
          console.log("this is otpemail", otpemail);
          dispatch(checkOtp(false));
          onSetAuth("sign-in");
          dispatch(reset_login());
        }}
      >
        <Ionicons name="arrow-back-sharp" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={{ gap: 30 }}>
          <Text style={styles.heading}>Account Verification</Text>

          {/* phone numbers */}
          <View style={{ gap: 10 }}>
            <Text
              style={{
                color: "#06094F",
                fontSize: 16,
                lineHeight: 23,
                fontWeight: 400,
              }}
            >
              Enter the 4- digit code sent to{" "}
              <Text style={{ fontWeight: "500" }}>Email</Text>
            </Text>

            {/* <Text
            style={{
              color: "#06094F",
              textDecorationLine: "underline",
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            Edit Phone Number
          </Text> */}
          </View>

          {/* otp form */}
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {[...Array(length)].map((_, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={{
                    borderWidth: 1,
                    borderColor: "black",
                    width: 60,
                    height: 60,
                    textAlign: "center",
                    margin: 10,
                    borderRadius: 10,
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                  onChangeText={(value) => handleChange(index, value)}
                  value={code[index] || ""}
                  editable={!loading}
                />
              ))}
            </View>

            {code.length === length && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#001272",
                    width: "40%",
                    borderRadius: 10,
                  }}
                  onPress={() => Verify_Mutation.mutate()}
                >
                  {Verify_Mutation?.isLoading ? (
                    <ActivityIndicator size="large" color="blue" />
                  ) : (
                    <Text
                      style={{
                        textAlign: "center",
                        color: "white",
                        padding: 10,
                      }}
                    >
                      Submit
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* resend */}
          <Pressable
            onPress={() =>
              Resend_Mutation.mutate({
                email: otpemail,
              })
            }
          >
            <Text style={styles.resend}>
              Didn’t receive a code?{" "}
              <Text style={{ fontWeight: "500" }}>Resend</Text>
              {Resend_Mutation.isLoading && (
                <ActivityIndicator color="blue" size="small" />
              )}
            </Text>
          </Pressable>
        </View>
      </View>
    </AppScreen>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
  },

  heading: {
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 36,
  },

  resend: {
    fontSize: 16,
    color: "#06094F",
    fontWeight: "400",
    lineHeight: 23,
  },
});
