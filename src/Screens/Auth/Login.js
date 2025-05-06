import React from 'react';
import {View, Text, Alert, KeyboardAvoidingView, Platform} from 'react-native';
import {Formik} from 'formik';
import {useDispatch} from 'react-redux';
import {login} from '../../redux/authSlice';
import {getAuth, signInWithEmailAndPassword} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

import {LoginSchema} from '../../Utils/validationSchema';
import CustomInput from '../../Component/CustomInput';
import CustomButton from '../../Component/CustomButton';
import {styles} from './Styles';
import Icon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import AzureAuth from 'react-native-azure-auth';

const Login = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const azureAuth = new AzureAuth({
    clientId: 'f15c96c9-cdd0-4cf2-af74-7478358a4a25', 
    redirectUri:
      Platform.OS === 'ios'
        ? 'com.chatapp://com.chatapp/ios/callback'
        : 'com.chatapp://com.chatapp/android/callback',
  });
  const handleMicrosoftLogin = async () => {
    try {
      // 1. Authenticate with Microsoft
      const tokens = await azureAuth.webAuth.authorize({
        scope: 'openid profile User.Read email',
      });

      // 2. Get user info
      const userInfo = await azureAuth.auth.msGraphRequest({
        token: tokens.accessToken,
        path: '/me',
      });

      // 3. Dispatch to Redux (adapt to your store)
      dispatch(
        login({
          uid: userInfo.id,
          email: userInfo.userPrincipalName || userInfo.mail,
          displayName: userInfo.displayName,
          emailVerified: true,
          authProvider: 'microsoft',
        }),
      );

      navigation.navigate('Chat');
    } catch (error) {
      Alert.alert('Microsoft Login Failed', error.message);
    }
  };
  const handleLogin = async values => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );

      dispatch(
        login({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          emailVerified: userCredential.user.emailVerified,
        }),
      );
      navigation.navigate('Chat');
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to continue</Text>
      </View>

      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.container}>
            <CustomInput
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={{type: 'feather', name: 'mail', color: '#0084ff'}}
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            <CustomInput
              placeholder="Password"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              leftIcon={{type: 'Fontisto', name: 'key', color: '#0084ff'}}
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <CustomButton title={'Login'} onPress={handleSubmit} />

            <CustomButton
              title={'SignUp'}
              onPress={() => navigation.navigate('SingUp')}
            />
            <CustomButton
              title="Sign in with Microsoft"
              onPress={handleMicrosoftLogin}
              icon={<Icon name="microsoft" size={20} color="#fff" />}
            />
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default Login;
