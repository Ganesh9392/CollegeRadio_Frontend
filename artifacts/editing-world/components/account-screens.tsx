import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Avatar,
  BackHeader,
  EmptyState,
  MenuRow,
  OutlineButton,
  Page,
  PosterCard,
  PrimaryButton,
  SectionHeading,
  navigate,
  replaceRoute,
} from '@/components/ui';
import { MyPhotoUploadCard } from '@/components/flow-screens';
import { useAppState, type AIHistoryRecord } from '@/context/AppState';
import { ARTWORKS, POSTERS, posterById, type Poster } from '@/data/mock';
import { useColors } from '@/hooks/useColors';

type CollectionKind = 'liked' | 'favorites' | 'downloads';

function openPoster(id: string) {
  router.push({ pathname: '/poster/[id]', params: { id } });
}

export function ProfileScreen() {
  const colors = useColors();
  const { userName, userMobile, userPhoto, isPremium, logOut } = useAppState();
  const items = [
    { title: 'My Photo', icon: 'user' as const, route: '/(pages)/my-photo', detail: 'Manage your portrait' },
    { title: 'Liked Posters', icon: 'heart' as const, route: '/(pages)/liked-posters' },
    { title: 'My Downloads', icon: 'download' as const, route: '/(pages)/downloads' },
    { title: 'Favorites', icon: 'bookmark' as const, route: '/(pages)/favorites' },
    { title: 'AI History', icon: 'clock' as const, route: '/(pages)/ai-history' },
    { title: 'Settings', icon: 'settings' as const, route: '/(pages)/settings' },
    { title: 'Help & Support', icon: 'help-circle' as const, route: '/(pages)/help-support' },
  ];

  const confirmLogout = () => {
    Alert.alert('Log out?', 'You can sign back in to continue using this demo.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          logOut();
          replaceRoute('/(pages)/login');
        },
      },
    ]);
  };

  return (
    <Page tabBar>
      <Text style={[styles.profilePageTitle, { color: colors.foreground }]}>Profile</Text>
      <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
        <Avatar photoUri={userPhoto} size={72} />
        <View style={styles.profileCopy}>
          <Text style={[styles.profileName, { color: colors.foreground }]}>{userName || 'Ravi Kumar'}</Text>
          <Text style={[styles.profileMobile, { color: colors.mutedForeground }]}>{userMobile || '+91 98765 43210'}</Text>
          {isPremium ? (
            <View style={[styles.proPill, { backgroundColor: colors.primary }]}>
              <Feather name="zap" size={11} color={colors.primaryForeground} />
              <Text style={[styles.proPillText, { color: colors.primaryForeground }]}>PREMIUM</Text>
            </View>
          ) : null}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Edit photo"
          onPress={() => navigate('/(pages)/my-photo')}
          style={styles.editPhotoAction}
        >
          <Feather name="edit-2" size={17} color={colors.foreground} />
        </Pressable>
      </View>

      {!isPremium ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => navigate('/(pages)/premium')}
          style={({ pressed }) => [styles.premiumBanner, { backgroundColor: colors.primary }, pressed && styles.pressed]}
        >
          <View style={styles.premiumBannerIcon}>
            <Feather name="zap" size={18} color={colors.primaryForeground} />
          </View>
          <View style={styles.premiumBannerCopy}>
            <Text style={[styles.premiumBannerTitle, { color: colors.primaryForeground }]}>Make more. Wait less.</Text>
            <Text style={[styles.premiumBannerSubtitle, { color: colors.primaryForeground }]}>See what Premium includes</Text>
          </View>
          <Feather name="arrow-up-right" size={18} color={colors.primaryForeground} />
        </Pressable>
      ) : null}

      <View style={[styles.menuGroup, { backgroundColor: colors.background, borderColor: colors.border }]}>
        {items.map((item) => (
          <MenuRow
            key={item.title}
            icon={item.icon}
            title={item.title}
            detail={item.detail}
            onPress={() => navigate(item.route)}
          />
        ))}
      </View>
      <Pressable accessibilityRole="button" onPress={confirmLogout} style={styles.logoutButton}>
        <Feather name="log-out" size={18} color={colors.destructive} />
        <Text style={[styles.logoutText, { color: colors.destructive }]}>Log out</Text>
      </Pressable>
      <Text style={[styles.versionNote, { color: colors.mutedForeground }]}>EDITINGWORLD  ·  DEMO VERSION</Text>
    </Page>
  );
}

