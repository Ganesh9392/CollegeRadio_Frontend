import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Modal,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import {
  BackHeader,
  BrandMark,
  CategoryCard,
  EmptyState,
  IconAction,
  OutlineButton,
  Page,
  PosterCard,
  PrimaryButton,
  SearchField,
  SectionHeading,
  navigate,
} from '@/components/ui';
import { useAppState } from '@/context/AppState';
import { ARTWORKS, CATEGORIES, POSTERS, categoryFromId, posterById } from '@/data/mock';
import { useColors } from '@/hooks/useColors';
import { MyPhotoUploadCard } from '@/components/flow-screens';

function openPoster(id: string) {
  router.push({ pathname: '/poster/[id]', params: { id } });
}

function openCategory(id: string) {
  router.push({ pathname: '/category/[name]', params: { name: id } });
}

export function HomeScreen() {
  const colors = useColors();
  const { userName } = useAppState();
  const categories = CATEGORIES.slice(0, 7);
  const trending = POSTERS.filter((poster) => poster.isTrending).slice(0, 6);

  return (
    <Page tabBar>
      <View style={styles.homeHeader}>
        <View style={styles.brandRow}>
          <BrandMark size={39} />
          <View>
            <Text style={[styles.brandName, { color: colors.foreground }]}>EditingWorld</Text>
            <Text style={[styles.brandSub, { color: colors.mutedForeground }]}>Make every moment yours</Text>
          </View>
        </View>
        <IconAction
          icon="bell"
          label="Notifications"
          onPress={() => Alert.alert('You’re all caught up', 'New poster updates will appear here.')}
        />
      </View>

      <View style={styles.homeIntro}>
        <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>GOOD DAY, {userName.split(' ')[0].toUpperCase()}</Text>
        <Text style={[styles.homeTitle, { color: colors.foreground }]}>
          Make something{'\n'}<Text style={[styles.homeHighlight, { color: colors.foreground }]}>worth sharing.</Text>
        </Text>
        <Text style={[styles.homeDescription, { color: colors.mutedForeground }]}>
          A poster for every person, celebration, and big idea.
        </Text>
      </View>

      <SearchField onPress={() => navigate('/(pages)/search')} />

      <View style={styles.homeSection}>
        <SectionHeading title="Browse categories" action="See all" onAction={() => navigate('/(tabs)/explore')} />
        <View style={styles.categoryGrid}>
          {categories.slice(0, 4).map((category) => (
            <CategoryCard key={category.id} category={category} onPress={() => openCategory(category.id)} />
          ))}
        </View>
      </View>

      <View style={styles.homeSection}>
        <SectionHeading title="Trending today" action="See all" onAction={() => openCategory('trending')} />
        <View style={styles.posterGrid}>
          {trending.slice(0, 4).map((poster) => (
            <PosterCard key={poster.id} poster={poster} grid onPress={() => openPoster(poster.id)} />
          ))}
        </View>
      </View>

      <View style={[styles.createBanner, { backgroundColor: colors.primary }]}>
        <View style={styles.createBannerCopy}>
          <Text style={[styles.createBannerKicker, { color: colors.primaryForeground }]}>YOUR PHOTO, REIMAGINED</Text>
          <Text style={[styles.createBannerTitle, { color: colors.primaryForeground }]}>Make a poster with you in it.</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigate('/(tabs)/ai')}
            style={({ pressed }) => [styles.createBannerLink, pressed && styles.pressed]}
          >
            <Text style={[styles.createBannerLinkText, { color: colors.primaryForeground }]}>Try AI Studio</Text>
            <Feather name="arrow-up-right" size={16} color={colors.primaryForeground} />
          </Pressable>
        </View>
        <Feather name="image" size={38} color={colors.primaryForeground} />
      </View>
    </Page>
  );
}

