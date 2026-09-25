import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import {
  Avatar,
  BackHeader,
  BrandMark,
  FormField,
  OutlineButton,
  Page,
  PrimaryButton,
  navigate,
  replaceRoute,
} from '@/components/ui';
import { useAppState } from '@/context/AppState';
import { ARTWORKS } from '@/data/mock';
import { useColors } from '@/hooks/useColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DIGITS = 6;

function AuthFrame({ children }: { children: React.ReactNode }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.authScroll,
        {
          paddingTop: (Platform.OS === 'web' ? 67 : insets.top) + 18,
          paddingBottom: (Platform.OS === 'web' ? 34 : insets.bottom) + 24,
        },
      ]}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
    >
      {children}
    </KeyboardAwareScrollViewCompat>
  );
}

function AuthBrand() {
  const colors = useColors();
  return (
    <View style={styles.authBrand}>
      <BrandMark size={58} />
      <Text style={[styles.brandWordmark, { color: colors.foreground }]}>EDITINGWORLD.IN</Text>
    </View>
  );
}

function AuthHeading({ title, subtitle }: { title: string; subtitle: string }) {
  const colors = useColors();
  return (
    <View style={styles.authHeading}>
      <Text style={[styles.authTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.authSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
    </View>
  );
}

export function SplashScreen() {
  const colors = useColors();
  const { hydrated, isLoggedIn } = useAppState();

  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => {
      replaceRoute(isLoggedIn ? '/(tabs)' : '/(pages)/register');
    }, 1250);
    return () => clearTimeout(timer);
  }, [hydrated, isLoggedIn]);

  return (
    <View style={[styles.splash, { backgroundColor: colors.background }]}>
      <BrandMark size={82} />
      <Text style={[styles.splashName, { color: colors.foreground }]}>EDITINGWORLD.IN</Text>
      <Text style={[styles.splashTagline, { color: colors.mutedForeground }]}>
        Your Photo.{' '}
        <Text style={{ color: colors.foreground }}>Your Poster.</Text>
        {'\n'}Your Moment.
      </Text>
      <ActivityIndicator color={colors.foreground} style={styles.splashSpinner} />
    </View>
  );
}

export function RegisterScreen() {
  const colors = useColors();
  const { patchState } = useAppState();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    const digits = mobile.replace(/\D/g, '');
    if (name.trim().length < 2 || digits.length < 10) {
      setError('Enter your name and a valid 10-digit mobile number.');
      return;
    }
    patchState({
      userName: name.trim(),
      userMobile: `+91 ${digits.slice(-10)}`,
      authMode: 'register',
    });
    navigate('/(pages)/otp');
  };

  return (
    <AuthFrame>
      <AuthBrand />
      <AuthHeading title="Create Your Account" subtitle="Join EditingWorld and explore amazing posters." />
      <FormField
        label="Full Name"
        value={name}
        onChangeText={(value) => {
          setName(value);
          setError('');
        }}
        placeholder="Enter your full name"
        textContentType="name"
        returnKeyType="next"
        testID="register-name"
      />
      <FormField
        label="Mobile Number"
        value={mobile}
        onChangeText={(value) => {
          setMobile(value.replace(/\D/g, '').slice(0, 10));
          setError('');
        }}
        placeholder="10-digit mobile number"
        keyboardType="phone-pad"
        maxLength={10}
        returnKeyType="done"
        testID="register-mobile"
      />
      {error ? <Text style={[styles.formError, { color: colors.destructive }]}>{error}</Text> : null}
      <PrimaryButton title="Send OTP" onPress={submit} testID="send-otp" style={styles.formButton} />
      <Text style={[styles.termsCopy, { color: colors.mutedForeground }]}>
        By continuing, you agree to our{' '}
        <Text style={[styles.textLink, { color: colors.foreground }]}>Terms & Privacy Policy</Text>
      </Text>
      <View style={styles.authFooter}>
        <Text style={[styles.authFooterText, { color: colors.mutedForeground }]}>Already have an account?</Text>
        <Pressable onPress={() => navigate('/(pages)/login')} accessibilityRole="button">
          <Text style={[styles.textLink, { color: colors.foreground }]}>Login</Text>
        </Pressable>
      </View>
    </AuthFrame>
  );
}