export function CollectionScreen({ kind }: { kind: CollectionKind }) {
  const colors = useColors();
  const { likedPosterIds, favoritePosterIds, downloads, toggleFavorite } = useAppState();
  const titles: Record<CollectionKind, string> = {
    liked: 'Liked Posters',
    favorites: 'Favorites',
    downloads: 'My Downloads',
  };
  let posters: Poster[];
  if (kind === 'liked') posters = likedPosterIds.map(posterById).filter((poster): poster is Poster => Boolean(poster));
  else if (kind === 'favorites') posters = favoritePosterIds.map(posterById).filter((poster): poster is Poster => Boolean(poster));
  else posters = downloads.map((item) => posterById(item.posterId)).filter((poster): poster is Poster => Boolean(poster));

  return (
    <Page>
      <BackHeader title={titles[kind]} />
      {posters.length ? (
        <>
          {kind === 'downloads' ? (
            <Text style={[styles.collectionIntro, { color: colors.mutedForeground }]}>Saved on this device</Text>
          ) : null}
          <View style={styles.posterGrid}>
            {posters.map((poster) => (
              <PosterCard
                key={poster.id}
                poster={poster}
                grid
                onPress={() => openPoster(poster.id)}
                onRemove={kind === 'favorites' ? () => toggleFavorite(poster.id) : undefined}
              />
            ))}
          </View>
        </>
      ) : (
        <EmptyState
          icon={kind === 'downloads' ? 'download' : kind === 'liked' ? 'heart' : 'bookmark'}
          title={kind === 'liked' ? 'No liked posters yet.' : kind === 'favorites' ? 'No favorites saved yet.' : 'No downloads yet.'}
          message="Explore the collection and save a design you want to come back to."
          action="Explore posters"
          onAction={() => navigate('/(tabs)/explore')}
        />
      )}
    </Page>
  );
}

export function MyPhotoScreen() {
  const colors = useColors();
  const { userPhoto, patchState } = useAppState();
  const removePhoto = () => {
    if (!userPhoto) return;
    Alert.alert('Delete this photo?', 'This removes the saved demo photo from this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => patchState({ userPhoto: null, selectedPhoto: null }) },
    ]);
  };

  return (
    <Page>
      <BackHeader title="My Photo" />
      <Text style={[styles.accountHeading, { color: colors.foreground }]}>Your photo</Text>
      <Text style={[styles.accountIntro, { color: colors.mutedForeground }]}>
        This photo stays on this device in the prototype. It isn’t uploaded anywhere.
      </Text>
      <MyPhotoUploadCard />
      {userPhoto ? (
        <View style={styles.removePhoto}>
          <OutlineButton title="Delete Photo" icon="trash-2" onPress={removePhoto} />
        </View>
      ) : null}
      <View style={[styles.photoUseInfo, { backgroundColor: colors.card }]}>
        <Feather name="info" size={16} color={colors.mutedForeground} />
        <Text style={[styles.photoUseText, { color: colors.mutedForeground }]}>
          Use a bright, front-facing photo for the best poster previews.
        </Text>
      </View>
      <PrimaryButton title="Use Photo in AI Studio" icon="star" onPress={() => navigate('/(tabs)/ai')} />
    </Page>
  );
}

function HistoryRow({ item }: { item: AIHistoryRecord }) {
  const colors = useColors();
  const statusColor = item.status === 'Completed' ? colors.success : item.status === 'Failed' ? colors.destructive : colors.warning;
  const photo = item.photoUri ? { uri: item.photoUri } : ARTWORKS.community;
  return (
    <View style={[styles.historyRow, { borderBottomColor: colors.border }]}>
      <View style={styles.historyImages}>
        <Image source={photo} style={styles.historyPhoto} resizeMode="cover" />
        <View style={[styles.historyProcessed, { borderColor: colors.background }]}>
          <Image source={photo} style={styles.historyProcessedImage} resizeMode="cover" />
        </View>
      </View>
      <View style={styles.historyCopy}>
        <Text style={[styles.historyDate, { color: colors.foreground }]}>{item.date}</Text>
        <Text style={[styles.historyDescription, { color: colors.mutedForeground }]}>Background removal preview</Text>
        <Text style={[styles.historyStatus, { color: statusColor }]}>{item.status}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </View>
  );
}

