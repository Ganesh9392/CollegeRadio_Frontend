import React, { type ReactNode } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ImageSourcePropType,
  type TextInputProps,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { ARTWORKS, type Category, type Poster } from '@/data/mock';

export function navigate(path: string) {
  router.push(path as Href);
}

export function replaceRoute(path: string) {
  router.replace(path as Href);
}

export function Page({
  children,
  tabBar = false,
  contentStyle,
}: {
  children: ReactNode;
  tabBar?: boolean;
  contentStyle?: object;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const top = Platform.OS === 'web' ? 67 : insets.top;
  const bottom = Platform.OS === 'web' ? 34 : insets.bottom;
  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.pageContent,
          {
            paddingTop: top + 12,
            paddingBottom: bottom + (tabBar ? 108 : 32),
          },
          contentStyle,
        ]}
      >
        {children}
      </ScrollView>
    </View>
  );
}

export function BrandMark({ size = 46 }: { size?: number }) {
  return (
    <Image
      accessibilityLabel="EditingWorld"
      source={require('../assets/images/icon.png')}
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.28) }}
    />
  );
}

export function BackHeader({
  title,
  right,
  onBack,
}: {
  title: string;
  right?: ReactNode;
  onBack?: () => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.backHeader}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        testID="back-button"
        style={styles.backHit}
      >
        <Feather name="arrow-left" size={22} color={colors.foreground} />
      </Pressable>
      <Text numberOfLines={1} style={[styles.backTitle, { color: colors.foreground }]}>
        {title}
      </Text>
      <View style={styles.backRight}>{right}</View>
    </View>
  );
}

export function IconAction({
  icon,
  label,
  onPress,
  color,
  testID,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  onPress: () => void;
  color?: string;
  testID?: string;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      testID={testID}
      hitSlop={10}
      style={({ pressed }) => [styles.iconAction, pressed && styles.pressed]}
    >
      <Feather name={icon} size={21} color={color ?? colors.foreground} />
    </Pressable>
  );
}

export function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  testID,
  style,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ComponentProps<typeof Feather>['name'];
  testID?: string;
  style?: object;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.primaryButton,
        { backgroundColor: colors.primary },
        (pressed || disabled || loading) && { opacity: disabled || loading ? 0.55 : 0.84 },
        style,
      ]}
    >
      {icon ? <Feather name={icon} size={18} color={colors.primaryForeground} /> : null}
      <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>
        {loading ? 'Please wait…' : title}
      </Text>
    </Pressable>
  );
}

export function OutlineButton({
  title,
  onPress,
  icon,
  testID,
}: {
  title: string;
  onPress: () => void;
  icon?: React.ComponentProps<typeof Feather>['name'];
  testID?: string;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.outlineButton,
        { borderColor: colors.border, backgroundColor: colors.background },
        pressed && styles.pressed,
      ]}
    >
      {icon ? <Feather name={icon} size={17} color={colors.foreground} /> : null}
      <Text style={[styles.outlineButtonText, { color: colors.foreground }]}>{title}</Text>
    </Pressable>
  );
}

export function FormField({
  label,
  error,
  ...inputProps
}: Omit<TextInputProps, 'style'> & { label: string; error?: string }) {
  const colors = useColors();
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.mutedForeground}
        accessibilityLabel={label}
        style={[
          styles.input,
          { backgroundColor: colors.card, borderColor: error ? colors.destructive : colors.border, color: colors.foreground },
        ]}
        {...inputProps}
      />
      {error ? <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text> : null}
    </View>
  );
}

export function SectionHeading({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeading}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      {action && onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction} hitSlop={8}>
          <Text style={[styles.sectionAction, { color: colors.mutedForeground }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function SearchField({
  value,
  onChangeText,
  onSubmitEditing,
  onPress,
  placeholder = 'Search posters…',
  autoFocus = false,
}: {
  value?: string;
  onChangeText?: (value: string) => void;
  onSubmitEditing?: () => void;
  onPress?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const colors = useColors();
  const content = (
    <>
      <Feather name="search" size={19} color={colors.mutedForeground} />
      <TextInput
        accessibilityLabel="Search posters"
        editable={Boolean(onChangeText)}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
        autoFocus={autoFocus}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        style={[styles.searchInput, { color: colors.foreground }]}
        testID="search-input"
      />
      {value && onChangeText ? (
        <Pressable onPress={() => onChangeText('')} accessibilityLabel="Clear search" hitSlop={10}>
          <Feather name="x-circle" size={18} color={colors.mutedForeground} />
        </Pressable>
      ) : null}
    </>
  );
  const style = [styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }];
  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} style={style}>
        {content}
      </Pressable>
    );
  }
  return <View style={style}>{content}</View>;
}