export function LoginScreen() {
  const colors = useColors();
  const { patchState } = useAppState();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (mobile.replace(/\D/g, '').length < 10 || password.length < 6) {
      setError('Enter a 10-digit mobile number and a password of at least 6 characters.');
      return;
    }
    patchState({
      userMobile: `+91 ${mobile.replace(/\D/g, '').slice(-10)}`,
      isLoggedIn: true,
      hasCompletedOnboarding: true,
      authMode: 'login',
    });
    replaceRoute('/(tabs)');
  };

  return (
    <AuthFrame>
      <AuthBrand />
      <AuthHeading title="Welcome Back" subtitle="Sign in to continue creating moments." />
      <FormField
        label="Mobile Number"
        value={mobile}
        onChangeText={(value) => {
          setMobile(value.replace(/\D/g, '').slice(0, 10));
          setError('');
        }}
        placeholder="10-digit mobile number"
        keyboardType="phone-pad"
        maxLength={10}
        returnKeyType="next"
      />
      <FormField
        label="Password"
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setError('');
        }}
        placeholder="Enter your password"
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={submit}
      />
      <Pressable
        accessibilityRole="button"
        onPress={() => navigate('/(pages)/forgot-password')}
        style={styles.forgotLink}
      >
        <Text style={[styles.textLink, { color: colors.foreground }]}>Forgot Password?</Text>
      </Pressable>
      {error ? <Text style={[styles.formError, { color: colors.destructive }]}>{error}</Text> : null}
      <PrimaryButton title="Login" onPress={submit} testID="login-submit" style={styles.formButton} />
      <View style={styles.authFooter}>
        <Text style={[styles.authFooterText, { color: colors.mutedForeground }]}>Don't have an account?</Text>
        <Pressable onPress={() => navigate('/(pages)/register')} accessibilityRole="button">
          <Text style={[styles.textLink, { color: colors.foreground }]}>Create Account</Text>
        </Pressable>
      </View>
      <Text style={[styles.mockNote, { color: colors.mutedForeground }]}>Demo sign-in: any valid mobile number and 6+ character password.</Text>
    </AuthFrame>
  );
}

export function ForgotPasswordScreen() {
  const colors = useColors();
  const { patchState, userMobile } = useAppState();
  const [mobile, setMobile] = useState(userMobile.replace(/\D/g, '').slice(-10));
  const [error, setError] = useState('');

  const submit = () => {
    if (mobile.replace(/\D/g, '').length < 10) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    patchState({ userMobile: `+91 ${mobile}`, authMode: 'reset' });
    navigate('/(pages)/otp');
  };

  return (
    <AuthFrame>
      <AuthBrand />
      <AuthHeading title="Reset Password" subtitle="We’ll verify your mobile number with a demo OTP." />
      <FormField
        label="Mobile Number"
        value={mobile}
        onChangeText={(value) => {
          setMobile(value.replace(/\D/g, '').slice(0, 10));
          setError('');
        }}
        placeholder="10-digit mobile number"
        keyboardType="phone-pad"
        maxLength={10}
      />
      {error ? <Text style={[styles.formError, { color: colors.destructive }]}>{error}</Text> : null}
      <PrimaryButton title="Continue" onPress={submit} />
      <Pressable style={styles.centerLink} onPress={() => router.back()}>
        <Text style={[styles.textLink, { color: colors.foreground }]}>Back to Login</Text>
      </Pressable>
    </AuthFrame>
  );
}