export function ExploreScreen() {
  const colors = useColors();
  return (
    <Page tabBar>
      <View style={styles.exploreHeader}>
        <View>
          <Text style={[styles.pageTitle, { color: colors.foreground }]}>Explore</Text>
          <Text style={[styles.pageSubtitle, { color: colors.mutedForeground, marginBottom: 0 }]}>
            Find the right look for your next post.
          </Text>
        </View>
        <IconAction icon="search" label="Search posters" onPress={() => navigate('/(pages)/search')} />
      </View>
      <View style={styles.categoryGrid}>
        {CATEGORIES.map((category) => (
          <CategoryCard key={category.id} category={category} onPress={() => openCategory(category.id)} />
        ))}
      </View>
      <View style={styles.homeSection}>
        <SectionHeading title="Editor's picks" />
        <View style={styles.posterGrid}>
          {POSTERS.slice(0, 4).map((poster) => (
            <PosterCard key={poster.id} poster={poster} grid onPress={() => openPoster(poster.id)} />
          ))}
        </View>
      </View>
    </Page>
  );
}

export function CategoryPostersScreen() {
  const colors = useColors();
  const { name } = useLocalSearchParams<{ name: string }>();
  const category = categoryFromId(String(name ?? ''));
  const posters = useMemo(() => {
    if (String(name) === 'trending' || category?.id === 'trending') return POSTERS.filter((poster) => poster.isTrending);
    return POSTERS.filter((poster) => poster.category.toLowerCase() === category?.label.toLowerCase());
  }, [category?.id, category?.label, name]);

  return (
    <Page>
      <BackHeader
        title={category?.label ?? 'Posters'}
        right={<IconAction icon="search" label="Search posters" onPress={() => navigate('/(pages)/search')} />}
      />
      <Text style={[styles.pageSubtitle, { color: colors.mutedForeground }]}>
        {posters.length} {posters.length === 1 ? 'design' : 'designs'} to make your own.
      </Text>
      {posters.length ? (
        <View style={styles.posterGrid}>
          {posters.map((poster) => (
            <PosterCard key={poster.id} poster={poster} grid onPress={() => openPoster(poster.id)} />
          ))}
        </View>
      ) : (
        <EmptyState
          title="No posters here yet"
          message="Try another category or search all poster designs."
          action="Search posters"
          onAction={() => navigate('/(pages)/search')}
        />
      )}
    </Page>
  );
}

export function SearchScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ query?: string }>();
  const [query, setQuery] = useState(typeof params.query === 'string' ? params.query : '');
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return POSTERS;
    return POSTERS.filter((poster) =>
      [poster.title, poster.category, ...poster.keywords].some((word) => word.toLowerCase().includes(term)),
    );
  }, [query]);

  return (
    <Page>
      <BackHeader title="Search" />
      <SearchField value={query} onChangeText={setQuery} autoFocus />
      <View style={styles.searchResultsHeader}>
        <Text style={[styles.searchResultCount, { color: colors.mutedForeground }]}>
          {query ? `${results.length} results` : 'Popular posters'}
        </Text>
        {query ? (
          <Pressable onPress={() => setQuery('')} accessibilityRole="button">
            <Text style={[styles.clearText, { color: colors.foreground }]}>Clear</Text>
          </Pressable>
        ) : null}
      </View>
      {results.length ? (
        <View style={styles.posterGrid}>
          {results.map((poster) => (
            <PosterCard key={poster.id} poster={poster} grid onPress={() => openPoster(poster.id)} />
          ))}
        </View>
      ) : (
        <EmptyState
          icon="search"
          title="No posters found"
          message="Try a title, category, or a word like festival, cinema, or birthday."
          action="Clear search"
          onAction={() => setQuery('')}
        />
      )}
    </Page>
  );
}