export function AIHistoryScreen() {
  const colors = useColors();
  const { aiHistory } = useAppState();
  return (
    <Page>
      <BackHeader title="AI History" />
      <Text style={[styles.accountIntro, { color: colors.mutedForeground }]}>
        Your recent photo processing previews, saved locally.
      </Text>
      {aiHistory.length ? (
        <View style={[styles.historyGroup, { borderColor: colors.border }]}>
          {aiHistory.map((item) => <HistoryRow key={item.id} item={item} />)}
        </View>
      ) : (
        <EmptyState title="No processing history" message="Your photo previews will show up here." icon="clock" />
      )}
      <PrimaryButton title="Process a Photo" icon="upload" onPress={() => navigate('/(pages)/upload-photo')} style={styles.historyCta} />
    </Page>
  );
}

export function SettingsScreen() {
  const colors = useColors();
  const { notificationsEnabled, patchState, logOut } = useAppState();
  const items = [
    { title: 'Privacy Policy', icon: 'shield' as const, message: 'The privacy policy will be added with the production service.' },
    { title: 'Terms & Conditions', icon: 'file-text' as const, message: 'Terms and conditions will be added before launch.' },
    { title: 'Change Password', icon: 'lock' as const, route: '/(pages)/forgot-password' },
    { title: 'About EditingWorld', icon: 'info' as const, message: 'EditingWorld is a mobile-first poster browsing and creation prototype.' },
  ];
  return (
    <Page>
      <BackHeader title="Settings" />
      <Text style={[styles.accountHeading, { color: colors.foreground }]}>Settings</Text>
      <View style={[styles.menuGroup, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <MenuRow
          icon="user"
          title="Account"
          detail="Profile and personal photo"
          onPress={() => navigate('/(pages)/my-photo')}
        />
        <MenuRow
          icon="bell"
          title="Notifications"
          detail="Local demo preference"
          onPress={() => patchState({ notificationsEnabled: !notificationsEnabled })}
          trailing={
            <Switch
              accessibilityLabel="Notifications"
              value={notificationsEnabled}
              onValueChange={(value) => patchState({ notificationsEnabled: value })}
              trackColor={{ true: colors.primary }}
              thumbColor={colors.background}
            />
          }
        />
        {items.map((item) => (
          <MenuRow
            key={item.title}
            icon={item.icon}
            title={item.title}
            onPress={() => {
              if (item.route) navigate(item.route);
              else if (item.message) Alert.alert(item.title, item.message);
            }}
          />
        ))}
        <MenuRow
          icon="log-out"
          title="Logout"
          onPress={() =>
            Alert.alert('Log out?', 'This ends the local demo session.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Log out', style: 'destructive', onPress: () => {
                logOut();
                replaceRoute('/(pages)/login');
              } },
            ])
          }
        />
      </View>
      <Text style={[styles.settingsHint, { color: colors.mutedForeground }]}>
        Settings and preferences are stored locally for this prototype.
      </Text>
    </Page>
  );
}

const FAQS = [
  {
    question: 'How do I create a poster?',
    answer: 'Browse a category, open a design, and use the download and sharing actions. AI Studio previews a local photo flow.',
  },
  {
    question: 'Does this app upload my photo?',
    answer: 'No. Photo selection and background removal are simulated on this device in the current prototype.',
  },
  {
    question: 'How do downloads work?',
    answer: 'The demo records the selected poster in My Downloads. It does not save a file from a server.',
  },
  {
    question: 'What does Premium do?',
    answer: 'Premium is a mock app state that shows the ad-free download flow. No payment is taken.',
  },
];