export function OtpScreen() {
  const colors = useColors();
  const { userMobile, authMode } = useAppState();
  const [otp, setOtp] = useState('');
  const [seconds, setSeconds] = useState(30);
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((value) => Math.max(value - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const verify = () => {
    if (otp.length !== DIGITS) {
      setError('Enter all 6 digits to continue.');
      return;
    }
    Keyboard.dismiss();
    navigate('/(pages)/create-password');
  };

  return (
    <Page>
      <BackHeader title="Verify Your Mobile" />
      <View style={styles.otpIcon}>
        <Feather name="smartphone" size={25} color={colors.foreground} />
      </View>
      <Text style={[styles.pageTitle, { color: colors.foreground }]}>Verify Your Mobile</Text>
      <Text style={[styles.pageSubtitle, { color: colors.mutedForeground }]}>
        Enter the 6-digit OTP sent to{' '}
        <Text style={{ color: colors.foreground }}>{userMobile || '+91 98765 43210'}</Text>
      </Text>
      <Pressable onPress={() => inputRef.current?.focus()} style={styles.otpBoxes} accessibilityRole="button">
        {Array.from({ length: DIGITS }, (_, index) => (
          <View
            key={index}
            style={[
              styles.otpBox,
              { borderColor: index === otp.length ? colors.foreground : colors.border, backgroundColor: colors.card },
            ]}
          >
            <Text style={[styles.otpDigit, { color: colors.foreground }]}>{otp[index] ?? ''}</Text>
          </View>
        ))}
        <TextInput
          ref={inputRef}
          value={otp}
          onChangeText={(value) => {
            setOtp(value.replace(/\D/g, '').slice(0, DIGITS));
            setError('');
          }}
          keyboardType="number-pad"
          maxLength={DIGITS}
          autoFocus
          accessibilityLabel="Six digit verification code"
          testID="otp-input"
          style={styles.hiddenOtpInput}
        />
      </Pressable>
      {error ? <Text style={[styles.formError, { color: colors.destructive }]}>{error}</Text> : null}
      <PrimaryButton title="Verify" onPress={verify} testID="verify-otp" style={styles.formButton} />
      <View style={styles.resendRow}>
        <Text style={[styles.authFooterText, { color: colors.mutedForeground }]}>Didn't receive the code?</Text>
        <Pressable
          accessibilityRole="button"
          disabled={seconds > 0}
          onPress={() => {
            setSeconds(30);
            setOtp('');
            Alert.alert('Demo OTP resent', 'Enter any 6-digit code to continue.');
          }}
        >
          <Text style={[styles.textLink, { color: seconds > 0 ? colors.mutedForeground : colors.foreground }]}>
            {seconds > 0 ? `Resend in 00:${String(seconds).padStart(2, '0')}` : 'Resend OTP'}
          </Text>
        </Pressable>
      </View>
      <Text style={[styles.mockNote, { color: colors.mutedForeground }]}>
        Demo flow: any 6-digit code works. No SMS is sent.
      </Text>
      {authMode === 'reset' ? null : null}
    </Page>
  );
}

export function CreatePasswordScreen() {
  const colors = useColors();
  const { authMode, patchState, completeOnboarding } = useAppState();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');

  const requirements = [
    { label: 'At least 6 characters', valid: password.length >= 6 },
    { label: 'Include letters and numbers', valid: /[A-Za-z]/.test(password) && /\d/.test(password) },
    { label: 'Include a special character', valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const submit = () => {
    if (requirements.some((item) => !item.valid) || password !== confirmation) {
      setError(password !== confirmation && confirmation ? 'Passwords do not match.' : 'Meet all password requirements to continue.');
      return;
    }
    if (authMode === 'reset') {
      patchState({ isLoggedIn: true, hasCompletedOnboarding: true });
      replaceRoute('/(tabs)');
    } else {
      navigate('/(pages)/upload-photo');
    }
  };

  return (
    <Page>
      <BackHeader title="Create Password" />
      <AuthHeading title="Create Password" subtitle="Set a strong password to secure your account." />
      <FormField
        label="Password"
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setError('');
        }}
        placeholder="Create a password"
        secureTextEntry
        textContentType="newPassword"
      />
      <FormField
        label="Confirm Password"
        value={confirmation}
        onChangeText={(value) => {
          setConfirmation(value);
          setError('');
        }}
        placeholder="Re-enter your password"
        secureTextEntry
        textContentType="newPassword"
      />
      <View style={styles.requirements}>
        {requirements.map((item) => (
          <View key={item.label} style={styles.requirementRow}>
            <Feather
              name={item.valid ? 'check-circle' : 'circle'}
              size={17}
              color={item.valid ? colors.success : colors.mutedForeground}
            />
            <Text style={[styles.requirementText, { color: item.valid ? colors.foreground : colors.mutedForeground }]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
      {error ? <Text style={[styles.formError, { color: colors.destructive }]}>{error}</Text> : null}
      <PrimaryButton title="Continue" onPress={submit} style={styles.formButton} />
    </Page>
  );
}

async function choosePhoto(source: 'camera' | 'library'): Promise<string | null> {
  try {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      if (permission.status === 'denied' && !permission.canAskAgain && Platform.OS !== 'web') {
        Alert.alert('Permission needed', 'Allow photo access in device settings to choose a picture.', [
          { text: 'Not now', style: 'cancel' },
          { text: 'Open Settings', onPress: () => void Linking.openSettings() },
        ]);
      } else {
        Alert.alert('Photo access needed', 'Allow access to choose a photo for your poster.');
      }
      return null;
    }

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.9 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.9 });
    return result.canceled ? null : result.assets[0]?.uri ?? null;
  } catch (error) {
    console.warn('Photo picker could not be opened.', error);
    Alert.alert('Unable to open photos', 'Try again in a moment.');
    return null;
  }
}

function PhotoPreview({ uri }: { uri: string | null }) {
  const colors = useColors();
  return (
    <View style={[styles.photoPreview, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {uri ? (
        <Image source={{ uri }} style={styles.photoImage} resizeMode="cover" />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Feather name="camera" size={31} color={colors.foreground} />
          <Text style={[styles.photoPrompt, { color: colors.foreground }]}>Tap to upload</Text>
          <Text style={[styles.photoHint, { color: colors.mutedForeground }]}>Choose a clear portrait photo</Text>
        </View>
      )}
    </View>
  );
}

export function UploadPhotoScreen() {
  const colors = useColors();
  const { selectedPhoto, patchState } = useAppState();
  const [busy, setBusy] = useState(false);

  const select = async (source: 'camera' | 'library') => {
    setBusy(true);
    const uri = await choosePhoto(source);
    if (uri) patchState({ selectedPhoto: uri, userPhoto: uri });
    setBusy(false);
  };

  return (
    <Page>
      <BackHeader title="Upload Your Photo" />
      <Text style={[styles.pageTitle, { color: colors.foreground }]}>Upload Your Photo</Text>
      <Text style={[styles.pageSubtitle, { color: colors.mutedForeground }]}>
        Upload a clear photo. We’ll automatically remove the background.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => void select('library')}
        style={({ pressed }) => [styles.photoTap, pressed && styles.pressed]}
      >
        <PhotoPreview uri={selectedPhoto} />
      </Pressable>
      <View style={styles.photoOptions}>
        <OutlineButton title="Choose from Photos" icon="image" onPress={() => void select('library')} />
        {Platform.OS !== 'web' ? (
          <OutlineButton title="Take a Photo" icon="camera" onPress={() => void select('camera')} />
        ) : null}
      </View>
      <View style={[styles.photoTip, { backgroundColor: colors.card }]}>
        <Feather name="info" size={16} color={colors.mutedForeground} />
        <Text style={[styles.photoTipText, { color: colors.mutedForeground }]}>
          Use a front-facing photo in good light for best results.
        </Text>
      </View>
      <PrimaryButton
        title="Continue"
        onPress={() => navigate('/(pages)/photo-processing')}
        loading={busy}
        testID="photo-continue"
        style={styles.formButton}
      />
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          patchState({ authMode: 'register' });
          navigate('/(pages)/photo-ready');
        }}
        style={styles.centerLink}
      >
        <Text style={[styles.textLink, { color: colors.mutedForeground }]}>Skip for now</Text>
      </Pressable>
    </Page>
  );
}

export function PhotoProcessingScreen() {
  const colors = useColors();
  const { selectedPhoto, recordAIProcessing } = useAppState();
  const completed = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (completed.current) return;
      completed.current = true;
      recordAIProcessing(selectedPhoto);
      replaceRoute('/(pages)/photo-ready');
    }, 1800);
    return () => clearTimeout(timer);
  }, [recordAIProcessing, selectedPhoto]);

  return (
    <Page contentStyle={styles.processingPage}>
      <BackHeader title="Photo Processing" />
      <View style={[styles.processingPhoto, { backgroundColor: colors.card }]}>
        <Image
          source={selectedPhoto ? { uri: selectedPhoto } : ARTWORKS.community}
          style={styles.processingImage}
          resizeMode="cover"
        />
        <View style={styles.processingScrim}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
      <Text style={[styles.pageTitle, { color: colors.foreground, textAlign: 'center' }]}>Removing Background…</Text>
      <Text style={[styles.pageSubtitle, { color: colors.mutedForeground, textAlign: 'center' }]}>
        Please wait a moment while we prepare your photo.
      </Text>
      <View style={[styles.progressTrack, { backgroundColor: colors.card }]}>
        <View style={[styles.progressFill, { backgroundColor: colors.primary }]} />
      </View>
      <Text style={[styles.mockNote, { color: colors.mutedForeground }]}>This is a local preview simulation.</Text>
    </Page>
  );
}