export function CategoryCard({
  category,
  onPress,
  compact = false,
}: {
  category: Category;
  onPress: () => void;
  compact?: boolean;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Browse ${category.label} posters`}
      onPress={onPress}
      testID={`category-${category.id}`}
      style={({ pressed }) => [
        compact ? styles.categoryCompact : styles.categoryCard,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
        <Ionicons name={category.icon as React.ComponentProps<typeof Ionicons>['name']} size={20} color={category.color} />
      </View>
      <Text numberOfLines={1} style={[styles.categoryLabel, { color: colors.foreground }]}>
        {category.label}
      </Text>
    </Pressable>
  );
}

export function PosterCard({
  poster,
  onPress,
  grid = false,
  onRemove,
}: {
  poster: Poster;
  onPress: () => void;
  grid?: boolean;
  onRemove?: () => void;
}) {
  const colors = useColors();
  const source = ARTWORKS[poster.artwork];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${poster.title}`}
      onPress={onPress}
      testID={`poster-${poster.id}`}
      style={({ pressed }) => [
        styles.posterCard,
        { width: grid ? '48%' : 154 },
        pressed && styles.pressed,
      ]}
    >
      <ImageBackground
        source={source as ImageSourcePropType}
        imageStyle={styles.posterImage}
        style={[styles.posterArt, grid && styles.posterArtGrid]}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', colors.scrim]}
          locations={[0.32, 1]}
          style={styles.posterGradient}
        />
        <View style={styles.posterBadges}>
          {poster.isTrending ? <Text style={[styles.posterBadge, { backgroundColor: colors.primary, color: colors.primaryForeground }]}>TRENDING</Text> : null}
          {poster.isPremium ? <Text style={[styles.posterBadge, { backgroundColor: colors.premiumBadge, color: colors.foreground }]}>PRO</Text> : null}
        </View>
        {onRemove ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove ${poster.title}`}
            onPress={(event) => {
              event.stopPropagation();
              onRemove();
            }}
            style={[styles.removePoster, { backgroundColor: colors.background }]}
          >
            <Feather name="bookmark" size={15} color={colors.foreground} />
          </Pressable>
        ) : null}
        <View style={styles.posterCaption}>
          <Text numberOfLines={1} style={styles.posterTitle}>{poster.title}</Text>
          <Text numberOfLines={1} style={styles.posterCategory}>{poster.category}</Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

export function EmptyState({
  title,
  message,
  icon = 'image',
  action,
  onAction,
}: {
  title: string;
  message: string;
  icon?: React.ComponentProps<typeof Feather>['name'];
  action?: string;
  onAction?: () => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.card }]}>
        <Feather name={icon} size={25} color={colors.mutedForeground} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.emptyMessage, { color: colors.mutedForeground }]}>{message}</Text>
      {action && onAction ? <PrimaryButton title={action} onPress={onAction} style={styles.emptyAction} /> : null}
    </View>
  );
}

export function MenuRow({
  icon,
  title,
  detail,
  onPress,
  trailing,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  detail?: string;
  onPress: () => void;
  trailing?: ReactNode;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuRow,
        { borderBottomColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.menuIcon, { backgroundColor: colors.card }]}>
        <Feather name={icon} size={19} color={colors.foreground} />
      </View>
      <View style={styles.menuCopy}>
        <Text style={[styles.menuTitle, { color: colors.foreground }]}>{title}</Text>
        {detail ? <Text style={[styles.menuDetail, { color: colors.mutedForeground }]}>{detail}</Text> : null}
      </View>
      {trailing ?? <Feather name="chevron-right" size={18} color={colors.mutedForeground} />}
    </Pressable>
  );
}

export function Avatar({
  photoUri,
  size = 64,
}: {
  photoUri?: string | null;
  size?: number;
}) {
  const colors = useColors();
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.card }]}>
      <Image
        source={photoUri ? { uri: photoUri } : ARTWORKS.community}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  pageContent: { paddingHorizontal: 22 },
  pressed: { opacity: 0.8 },
  backHeader: { flexDirection: 'row', alignItems: 'center', minHeight: 48, marginBottom: 18 },
  backHit: { width: 40, alignItems: 'flex-start', justifyContent: 'center', minHeight: 42 },
  backTitle: { flex: 1, fontSize: 18, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.3 },
  backRight: { width: 40, alignItems: 'flex-end' },
  iconAction: { minWidth: 40, minHeight: 42, alignItems: 'center', justifyContent: 'center' },
  primaryButton: {
    minHeight: 54,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: 22,
  },
  primaryButtonText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  outlineButton: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: 18,
  },
  outlineButtonText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  fieldWrap: { gap: 8, marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  errorText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', letterSpacing: -0.4 },
  sectionAction: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  searchBox: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  searchInput: { flex: 1, minHeight: 48, paddingVertical: 0, fontSize: 14, fontFamily: 'Inter_400Regular' },
  categoryCard: {
    width: '48%',
    minHeight: 110,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryCompact: {
    alignItems: 'center',
    width: 74,
    gap: 8,
  },
  categoryIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  categoryLabel: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  posterCard: { marginRight: 12, marginBottom: 14 },
  posterArt: { height: 200, justifyContent: 'space-between', overflow: 'hidden', borderRadius: 19 },
  posterArtGrid: { height: 218 },
  posterImage: { borderRadius: 19 },
  posterGradient: { ...StyleSheet.absoluteFill },
  posterBadges: { flexDirection: 'row', gap: 5, padding: 9, alignItems: 'flex-start' },
  posterBadge: { overflow: 'hidden', borderRadius: 7, paddingHorizontal: 7, paddingVertical: 5, fontSize: 8, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  removePoster: { position: 'absolute', top: 9, right: 9, width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  posterCaption: { paddingHorizontal: 11, paddingBottom: 11, gap: 3 },
  posterTitle: { color: '#FFFFFF', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  posterCategory: { color: '#FFFFFF', opacity: 0.8, fontSize: 10, fontFamily: 'Inter_400Regular' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 44 },
  emptyIcon: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 17, fontFamily: 'Inter_600SemiBold', textAlign: 'center', marginBottom: 6 },
  emptyMessage: { fontSize: 13, lineHeight: 20, fontFamily: 'Inter_400Regular', textAlign: 'center', maxWidth: 260 },
  emptyAction: { marginTop: 18, minWidth: 180 },
  menuRow: { flexDirection: 'row', alignItems: 'center', minHeight: 70, borderBottomWidth: StyleSheet.hairlineWidth, gap: 13 },
  menuIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  menuCopy: { flex: 1, gap: 3 },
  menuTitle: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  menuDetail: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  avatar: { overflow: 'hidden' },
});