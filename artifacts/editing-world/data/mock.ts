import type { ImageSourcePropType } from 'react-native';

export type ArtworkKey = 'festival' | 'community' | 'cinema';

export interface Poster {
  id: string;
  title: string;
  category: string;
  artwork: ArtworkKey;
  isTrending: boolean;
  isPremium: boolean;
  likes: number;
  downloads: number;
  keywords: string[];
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const ARTWORKS: Record<ArtworkKey, ImageSourcePropType> = {
  festival: require('../assets/images/poster-festival.png'),
  community: require('../assets/images/poster-community.png'),
  cinema: require('../assets/images/poster-cinema.png'),
};

export const CATEGORIES: Category[] = [
  { id: 'political', label: 'Political', icon: 'megaphone-outline', color: '#E6A927' },
  { id: 'festivals', label: 'Festivals', icon: 'sparkles-outline', color: '#D98B35' },
  { id: 'birthday', label: 'Birthday', icon: 'gift-outline', color: '#D16D72' },
  { id: 'events', label: 'Events', icon: 'calendar-outline', color: '#7785C8' },
  { id: 'business', label: 'Business', icon: 'briefcase-outline', color: '#438E7A' },
  { id: 'cinema', label: 'Cinema', icon: 'film-outline', color: '#926CB3' },
  { id: 'sports', label: 'Sports', icon: 'football-outline', color: '#57906A' },
  { id: 'social-awareness', label: 'Social Awareness', icon: 'heart-outline', color: '#D76F5F' },
  { id: 'government', label: 'Government', icon: 'business-outline', color: '#6388A9' },
  { id: 'trending', label: 'Trending', icon: 'trending-up-outline', color: '#D49B28' },
];

export const POSTERS: Poster[] = [
  {
    id: 'golden-diya',
    title: 'Diwali Spark',
    category: 'Festivals',
    artwork: 'festival',
    isTrending: true,
    isPremium: false,
    likes: 1240,
    downloads: 318,
    keywords: ['diwali', 'lights', 'festival', 'celebration', 'deepavali'],
  },
  {
    id: 'festival-glow',
    title: 'Festival of Lights',
    category: 'Festivals',
    artwork: 'festival',
    isTrending: true,
    isPremium: true,
    likes: 980,
    downloads: 204,
    keywords: ['diwali', 'rangoli', 'lights', 'greetings'],
  },
  {
    id: 'city-leader',
    title: 'Together Forward',
    category: 'Political',
    artwork: 'community',
    isTrending: true,
    isPremium: false,
    likes: 872,
    downloads: 183,
    keywords: ['community', 'campaign', 'leadership', 'people'],
  },
  {
    id: 'community-hero',
    title: 'A Voice for All',
    category: 'Social Awareness',
    artwork: 'community',
    isTrending: false,
    isPremium: true,
    likes: 634,
    downloads: 121,
    keywords: ['community', 'awareness', 'together', 'support'],
  },
  {
    id: 'cinema-night',
    title: 'Cinema Lights',
    category: 'Cinema',
    artwork: 'cinema',
    isTrending: true,
    isPremium: false,
    likes: 1530,
    downloads: 490,
    keywords: ['cinema', 'movie', 'film', 'premiere', 'star'],
  },
  {
    id: 'birthday-glow',
    title: 'Celebrate You',
    category: 'Birthday',
    artwork: 'cinema',
    isTrending: false,
    isPremium: false,
    likes: 760,
    downloads: 201,
    keywords: ['birthday', 'celebration', 'party', 'greetings'],
  },
  {
    id: 'grand-opening',
    title: 'A Bright Beginning',
    category: 'Business',
    artwork: 'community',
    isTrending: false,
    isPremium: false,
    likes: 418,
    downloads: 86,
    keywords: ['business', 'opening', 'launch', 'shop'],
  },
  {
    id: 'rising-star',
    title: 'Rise as One',
    category: 'Sports',
    artwork: 'community',
    isTrending: true,
    isPremium: true,
    likes: 1150,
    downloads: 267,
    keywords: ['sports', 'team', 'match', 'winner'],
  },
  {
    id: 'celebration-vibes',
    title: 'Moments Together',
    category: 'Events',
    artwork: 'festival',
    isTrending: false,
    isPremium: false,
    likes: 539,
    downloads: 94,
    keywords: ['event', 'celebration', 'gathering', 'community'],
  },
  {
    id: 'good-governance',
    title: 'A Better Tomorrow',
    category: 'Government',
    artwork: 'community',
    isTrending: false,
    isPremium: false,
    likes: 387,
    downloads: 73,
    keywords: ['government', 'public service', 'community'],
  },
  {
    id: 'colourful-festival',
    title: 'Colour the Day',
    category: 'Festivals',
    artwork: 'festival',
    isTrending: false,
    isPremium: true,
    likes: 692,
    downloads: 152,
    keywords: ['festival', 'colour', 'greetings', 'celebration'],
  },
  {
    id: 'star-announcement',
    title: 'The Big Night',
    category: 'Cinema',
    artwork: 'cinema',
    isTrending: false,
    isPremium: false,
    likes: 802,
    downloads: 178,
    keywords: ['cinema', 'event', 'announcement', 'premiere'],
  },
];

export function categoryFromId(id: string): Category | undefined {
  return CATEGORIES.find(
    (category) => category.id === id || category.label.toLowerCase() === id.toLowerCase(),
  );
}

export function posterById(id: string | undefined): Poster | undefined {
  return POSTERS.find((poster) => poster.id === id);
}