export function PhotoReadyScreen() {
  const colors = useColors();
  const { selectedPhoto, completeOnboarding } = useAppState();
  return (
    <Page>
      <BackHeader title="Photo Ready" />
      <View style={[styles.readyPhoto, { backgroundColor: colors.card }]}>
        <Image
          source={selectedPhoto ? { uri: selectedPhoto } : ARTWORKS.community}
          style={styles.readyImage}
          resizeMode="cover"
        />
        <View style={[styles.readyBadge, { backgroundColor: colors.primary }]}>
          <Feather name="check" size={15} color={colors.primaryForeground} />
        </View>
      </View>
      <Text style={[styles.pageTitle, { color: colors.foreground, textAlign: 'center' }]}>Your Photo is Ready!</Text>
      <Text style={[styles.pageSubtitle, { color: colors.mutedForeground, textAlign: 'center' }]}>
        Your portrait is ready to feature in a poster.
      </Text>
      <View style={styles.checkList}>
        {['Background removed', 'High quality cutout', 'Ready for posters'].map((label) => (
          <View key={label} style={styles.checkRow}>
            <Feather name="check-circle" size={18} color={colors.success} />
            <Text style={[styles.checkText, { color: colors.foreground }]}>{label}</Text>
          </View>
        ))}
      </View>
      <PrimaryButton
        title="Continue"
        onPress={() => {
          completeOnboarding();
          replaceRoute('/(tabs)');
        }}
        testID="photo-ready-continue"
      />
      <Pressable
        accessibilityRole="button"
        onPress={() => navigate('/(pages)/upload-photo')}
        style={styles.centerLink}
      >
        <Text style={[styles.textLink, { color: colors.mutedForeground }]}>Change Photo</Text>
      </Pressable>
    </Page>
  );
}

