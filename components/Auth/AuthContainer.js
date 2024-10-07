import { Text, View } from "react-native";
import { useState } from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import OtpScreen from "../../screens/OtpScreen";
import { useDispatch, useSelector } from "react-redux";

const AuthContainer = () => {
  const [authType, setAuthtype] = useState("sign-up");

  const { otp } = useSelector((state) => state?.OnboardingSlice);

  const changeAuthType = (type) => {
    setAuthtype(type);
  };

  return (
    <View style={{ flex: 1 }}>
      {otp === false ? (
        <>
          {authType === "sign-up" ? (
            <SignUp onSetAuth={changeAuthType} />
          ) : (
            <SignIn onSetAuth={changeAuthType} />
          )}
        </>
      ) : (
        <OtpScreen onSetAuth={changeAuthType} />
      )}
    </View>
  );
};

export default AuthContainer;