export function HelpSupportScreen() {
  const colors = useColors();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [supportOpen, setSupportOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <Page>
      <BackHeader title="Help & Support" />
      <Text style={[styles.accountHeading, { color: colors.foreground }]}>How can we help?</Text>
      <Text style={[styles.accountIntro, { color: colors.mutedForeground }]}>
        Answers to common questions about the EditingWorld demo.
      </Text>
      <SectionHeading title="Frequently Asked Questions" />
      <View style={[styles.faqGroup, { borderColor: colors.border }]}>
        {FAQS.map((faq, index) => {
          const open = openFaq === index;
          return (
            <View key={faq.question} style={[styles.faqItem, { borderBottomColor: colors.border }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: open }}
                onPress={() => setOpenFaq(open ? null : index)}
                style={styles.faqQuestion}
              >
                <Text style={[styles.faqTitle, { color: colors.foreground }]}>{faq.question}</Text>
                <Feather name={open ? 'minus' : 'plus'} size={18} color={colors.mutedForeground} />
              </Pressable>
              {open ? <Text style={[styles.faqAnswer, { color: colors.mutedForeground }]}>{faq.answer}</Text> : null}
            </View>
          );
        })}
      </View>
      <View style={styles.supportActions}>
        <OutlineButton title="Contact Support" icon="mail" onPress={() => { setSubmitted(false); setSupportOpen(true); }} />
        <OutlineButton title="Report a Problem" icon="flag" onPress={() => { setSubmitted(false); setSupportOpen(true); }} />
      </View>
      <Text style={[styles.supportDisclaimer, { color: colors.mutedForeground }]}>
        Support messages are simulated and stay on this screen.
      </Text>
      <Modal transparent animationType="slide" visible={supportOpen} onRequestClose={() => setSupportOpen(false)}>
        <View style={styles.supportBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setSupportOpen(false)} />
          <View style={[styles.supportSheet, { backgroundColor: colors.background }]}>
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            {submitted ? (
              <>
                <View style={[styles.supportSuccess, { backgroundColor: colors.successSoft }]}>
                  <Feather name="check" size={23} color={colors.success} />
                </View>
                <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Message noted</Text>
                <Text style={[styles.sheetCopy, { color: colors.mutedForeground }]}>
                  Thanks for sharing feedback. It was recorded only for this demo.
                </Text>
                <PrimaryButton title="Done" onPress={() => setSupportOpen(false)} />
              </>
            ) : (
              <>
                <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Contact Support</Text>
                <Text style={[styles.sheetCopy, { color: colors.mutedForeground }]}>
                  Describe the question or issue you ran into.
                </Text>
                <TextInput
                  accessibilityLabel="Support message"
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Write a short message…"
                  placeholderTextColor={colors.mutedForeground}
                  multiline
                  textAlignVertical="top"
                  style={[styles.supportInput, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]}
                />
                <PrimaryButton
                  title="Send Demo Message"
                  disabled={message.trim().length < 4}
                  onPress={() => setSubmitted(true)}
                  style={styles.sheetButton}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </Page>
  );
}

export function PremiumScreen() {
  const colors = useColors();
  const { isPremium, patchState } = useAppState();
  const benefits = ['Download posters without simulated ads', 'Unlock premium poster designs', 'Keep your favorite posters together'];
  return (
    <Page>
      <BackHeader title="Premium" />
      <View style={[styles.premiumHero, { backgroundColor: colors.primary }]}>
        <View style={styles.premiumHeroTop}>
          <View style={[styles.premiumHeroIcon, { backgroundColor: colors.background }]}>
            <Feather name="zap" size={24} color={colors.foreground} />
          </View>
          <Text style={[styles.premiumTag, { color: colors.primaryForeground }]}>EDITINGWORLD PLUS</Text>
        </View>
        <Text style={[styles.premiumHeroTitle, { color: colors.primaryForeground }]}>More ways to make it yours.</Text>
        <Text style={[styles.premiumHeroCopy, { color: colors.primaryForeground }]}>
          A mock Premium experience. No payment is collected.
        </Text>
      </View>
      <Text style={[styles.premiumSectionTitle, { color: colors.foreground }]}>Included with Premium</Text>
      <View style={styles.benefitList}>
        {benefits.map((benefit) => (
          <View key={benefit} style={styles.benefitRow}>
            <Feather name="check-circle" size={18} color={colors.success} />
            <Text style={[styles.benefitText, { color: colors.foreground }]}>{benefit}</Text>
          </View>
        ))}
      </View>
      {isPremium ? (
        <View style={[styles.premiumActive, { backgroundColor: colors.successSoft }]}>
          <Feather name="check-circle" size={18} color={colors.success} />
          <Text style={[styles.premiumActiveText, { color: colors.success }]}>Premium is active on this device.</Text>
        </View>
      ) : (
        <>
          <PrimaryButton
            title="Activate Demo Premium"
            icon="zap"
            onPress={() => {
              patchState({ isPremium: true });
              Alert.alert('Premium activated', 'The mock ad-free experience is now enabled on this device.');
            }}
          />
          <Text style={[styles.premiumDisclaimer, { color: colors.mutedForeground }]}>
            No subscription, payment, or billing service is connected.
          </Text>
        </>
      )}
      <View style={styles.premiumFooter}>
        <OutlineButton title="Back to posters" onPress={() => router.back()} />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  profilePageTitle: { fontSize: 27, lineHeight: 34, fontFamily: 'Inter_700Bold', letterSpacing: -0.8, marginBottom: 16 },
  profileCard: { borderRadius: 22, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 15 },
  profileCopy: { flex: 1, gap: 4 },
  profileName: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  profileMobile: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  editPhotoAction: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  proPill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 4, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 4, marginTop: 4 },
  proPillText: { fontSize: 8, fontFamily: 'Inter_700Bold', letterSpacing: 0.6 },
  premiumBanner: { borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 19 },
  premiumBannerIcon: { width: 35, height: 35, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  premiumBannerCopy: { flex: 1, gap: 3 },
  premiumBannerTitle: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  premiumBannerSubtitle: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  menuGroup: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, marginBottom: 9 },
  logoutButton: { minHeight: 52, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 9, marginTop: 5 },
  logoutText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  versionNote: { textAlign: 'center', fontSize: 9, letterSpacing: 1.3, fontFamily: 'Inter_500Medium', marginTop: 8 },
  pressed: { opacity: 0.8 },
  collectionIntro: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: -8, marginBottom: 16 },
  posterGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  accountHeading: { fontSize: 24, fontFamily: 'Inter_700Bold', marginBottom: 7 },
  accountIntro: { fontSize: 13, lineHeight: 20, fontFamily: 'Inter_400Regular', marginBottom: 18 },
  removePhoto: { marginTop: 16 },
  photoUseInfo: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 15, marginVertical: 18 },
  photoUseText: { flex: 1, fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  historyGroup: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 14 },
  historyRow: { minHeight: 91, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, gap: 11 },
  historyImages: { width: 62, height: 60, position: 'relative' },
  historyPhoto: { width: 48, height: 58, borderRadius: 12 },
  historyProcessed: { position: 'absolute', width: 30, height: 30, right: 0, bottom: 0, borderRadius: 10, overflow: 'hidden', borderWidth: 2 },
  historyProcessedImage: { width: '100%', height: '100%' },
  historyCopy: { flex: 1, gap: 4 },
  historyDate: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  historyDescription: { fontSize: 10, fontFamily: 'Inter_400Regular' },
  historyStatus: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  historyCta: { marginTop: 19 },
  settingsHint: { fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 16, fontFamily: 'Inter_400Regular' },
  faqGroup: { borderTopWidth: 1, borderBottomWidth: 1, marginBottom: 23 },
  faqItem: { borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 2 },
  faqQuestion: { minHeight: 53, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  faqTitle: { flex: 1, fontSize: 13, fontFamily: 'Inter_500Medium' },
  faqAnswer: { fontSize: 12, lineHeight: 19, fontFamily: 'Inter_400Regular', paddingBottom: 14, paddingRight: 24 },
  supportActions: { gap: 10 },
  supportDisclaimer: { fontSize: 10, textAlign: 'center', marginTop: 14, fontFamily: 'Inter_400Regular' },
  supportBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.36)', justifyContent: 'flex-end' },
  supportSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 35 },
  sheetHandle: { width: 40, height: 4, alignSelf: 'center', borderRadius: 3, marginBottom: 23 },
  sheetTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', textAlign: 'center', marginBottom: 8 },
  sheetCopy: { fontSize: 13, lineHeight: 20, fontFamily: 'Inter_400Regular', textAlign: 'center', marginBottom: 17 },
  sheetButton: { marginTop: 5 },
  supportInput: { minHeight: 120, borderWidth: 1, borderRadius: 16, padding: 14, fontSize: 14, fontFamily: 'Inter_400Regular', marginBottom: 14 },
  supportSuccess: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 15 },
  premiumHero: { borderRadius: 24, padding: 22, marginBottom: 26, minHeight: 216, justifyContent: 'space-between' },
  premiumHeroTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  premiumHeroIcon: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  premiumTag: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 1.2 },
  premiumHeroTitle: { fontSize: 27, lineHeight: 33, fontFamily: 'Inter_700Bold', letterSpacing: -0.7, maxWidth: 270 },
  premiumHeroCopy: { fontSize: 12, fontFamily: 'Inter_500Medium', opacity: 0.86 },
  premiumSectionTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', marginBottom: 16 },
  benefitList: { gap: 15, marginBottom: 25 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  benefitText: { fontSize: 13, fontFamily: 'Inter_500Medium', flex: 1 },
  premiumDisclaimer: { fontSize: 10, lineHeight: 16, textAlign: 'center', marginTop: 13, fontFamily: 'Inter_400Regular' },
  premiumActive: { borderRadius: 15, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 10 },
  premiumActiveText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  premiumFooter: { marginTop: 13 },
});