export function MyPhotoUploadCard() {
  const colors = useColors();
  const { userPhoto, patchState } = useAppState();
  const [busy, setBusy] = useState(false);

  const select = async (source: 'camera' | 'library') => {
    setBusy(true);
    const uri = await choosePhoto(source);
    if (uri) patchState({ userPhoto: uri, selectedPhoto: uri });
    setBusy(false);
  };

  return (
    <View style={styles.myPhotoActions}>
      <Avatar photoUri={userPhoto} size={154} />
      <Text style={[styles.photoHint, { color: colors.mutedForeground }]}>
        {userPhoto ? 'Your photo is stored on this device for this demo.' : 'No photo added yet.'}
      </Text>
      <OutlineButton title={busy ? 'Opening photos…' : 'Change Photo'} icon="image" onPress={() => void select('library')} />
      {Platform.OS !== 'web' ? (
        <OutlineButton title="Take a Photo" icon="camera" onPress={() => void select('camera')} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  authScroll: { flexGrow: 1, paddingHorizontal: 25, justifyContent: 'center' },
  authBrand: { alignItems: 'center', gap: 10, marginBottom: 30 },
  brandWordmark: { fontSize: 11, letterSpacing: 2.6, fontFamily: 'Inter_700Bold' },
  authHeading: { marginBottom: 24, gap: 8 },
  authTitle: { fontSize: 27, lineHeight: 34, fontFamily: 'Inter_700Bold', letterSpacing: -0.8 },
  authSubtitle: { fontSize: 14, lineHeight: 21, fontFamily: 'Inter_400Regular' },
  authFooter: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 24, alignItems: 'center' },
  authFooterText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  textLink: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  formButton: { marginTop: 8 },
  formError: { fontSize: 12, fontFamily: 'Inter_500Medium', marginBottom: 10 },
  termsCopy: { textAlign: 'center', fontSize: 11, lineHeight: 18, marginTop: 16, fontFamily: 'Inter_400Regular' },
  forgotLink: { alignSelf: 'flex-end', marginTop: -3, marginBottom: 14, paddingVertical: 4 },
  mockNote: { textAlign: 'center', fontSize: 11, lineHeight: 17, marginTop: 15, fontFamily: 'Inter_400Regular' },
  centerLink: { alignItems: 'center', marginTop: 19, paddingVertical: 6 },
  splash: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  splashName: { marginTop: 18, fontSize: 12, fontFamily: 'Inter_700Bold', letterSpacing: 3 },
  splashTagline: { marginTop: 24, textAlign: 'center', fontSize: 22, lineHeight: 31, fontFamily: 'Inter_500Medium' },
  splashSpinner: { marginTop: 52 },
  pageTitle: { fontSize: 26, lineHeight: 33, fontFamily: 'Inter_700Bold', letterSpacing: -0.8, marginBottom: 7 },
  pageSubtitle: { fontSize: 14, lineHeight: 21, fontFamily: 'Inter_400Regular', marginBottom: 24 },
  otpIcon: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  otpBoxes: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 24 },
  otpBox: { flex: 1, height: 56, borderWidth: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  otpDigit: { fontSize: 20, fontFamily: 'Inter_600SemiBold' },
  hiddenOtpInput: { position: 'absolute', width: 1, height: 1, opacity: 0, left: 0, top: 0 },
  resendRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, marginTop: 18 },
  requirements: { gap: 11, marginVertical: 8 },
  requirementRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  requirementText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  photoTap: { alignSelf: 'center', marginVertical: 4 },
  photoPreview: { width: 242, height: 242, borderRadius: 121, borderWidth: 1, overflow: 'hidden', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  photoPlaceholder: { alignItems: 'center', gap: 9, paddingHorizontal: 20 },
  photoPrompt: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  photoHint: { fontSize: 12, lineHeight: 19, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  photoImage: { width: '100%', height: '100%', borderRadius: 121 },
  photoOptions: { gap: 10, marginTop: 20 },
  photoTip: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 15, marginTop: 20, alignItems: 'flex-start' },
  photoTipText: { flex: 1, fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  processingPage: { flexGrow: 1, justifyContent: 'center' },
  processingPhoto: { width: 218, height: 258, borderRadius: 24, alignSelf: 'center', overflow: 'hidden', marginVertical: 28 },
  processingImage: { width: '100%', height: '100%' },
  processingScrim: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.22)' },
  progressTrack: { height: 7, borderRadius: 4, marginTop: 13, overflow: 'hidden' },
  progressFill: { width: '70%', height: '100%', borderRadius: 4 },
  readyPhoto: { width: 220, height: 260, borderRadius: 25, alignSelf: 'center', overflow: 'hidden', marginVertical: 18, position: 'relative' },
  readyImage: { width: '100%', height: '100%' },
  readyBadge: { position: 'absolute', right: 12, top: 12, width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  checkList: { gap: 14, alignSelf: 'center', marginVertical: 16 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  myPhotoActions: { gap: 14, alignItems: 'center', paddingTop: 18 },
  pressed: { opacity: 0.78 },
});