export function PosterDetailsScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const poster = posterById(String(id));
  const {
    isPremium,
    likedPosterIds,
    favoritePosterIds,
    toggleLike,
    toggleFavorite,
    recordDownload,
  } = useAppState();
  const [downloadModal, setDownloadModal] = useState(false);
  const [watchingAd, setWatchingAd] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const liked = poster ? likedPosterIds.includes(poster.id) : false;
  const favorite = poster ? favoritePosterIds.includes(poster.id) : false;

  if (!poster) {
    return (
      <Page>
        <BackHeader title="Poster" />
        <EmptyState title="Poster not found" message="This design may have been removed." action="Explore posters" onAction={() => navigate('/(tabs)/explore')} />
      </Page>
    );
  }

  const startDownload = () => {
    if (isPremium) {
      recordDownload(poster.id);
      setDownloadDone(true);
      setDownloadModal(true);
      return;
    }
    setDownloadDone(false);
    setDownloadModal(true);
  };

  const watchAdAndDownload = () => {
    setWatchingAd(true);
    setTimeout(() => {
      recordDownload(poster.id);
      setWatchingAd(false);
      setDownloadDone(true);
    }, 1600);
  };

  const sharePoster = async () => {
    try {
      await Share.share({ message: `Check out “${poster.title}” on EditingWorld.` });
    } catch (error) {
      console.warn('Poster share could not be opened.', error);
      Alert.alert('Sharing unavailable', 'Try again in a moment.');
    }
  };

  return (
    <View style={[styles.detailRoot, { backgroundColor: colors.background }]}>
      <ImageBackground
        source={ARTWORKS[poster.artwork]}
        style={styles.detailImage}
        imageStyle={styles.detailImageStyle}
        resizeMode="cover"
      >
        <LinearGradient colors={['rgba(0,0,0,0.34)', 'transparent', 'rgba(0,0,0,0.74)']} style={StyleSheet.absoluteFill} />
        <View style={styles.detailTop}>
          <IconAction icon="arrow-left" label="Go back" onPress={() => router.back()} color="#FFFFFF" />
          <IconAction
            icon="bookmark"
            label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            onPress={() => {
              toggleFavorite(poster.id);
            }}
            color="#FFFFFF"
          />
        </View>
        <View style={styles.detailCaption}>
          <Text style={styles.detailCategory}>{poster.category.toUpperCase()}</Text>
          <Text style={styles.detailTitle}>{poster.title}</Text>
          <Text style={styles.detailStats}>{poster.likes.toLocaleString()} likes  ·  {poster.downloads.toLocaleString()} downloads</Text>
        </View>
      </ImageBackground>
      <View style={styles.detailActions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={liked ? 'Unlike poster' : 'Like poster'}
          onPress={() => toggleLike(poster.id)}
          style={styles.detailAction}
        >
          <Feather name="heart" size={20} color={liked ? colors.destructive : colors.foreground} />
          <Text style={[styles.detailActionText, { color: liked ? colors.destructive : colors.foreground }]}>
            {liked ? 'Liked' : 'Like'}
          </Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => void sharePoster()} style={styles.detailAction}>
          <Feather name="share-2" size={20} color={colors.foreground} />
          <Text style={[styles.detailActionText, { color: colors.foreground }]}>Share</Text>
        </Pressable>
        <PrimaryButton title={isPremium ? 'Download' : 'Download'} icon="download" onPress={startDownload} style={styles.downloadButton} />
      </View>
      <View style={styles.detailMeta}>
        <Text style={[styles.detailMetaTitle, { color: colors.foreground }]}>Make it yours</Text>
        <Text style={[styles.detailMetaCopy, { color: colors.mutedForeground }]}>
          Add your photo, customize the message, and share this design with your community.
        </Text>
        <OutlineButton title="Create with this poster" icon="edit-3" onPress={() => navigate('/(tabs)/ai')} />
      </View>

      <Modal
        transparent
        animationType="slide"
        visible={downloadModal}
        onRequestClose={() => {
          if (!watchingAd) setDownloadModal(false);
        }}
      >
        <View style={styles.modalBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => !watchingAd && setDownloadModal(false)} />
          <View style={[styles.downloadSheet, { backgroundColor: colors.background }]}>
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            {downloadDone ? (
              <>
                <View style={[styles.successIcon, { backgroundColor: colors.successSoft }]}>
                  <Feather name="check" size={26} color={colors.success} />
                </View>
                <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Download Successful</Text>
                <Text style={[styles.sheetCopy, { color: colors.mutedForeground }]}>
                  “{poster.title}” was added to My Downloads on this device.
                </Text>
                <PrimaryButton title="Done" onPress={() => setDownloadModal(false)} style={styles.sheetButton} />
              </>
            ) : (
              <>
                <View style={[styles.modalIcon, { backgroundColor: colors.primary }]}>
                  <Feather name="download" size={23} color={colors.primaryForeground} />
                </View>
                <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Watch Ad to Download</Text>
                <Text style={[styles.sheetCopy, { color: colors.mutedForeground }]}>
                  Watch a short ad to download this poster. The ad is simulated in this demo.
                </Text>
                <PrimaryButton
                  title={watchingAd ? 'Preparing download…' : 'Watch Ad & Download'}
                  loading={watchingAd}
                  onPress={watchAdAndDownload}
                  style={styles.sheetButton}
                />
                <View style={styles.orRow}>
                  <View style={[styles.orLine, { backgroundColor: colors.border }]} />
                  <Text style={[styles.orText, { color: colors.mutedForeground }]}>OR</Text>
                  <View style={[styles.orLine, { backgroundColor: colors.border }]} />
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setDownloadModal(false);
                    navigate('/(pages)/premium');
                  }}
                  style={styles.premiumLink}
                >
                  <Feather name="zap" size={17} color={colors.foreground} />
                  <View style={styles.premiumLinkCopy}>
                    <Text style={[styles.premiumLinkTitle, { color: colors.foreground }]}>Go Premium</Text>
                    <Text style={[styles.premiumLinkHint, { color: colors.mutedForeground }]}>Download without ads and get more features.</Text>
                  </View>
                  <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function AIStudioScreen() {
  const colors = useColors();
  const { userPhoto, selectedPhoto } = useAppState();
  const photo = selectedPhoto ?? userPhoto;
  return (
    <Page tabBar>
      <View style={styles.aiHeader}>
        <View>
          <Text style={[styles.pageTitle, { color: colors.foreground }]}>AI Studio</Text>
          <Text style={[styles.pageSubtitle, { color: colors.mutedForeground, marginBottom: 0 }]}>
            Prep your portrait for a poster.
          </Text>
        </View>
        <IconAction icon="clock" label="AI History" onPress={() => navigate('/(pages)/ai-history')} />
      </View>
      <View style={[styles.aiPreview, { backgroundColor: colors.card }]}>
        <Image source={photo ? { uri: photo } : ARTWORKS.community} style={styles.aiPhoto} resizeMode="cover" />
        <View style={[styles.aiTag, { backgroundColor: colors.background }]}>
          <Feather name="star" size={13} color={colors.foreground} />
          <Text style={[styles.aiTagText, { color: colors.foreground }]}>{photo ? 'YOUR PORTRAIT' : 'SAMPLE PREVIEW'}</Text>
        </View>
      </View>
      <Text style={[styles.aiTitle, { color: colors.foreground }]}>Ready for your close-up?</Text>
      <Text style={[styles.aiCopy, { color: colors.mutedForeground }]}>
        Choose a clear portrait and we’ll show a local background-removal preview. No image is uploaded.
      </Text>
      <PrimaryButton
        title={photo ? 'Process my photo' : 'Choose a photo'}
        icon="upload"
        onPress={() => navigate('/(pages)/upload-photo')}
        testID="ai-upload"
      />
      <View style={styles.aiSecondary}>
        <OutlineButton title="Browse posters" icon="grid" onPress={() => navigate('/(tabs)/explore')} />
      </View>
      <View style={styles.aiHistoryLink}>
        <SectionHeading title="Recent processing" action="View history" onAction={() => navigate('/(pages)/ai-history')} />
        <Text style={[styles.aiHistorySummary, { color: colors.mutedForeground }]}>Your processing history is saved on this device.</Text>
      </View>
    </Page>
  );
}

export function VideosScreen() {
  const colors = useColors();
  const videoCards = [
    { title: 'Festival Stories', subtitle: 'Warm, celebratory motion templates', posterId: 'golden-diya' },
    { title: 'Cinema Announcements', subtitle: 'Make a dramatic first impression', posterId: 'cinema-night' },
  ];
  return (
    <Page tabBar>
      <Text style={[styles.pageTitle, { color: colors.foreground }]}>Video templates</Text>
      <Text style={[styles.pageSubtitle, { color: colors.mutedForeground }]}>
        Browse ready-made motion concepts for your next announcement.
      </Text>
      {videoCards.map((card) => (
        <Pressable
          key={card.title}
          accessibilityRole="button"
          onPress={() => openPoster(card.posterId)}
          style={({ pressed }) => [styles.videoCard, { backgroundColor: colors.card }, pressed && styles.pressed]}
        >
          <View style={styles.videoArt}>
            <Image source={ARTWORKS[card.posterId === 'golden-diya' ? 'festival' : 'cinema']} style={styles.videoImage} resizeMode="cover" />
            <View style={[styles.playButton, { backgroundColor: colors.primary }]}>
              <Feather name="play" size={17} color={colors.primaryForeground} />
            </View>
          </View>
          <View style={styles.videoCopy}>
            <Text style={[styles.videoTitle, { color: colors.foreground }]}>{card.title}</Text>
            <Text style={[styles.videoSubtitle, { color: colors.mutedForeground }]}>{card.subtitle}</Text>
            <Text style={[styles.videoMeta, { color: colors.mutedForeground }]}>Preview poster collection</Text>
          </View>
        </Pressable>
      ))}
      <View style={[styles.videoNote, { backgroundColor: colors.card }]}>
        <Feather name="info" size={17} color={colors.mutedForeground} />
        <Text style={[styles.videoNoteText, { color: colors.mutedForeground }]}>
          Motion previews are visual examples in this frontend prototype.
        </Text>
      </View>
      <OutlineButton title="Explore poster designs" icon="grid" onPress={() => navigate('/(tabs)/explore')} />
    </Page>
  );
}

const styles = StyleSheet.create({
  homeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  brandName: { fontSize: 15, fontFamily: 'Inter_700Bold', letterSpacing: -0.2 },
  brandSub: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 2 },
  homeIntro: { marginBottom: 21 },
  eyebrow: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 1.8, marginBottom: 10 },
  homeTitle: { fontSize: 33, lineHeight: 39, fontFamily: 'Inter_700Bold', letterSpacing: -1.2 },
  homeHighlight: { textDecorationLine: 'underline', textDecorationStyle: 'solid' },
  homeDescription: { fontSize: 13, lineHeight: 20, fontFamily: 'Inter_400Regular', marginTop: 9 },
  homeSection: { marginTop: 26 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  posterGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  createBanner: { borderRadius: 22, padding: 19, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 9 },
  createBannerCopy: { flex: 1, paddingRight: 14 },
  createBannerKicker: { fontSize: 8, fontFamily: 'Inter_700Bold', letterSpacing: 1.4, marginBottom: 8 },
  createBannerTitle: { fontSize: 18, lineHeight: 23, fontFamily: 'Inter_700Bold', maxWidth: 220 },
  createBannerLink: { flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 13 },
  createBannerLinkText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  exploreHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  pageTitle: { fontSize: 27, lineHeight: 34, fontFamily: 'Inter_700Bold', letterSpacing: -0.8, marginBottom: 5 },
  pageSubtitle: { fontSize: 13, lineHeight: 20, fontFamily: 'Inter_400Regular', marginBottom: 20 },
  searchResultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 21, marginBottom: 13 },
  searchResultCount: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  clearText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  detailRoot: { flex: 1 },
  detailImage: { height: '69%', justifyContent: 'space-between' },
  detailImageStyle: { borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  detailTop: { paddingTop: Platform.OS === 'web' ? 72 : 52, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailCaption: { paddingHorizontal: 24, paddingBottom: 23 },
  detailCategory: { color: '#FFFFFF', fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1.5, marginBottom: 8 },
  detailTitle: { color: '#FFFFFF', fontSize: 30, lineHeight: 36, fontFamily: 'Inter_700Bold', letterSpacing: -0.8 },
  detailStats: { color: '#FFFFFF', opacity: 0.88, marginTop: 8, fontSize: 11, fontFamily: 'Inter_500Medium' },
  detailActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 17, paddingVertical: 13, gap: 8 },
  detailAction: { alignItems: 'center', justifyContent: 'center', gap: 5, minWidth: 54, minHeight: 48 },
  detailActionText: { fontSize: 10, fontFamily: 'Inter_500Medium' },
  downloadButton: { flex: 1, minHeight: 49, borderRadius: 15, marginLeft: 5 },
  detailMeta: { paddingHorizontal: 22, paddingTop: 9 },
  detailMetaTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', marginBottom: 5 },
  detailMetaCopy: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular', marginBottom: 12 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.36)', justifyContent: 'flex-end' },
  downloadSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 35, alignItems: 'center' },
  sheetHandle: { width: 40, height: 4, borderRadius: 3, marginBottom: 22 },
  modalIcon: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  successIcon: { width: 56, height: 56, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  sheetTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', textAlign: 'center', marginBottom: 8 },
  sheetCopy: { fontSize: 13, lineHeight: 20, fontFamily: 'Inter_400Regular', textAlign: 'center', maxWidth: 290, marginBottom: 18 },
  sheetButton: { width: '100%' },
  orRow: { flexDirection: 'row', alignItems: 'center', width: '100%', gap: 12, marginVertical: 14 },
  orLine: { height: StyleSheet.hairlineWidth, flex: 1 },
  orText: { fontSize: 10, fontFamily: 'Inter_500Medium' },
  premiumLink: { flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%', paddingVertical: 10 },
  premiumLinkCopy: { flex: 1, gap: 4 },
  premiumLinkTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  premiumLinkHint: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  aiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  aiPreview: { height: 300, borderRadius: 25, overflow: 'hidden', marginBottom: 22, position: 'relative' },
  aiPhoto: { width: '100%', height: '100%' },
  aiTag: { position: 'absolute', left: 13, top: 13, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 6 },
  aiTagText: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.8 },
  aiTitle: { fontSize: 21, fontFamily: 'Inter_700Bold', letterSpacing: -0.5, marginBottom: 7 },
  aiCopy: { fontSize: 13, lineHeight: 20, fontFamily: 'Inter_400Regular', marginBottom: 18 },
  aiSecondary: { marginTop: 10 },
  aiHistoryLink: { marginTop: 30 },
  aiHistorySummary: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: -6 },
  videoCard: { borderRadius: 22, overflow: 'hidden', marginBottom: 14 },
  videoArt: { height: 198, position: 'relative' },
  videoImage: { width: '100%', height: '100%' },
  playButton: { position: 'absolute', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', left: '50%', top: '50%', marginLeft: -22, marginTop: -22 },
  videoCopy: { padding: 16 },
  videoTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', marginBottom: 4 },
  videoSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', marginBottom: 8 },
  videoMeta: { fontSize: 10, fontFamily: 'Inter_500Medium' },
  videoNote: { flexDirection: 'row', gap: 10, borderRadius: 14, padding: 14, marginVertical: 7, alignItems: 'center' },
  videoNoteText: { flex: 1, fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular' },
  pressed: { opacity: 0.8 },
});