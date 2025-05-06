import React from 'react';
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Formik} from 'formik';
import {useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {
  createUserWithEmailAndPassword,
  getAuth,
} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import CustomInput from '../../Component/CustomInput';
import CustomButton from '../../Component/CustomButton';
import {SignUpSchema} from '../../Utils/validationSchema';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleSignUp = async values => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );

      await firestore().collection('users').doc(userCredential.user.uid).set({
        uid: userCredential.user.uid,
        email: values.email,
        username: values.username,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      navigation.navigate('Chat');
    } catch (error) {
      Alert.alert('Sign Up Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: '#fff'}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started!</Text>
        </View>

        <Formik
          initialValues={{username: '', email: '', password: ''}}
          validationSchema={SignUpSchema}
          onSubmit={handleSignUp}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formContainer}>
              {/* Username */}
              <CustomInput
                placeholder="Username"
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
                autoCapitalize="none"
                leftIcon={{type: 'feather', name: 'user', color: '#0084ff'}}

              />
              {touched.username && errors.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}

              {/* Email */}
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
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              {/* Password */}
              <CustomInput
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                leftIcon={{type: 'Fontisto', name: 'key'}}
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              {/* Submit Button */}
              <CustomButton title="Sign Up" onPress={handleSubmit} />
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  scrollViewContent: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0084ff',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  formContainer: {
    gap: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 10,
    marginTop: -10,
    marginBottom: 5,
  },
});
