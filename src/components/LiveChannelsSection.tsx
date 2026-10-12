import React, { useState, useMemo } from 'react';
import {
  Tv,
  Film,
  Music,
  Radio,
  BookOpen,
  Play,
  ExternalLink,
  Search,
  Plus,
  Sparkles,
  Flame,
  Globe,
  X,
  Check,
  Headphones,
  Tv2,
  TvMinimal,
  Video,
  ChevronDown,
  Youtube,
  ShieldAlert,
} from 'lucide-react';

export interface EntertainmentItem {
  id: string;
  name: string;
  tagline: string;
  category: 'Movies & Dramas' | 'Music & Radio' | 'News & Podcasts' | 'Gaming & Live' | 'Streaming Apps';
  logo: string;
  url: string;
  description: string;
  badge?: string;
  region?: string;
  isCustom?: boolean;
}

export interface CountryChannel {
  id: string;
  name: string;
  tagline: string;
  url: string;
  logo: string;
  badge?: string;
}

export interface CountryGroup {
  country: string;
  flag: string;
  channels: CountryChannel[];
}

export interface RegionDirectory {
  regionId: string;
  regionName: string;
  countries: CountryGroup[];
}

const COMPACT_GLOBAL_DIRECTORY: RegionDirectory[] = [
  {
    regionId: 'all-regions',
    regionName: '🌐 All Regions (Global)',
    countries: [
      {
        country: 'Internet',
        flag: '🌐',
        channels: [
          { id: 'net-youtube', name: 'YouTube', tagline: 'Videos, music, vlogs, and global live broadcasts', url: 'https://www.youtube.com', logo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=150&q=80', badge: 'Global' },
          { id: 'net-fashiontv', name: 'Fashion TV', tagline: 'Global fashion shows, models, and luxury lifestyle live', url: 'https://www.fashiontv.com', logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=150&q=80', badge: 'Fashion' },
          { id: 'net-worldfashion', name: 'World Fashion Channel', tagline: 'International luxury, style, and designer runway shows', url: 'https://wfc.tv', logo: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80', badge: 'Style' },
          { id: 'net-clubbing', name: 'Clubbing TV', tagline: 'Electronic music, nightlife, and DJ live sets', url: 'https://www.clubbingtv.com', logo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=150&q=80', badge: 'Nightlife' },
          { id: 'net-twitch', name: 'Twitch', tagline: 'Live streaming for gamers and creators', url: 'https://www.twitch.tv', logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80', badge: 'Gaming' },
          { id: 'net-vevo', name: 'VEVO', tagline: 'Official music videos and artist premieres', url: 'https://www.youtube.com/@VEVO', logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80', badge: 'Music' },
          { id: 'net-netflix', name: 'Netflix', tagline: 'Global movie trailers and original series', url: 'https://www.youtube.com/@Netflix', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=150&q=80', badge: 'Movies' },
          { id: 'net-crunchyroll', name: 'Crunchyroll', tagline: 'Subbed and dubbed anime series worldwide', url: 'https://www.crunchyroll.com', logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=150&q=80', badge: 'Anime' },
          { id: 'net-redbull', name: 'Red Bull TV', tagline: 'Extreme sports, music festivals, and adventure', url: 'https://www.redbull.com', logo: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=150&q=80', badge: 'Sports' },
          { id: 'net-nasa', name: 'NASA Live', tagline: 'Space exploration, rocket launches & earth views', url: 'https://www.youtube.com/@NASA/live', logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=150&q=80', badge: 'Space' },
          { id: 'net-boilerroom', name: 'Boiler Room', tagline: 'Global underground music and DJ sets', url: 'https://www.youtube.com/@BoilerRoom', logo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80', badge: 'DJ / Music' },
          { id: 'net-ign', name: 'IGN', tagline: 'Gaming reviews, trailers and entertainment news', url: 'https://www.youtube.com/@IGN', logo: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=150&q=80', badge: 'Gaming' },
          { id: 'net-billboard', name: 'Billboard', tagline: 'Global music charts, interviews and hits', url: 'https://www.youtube.com/@Billboard', logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80', badge: 'Charts' },
          { id: 'net-ted', name: 'TED', tagline: 'Ideas worth spreading from global thinkers', url: 'https://www.youtube.com/@TED', logo: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=150&q=80', badge: 'Ideas' },
          { id: 'net-pitchfork', name: 'Pitchfork', tagline: 'Indie music reviews and live session clips', url: 'https://www.youtube.com/@Pitchfork', logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80', badge: 'Indie' },
          { id: 'net-warner', name: 'Warner Bros. Pictures', tagline: 'Hollywood blockbuster movie trailers', url: 'https://www.youtube.com/@WarnerBrosPictures', logo: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=150&q=80', badge: 'Cinema' },
          { id: 'net-sonypictures', name: 'Sony Pictures', tagline: 'Hollywood cinema previews and clips', url: 'https://www.youtube.com/@SonyPictures', logo: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=150&q=80', badge: 'Cinema' },
          { id: 'net-universal', name: 'Universal Pictures', tagline: 'Blockbuster movie trailers and features', url: 'https://www.youtube.com/@UniversalPictures', logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=150&q=80', badge: 'Movies' },
          { id: 'net-paramount', name: 'Paramount Pictures', tagline: 'Classic and new Hollywood releases', url: 'https://www.youtube.com/@ParamountPictures', logo: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=150&q=80', badge: 'Movies' },
          { id: 'net-marvel', name: 'Marvel Entertainment', tagline: 'Superhero movie trailers and series', url: 'https://www.youtube.com/@Marvel', logo: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&w=150&q=80', badge: 'Marvel' },
        ],
      },
    ],
  },
  {
    regionId: 'south-asia',
    regionName: 'South Asia (Pakistan & India)',
    countries: [
      {
        country: 'Pakistan',
        flag: '🇵🇰',
        channels: [
          { id: 'pk-hum', name: 'HUM TV', tagline: 'Top Pakistani dramas and serials', url: 'https://www.youtube.com/@HUMTV', logo: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=150&q=80', badge: 'Dramas' },
          { id: 'pk-ary', name: 'ARY Digital', tagline: 'Leading entertainment & blockbuster dramas', url: 'https://www.youtube.com/@ARYDigitalPak', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=150&q=80', badge: 'Hit Shows' },
          { id: 'pk-geo', name: 'Har Pal Geo', tagline: 'Geo TV drama serials and telefilms', url: 'https://www.youtube.com/@HarPalGeo', logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=150&q=80', badge: 'Dramas' },
          { id: 'pk-express', name: 'Express Entertainment', tagline: 'Family entertainment and comedy serials', url: 'https://www.youtube.com/@ExpressEntertainment', logo: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=150&q=80', badge: 'Entertainment' },
          { id: 'pk-ptv', name: 'PTV Home', tagline: 'Classic Pakistan television network', url: 'https://www.youtube.com/@PTVHomeOfficial', logo: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=150&q=80', badge: 'Classic' },
          { id: 'pk-bol', name: 'BOL Entertainment', tagline: 'Game shows, reality TV, and comedy', url: 'https://www.youtube.com/@BOLEntertainment', logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=150&q=80', badge: 'Reality' },
          { id: 'pk-humnews', name: 'Hum News', tagline: '24/7 Pakistani breaking news and analysis', url: 'https://www.youtube.com/@HUMNewsPakistan/live', logo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'pk-samaa', name: 'Samaa TV', tagline: 'Fast news coverage and talk shows', url: 'https://www.youtube.com/@SamaaTV/live', logo: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'pk-arynews', name: 'ARY News', tagline: 'Top rated Pakistani live news channel', url: 'https://www.youtube.com/@arynews/live', logo: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'pk-dunya', name: 'Dunya News', tagline: 'Current affairs, headlines, and talk shows', url: 'https://www.youtube.com/@DunyaNews/live', logo: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=150&q=80', badge: 'News' },
        ],
      },
      {
        country: 'India',
        flag: '🇮🇳',
        channels: [
          { id: 'in-sab', name: 'Sony SAB', tagline: 'Family comedy shows and sitcoms', url: 'https://www.youtube.com/@SonySAB', logo: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=150&q=80', badge: 'Comedy' },
          { id: 'in-star', name: 'Star Plus', tagline: 'Popular Indian family dramas and reality shows', url: 'https://www.youtube.com/@StarPlus', logo: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=150&q=80', badge: 'Dramas' },
          { id: 'in-zee', name: 'Zee TV', tagline: 'Entertainment serials and blockbuster events', url: 'https://www.youtube.com/@ZeeTV', logo: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=150&q=80', badge: 'Hits' },
          { id: 'in-colors', name: 'Colors TV', tagline: 'Reality TV, Bigg Boss, and drama series', url: 'https://www.youtube.com/@ColorsTV', logo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80', badge: 'Reality' },
          { id: 'in-tseries', name: 'T-Series', tagline: 'World’s biggest music and Bollywood movies', url: 'https://www.youtube.com/@tseries', logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80', badge: 'Music' },
          { id: 'in-goldmines', name: 'Goldmines Telefilms', tagline: 'Blockbuster South Indian movies dubbed in Hindi', url: 'https://www.youtube.com/@GoldminesTelefilms', logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80', badge: 'Movies' },
          { id: 'in-aajtak', name: 'Aaj Tak', tagline: 'India’s #1 live Hindi news channel', url: 'https://www.youtube.com/@AajTak/live', logo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'in-ndtv', name: 'NDTV 24x7', tagline: 'Trusted English news and investigative reporting', url: 'https://www.youtube.com/@NDTV/live', logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'in-republic', name: 'Republic World', tagline: 'Debates, headlines, and breaking news', url: 'https://www.youtube.com/@RepublicWorld/live', logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'in-zeemusic', name: 'Zee Music Company', tagline: 'Latest Bollywood hit songs and music videos', url: 'https://www.youtube.com/@zeemusiccompany', logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80', badge: 'Music' },
        ],
      },
    ],
  },
  {
    regionId: 'north-america',
    regionName: 'North America (USA & Canada)',
    countries: [
      {
        country: 'United States',
        flag: '🇺🇸',
        channels: [
          { id: 'us-abc', name: 'ABC News', tagline: '24/7 breaking news and live video coverage', url: 'https://www.youtube.com/@ABCNews/live', logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'us-cbs', name: 'CBS News', tagline: 'National news, reports, and documentaries', url: 'https://www.youtube.com/@CBSNews/live', logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'us-nbc', name: 'NBC News NOW', tagline: 'Streaming news network and live reports', url: 'https://www.youtube.com/@NBCNews/live', logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'us-pluto-movies', name: 'Pluto TV Movies', tagline: 'Free 24/7 cinema, action & drama movies', url: 'https://pluto.tv', logo: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=150&q=80', badge: 'Movies' },
          { id: 'us-filmrise', name: 'FilmRise Free Movies', tagline: 'Free hit Hollywood movies and television series', url: 'https://www.youtube.com/@FilmRise', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=150&q=80', badge: 'Movies' },
          { id: 'us-popcornflix', name: 'Popcornflix', tagline: 'Free feature-length movies and sitcoms', url: 'https://www.youtube.com/@Popcornflix', logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=150&q=80', badge: 'Movies' },
          { id: 'us-nasa', name: 'NASA TV', tagline: 'Space missions, rocket launches, and earth views', url: 'https://www.youtube.com/@NASA/live', logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=150&q=80', badge: 'Space' },
          { id: 'us-redbull', name: 'Red Bull TV', tagline: 'Extreme sports, music festivals, and adventure', url: 'https://www.youtube.com/@RedBull/live', logo: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=150&q=80', badge: 'Sports' },
          { id: 'us-jimmyfallon', name: 'The Tonight Show', tagline: 'Late night comedy sketches and celebrity guests', url: 'https://www.youtube.com/@FallonTonight', logo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80', badge: 'Comedy' },
          { id: 'us-warner', name: 'Warner Bros. Pictures', tagline: 'Hollywood movie trailers and previews', url: 'https://www.youtube.com/@WarnerBrosPictures', logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80', badge: 'Trailers' },
        ],
      },
      {
        country: 'Canada',
        flag: '🇨🇦',
        channels: [
          { id: 'ca-cbc', name: 'CBC News', tagline: 'Canadian headlines, politics, and documentaries', url: 'https://www.youtube.com/@CBCNews/live', logo: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'ca-global', name: 'Global News', tagline: 'Breaking news and investigative reporting', url: 'https://www.youtube.com/@globalnews/live', logo: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'ca-cp24', name: 'CP24 Toronto', tagline: 'Local Toronto breaking news and traffic', url: 'https://www.youtube.com/@cp24/live', logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=150&q=80', badge: 'Local' },
          { id: 'ca-tsn', name: 'TSN Sports', tagline: 'Sports highlights and live analysis', url: 'https://www.youtube.com/@TSN_Official', logo: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=150&q=80', badge: 'Sports' },
          { id: 'ca-etcanada', name: 'ET Canada', tagline: 'Celebrity news and entertainment gossip', url: 'https://www.youtube.com/@ETCanada', logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=150&q=80', badge: 'Gossip' },
          { id: 'ca-tvokids', name: 'TVOkids', tagline: 'Educational shows and children programs', url: 'https://www.youtube.com/@TVOkids', logo: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=150&q=80', badge: 'Kids' },
          { id: 'ca-montreal', name: 'CityNews Montreal', tagline: 'Quebec and Montreal local updates', url: 'https://www.youtube.com/@CityNewsMTL', logo: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'ca-cbc-music', name: 'CBC Music', tagline: 'Canadian artists and live concert sessions', url: 'https://www.youtube.com/@CBCMusic', logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80', badge: 'Music' },
          { id: 'ca-food', name: 'Food Network Canada', tagline: 'Recipe guides and cooking show clips', url: 'https://www.youtube.com/@FoodNetworkCanada', logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80', badge: 'Food' },
          { id: 'ca-discovery', name: 'Discovery Canada', tagline: 'Science, nature, and survival shows', url: 'https://www.youtube.com/@DiscoveryCanada', logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=150&q=80', badge: 'Docu' },
        ],
      },
    ],
  },
  {
    regionId: 'europe',
    regionName: 'Europe (UK, France, Russia, Germany)',
    countries: [
      {
        country: 'United Kingdom',
        flag: '🇬🇧',
        channels: [
          { id: 'uk-skynews', name: 'Sky News', tagline: 'Breaking stories from London and around the world', url: 'https://www.youtube.com/@skynews/live', logo: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'uk-bbcnews', name: 'BBC News Channel', tagline: 'Trusted international journalism and live reports', url: 'https://www.youtube.com/@BBCNews/live', logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'uk-film4', name: 'Film4 Cinema', tagline: 'British cinematic trailers and independent movies', url: 'https://www.youtube.com/@Film4', logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=150&q=80', badge: 'Movies' },
          { id: 'uk-channel4', name: 'Channel 4', tagline: 'British comedy, drama, and documentaries', url: 'https://www.youtube.com/@Channel4', logo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=150&q=80', badge: 'Entertainment' },
          { id: 'uk-itv', name: 'ITV News', tagline: 'UK regional and national live news', url: 'https://www.youtube.com/@itvnews/live', logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'uk-bbcearth', name: 'BBC Earth', tagline: 'Nature documentaries and wildlife wonders', url: 'https://www.youtube.com/@BBCEarth', logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=150&q=80', badge: 'Nature' },
          { id: 'uk-gordon', name: 'Gordon Ramsay', tagline: 'Culinary masterclasses and cooking shows', url: 'https://www.youtube.com/@GordonRamsay', logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80', badge: 'Food' },
          { id: 'uk-royal', name: 'The Royal Family', tagline: 'Official updates from Buckingham Palace', url: 'https://www.youtube.com/@TheRoyalFamily', logo: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=150&q=80', badge: 'Royal' },
          { id: 'uk-bbccomedy', name: 'BBC Comedy', tagline: 'Classic British stand-up and sitcoms', url: 'https://www.youtube.com/@BBCComedy', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=150&q=80', badge: 'Comedy' },
          { id: 'uk-formula1', name: 'Formula 1', tagline: 'Grand Prix highlights and live race analysis', url: 'https://www.youtube.com/@Formula1', logo: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=150&q=80', badge: 'Sports' },
        ],
      },
      {
        country: 'France',
        flag: '🇫🇷',
        channels: [
          { id: 'fr-france24', name: 'France 24 English', tagline: 'French international news and debates 24/7', url: 'https://www.youtube.com/@FRANCE24English/live', logo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'fr-euronews', name: 'Euronews', tagline: 'European multilingual news and current affairs', url: 'https://www.youtube.com/@euronews/live', logo: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'fr-francetv', name: 'France.tv Cinema', tagline: 'French free movies, series & cultural programs', url: 'https://www.youtube.com/@francetv', logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=150&q=80', badge: 'Movies' },
          { id: 'fr-arte', name: 'ARTE Cinema', tagline: 'European arthouse movies and cultural documentaries', url: 'https://www.youtube.com/@ARTEplus7', logo: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=150&q=80', badge: 'Arthouse' },
          { id: 'fr-tv5monde', name: 'TV5MONDE', tagline: 'Global French entertainment, films & variety shows', url: 'https://www.youtube.com/@TV5MONDE', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=150&q=80', badge: 'Entertainment' },
          { id: 'fr-pathe', name: 'Pathé Films', tagline: 'French cinematic masterpieces and new trailers', url: 'https://www.youtube.com/@pathe', logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80', badge: 'Cinema' },
          { id: 'fr-m6', name: 'M6 Entertainment', tagline: 'French reality shows, comedy and series', url: 'https://www.youtube.com/@m6', logo: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=150&q=80', badge: 'Shows' },
          { id: 'fr-bfmtv', name: 'BFMTV Live', tagline: 'France continuous live news and debates', url: 'https://www.youtube.com/@BFMTV/live', logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=150&q=80', badge: 'Live News' },
          { id: 'fr-cnews', name: 'CNews Live', tagline: 'French political debate and breaking headlines', url: 'https://www.youtube.com/@CNEWS/live', logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=150&q=80', badge: 'Live News' },
          { id: 'fr-gaumont', name: 'Gaumont Classic', tagline: 'Historic French cinema and comedy trailers', url: 'https://www.youtube.com/@Gaumont', logo: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=150&q=80', badge: 'Classic' },
        ],
      },
      {
        country: 'Russia',
        flag: '🇷🇺',
        channels: [
          { id: 'ru-mosfilm', name: 'Mosfilm Cinema', tagline: 'Legendary Soviet and Russian classic movies', url: 'https://www.youtube.com/@Mosfilm_eng', logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=150&q=80', badge: 'Classic Movies' },
          { id: 'ru-fashiontv', name: 'Fashion TV Russia', tagline: 'Russian luxury fashion, runway shows, and glamour', url: 'https://www.fashiontv.com', logo: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=150&q=80', badge: 'Fashion 18+' },
          { id: 'ru-nightlife', name: 'Russian Nightlife & Club TV', tagline: 'Moscow club scene, music videos, and nightlife', url: 'https://wfc.tv', logo: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=150&q=80', badge: 'Glamour' },
          { id: 'ru-artcinema', name: 'Russian Arthouse & Mature', tagline: 'Uncensored indie cinema and festival films', url: 'https://www.youtube.com/@Mosfilm_eng', logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80', badge: 'Rated' },
          { id: 'ru-ctb', name: 'CTB Film Company', tagline: 'Russian blockbuster action and drama films', url: 'https://www.youtube.com/@CTBFilm', logo: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=150&q=80', badge: 'Blockbusters' },
          { id: 'ru-rt', name: 'RT News', tagline: 'Russian international live news and documentaries', url: 'https://www.youtube.com/@RT/live', logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=150&q=80', badge: 'Live News' },
          { id: 'ru-russia24', name: 'Russia 24', tagline: '24-hour Russian federal live broadcasting', url: 'https://www.youtube.com/@russia24/live', logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=150&q=80', badge: 'Live News' },
          { id: 'ru-sts', name: 'STS Entertainment', tagline: 'Russian comedy series, sitcoms, and shows', url: 'https://www.youtube.com/@tvsts', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=150&q=80', badge: 'Comedy' },
          { id: 'ru-tnt', name: 'TNT Russia', tagline: 'Popular reality TV and comedy shows', url: 'https://www.youtube.com/@tnt_online', logo: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=150&q=80', badge: 'Reality' },
          { id: 'ru-ntv', name: 'NTV Russia', tagline: 'Russian dramatic series and investigative reports', url: 'https://www.youtube.com/@ntv', logo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=150&q=80', badge: 'Dramas' },
        ],
      },
      {
        country: 'Germany',
        flag: '🇩🇪',
        channels: [
          { id: 'de-dw', name: 'DW News', tagline: 'European perspective on global news & culture', url: 'https://www.youtube.com/@dwenglish/live', logo: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=150&q=80', badge: 'Germany' },
          { id: 'de-zdf', name: 'ZDF heute', tagline: 'German public broadcasting news and reports', url: 'https://www.youtube.com/@zdfheute/live', logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'de-ard', name: 'ARD Tagesschau', tagline: 'Germany’s primary daily news broadcast', url: 'https://www.youtube.com/@tagesschau/live', logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'de-netflix', name: 'Netflix Deutschland', tagline: 'German movie trailers and original series', url: 'https://www.youtube.com/@NetflixDE', logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=150&q=80', badge: 'Movies' },
          { id: 'de-prosieben', name: 'ProSieben', tagline: 'German entertainment, movies and comedy', url: 'https://www.youtube.com/@ProSieben', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=150&q=80', badge: 'Shows' },
          { id: 'de-bravoscreen', name: 'Constantin Film', tagline: 'German cinema blockbusters and trailers', url: 'https://www.youtube.com/@ConstantinFilm', logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80', badge: 'Cinema' },
          { id: 'de-funk', name: 'funk (ARD/ZDF)', tagline: 'Young German web series, comedy and docs', url: 'https://www.youtube.com/@funk', logo: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=150&q=80', badge: 'Youth' },
          { id: 'de-bunte', name: 'BUNTE TV', tagline: 'German celebrity news and fashion highlights', url: 'https://www.youtube.com/@BUNTE', logo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=150&q=80', badge: 'Lifestyle' },
          { id: 'de-sport1', name: 'Sport1', tagline: 'German sports talk and football highlights', url: 'https://www.youtube.com/@SPORT1', logo: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=150&q=80', badge: 'Sports' },
          { id: 'de-mtvgermany', name: 'MTV Germany', tagline: 'Music videos, charts and pop culture', url: 'https://www.youtube.com/@MTVGermany', logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80', badge: 'Music' },
        ],
      },
    ],
  },
  {
    regionId: 'asia-pacific',
    regionName: 'Asia-Pacific (Japan, Korea, Singapore)',
    countries: [
      {
        country: 'Japan',
        flag: '🇯🇵',
        channels: [
          { id: 'jp-nhk', name: 'NHK WORLD-JAPAN', tagline: 'English live news, tech, and Japanese culture', url: 'https://www.youtube.com/@nhkworld', logo: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=150&q=80', badge: 'Japan' },
          { id: 'jp-ann', name: 'ANN News Live', tagline: 'Japanese domestic and regional breaking news', url: 'https://www.youtube.com/@ANNnewsCH/live', logo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=150&q=80', badge: 'Live' },
          { id: 'jp-pokemon', name: 'The Official Pokémon Channel', tagline: 'Anime episodes, trailers, and gaming updates', url: 'https://www.youtube.com/@Pokemon', logo: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=150&q=80', badge: 'Anime' },
          { id: 'jp-crunchyroll', name: 'Crunchyroll', tagline: 'Subbed and dubbed anime series', url: 'https://www.youtube.com/@Crunchyroll', logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=150&q=80', badge: 'Anime' },
          { id: 'jp-sony', name: 'Sony Music Japan', tagline: 'J-pop hits and anime theme songs', url: 'https://www.youtube.com/@sonymusicjapan', logo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80', badge: 'Music' },
          { id: 'jp-thefirsttake', name: 'THE FIRST TAKE', tagline: 'One-take live music performances by Asian artists', url: 'https://www.youtube.com/@THEFIRSTTAKE', logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80', badge: 'Music' },
          { id: 'jp-tbs', name: 'TBS Animation', tagline: 'Japanese drama and anime trailers', url: 'https://www.youtube.com/@TBSAnimation', logo: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=150&q=80', badge: 'Drama' },
          { id: 'jp-fnn', name: 'FNN News Live', tagline: 'Fuji News Network 24/7 Japanese reports', url: 'https://www.youtube.com/@FNN_news/live', logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=150&q=80', badge: 'Live News' },
          { id: 'jp-jaxa', name: 'JAXA Channel', tagline: 'Japanese space agency rocket launches', url: 'https://www.youtube.com/@jaxachannel', logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=150&q=80', badge: 'Space' },
          { id: 'jp-tokyo', name: 'Tokyo Creative', tagline: 'Travel vlogs and Japanese lifestyle', url: 'https://www.youtube.com/@TokyoCreative', logo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=150&q=80', badge: 'Travel' },
        ],
      },
      {
        country: 'South Korea',
        flag: '🇰🇷',
        channels: [
          { id: 'kr-arirang', name: 'Arirang TV', tagline: 'K-pop culture, travel, and global news', url: 'https://www.youtube.com/@arirangworld/live', logo: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=150&q=80', badge: 'Korea' },
          { id: 'kr-ytn', name: 'YTN Live News', tagline: '24-hour South Korean live news broadcast', url: 'https://www.youtube.com/@ytn24/live', logo: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'kr-kbs', name: 'KBS World TV', tagline: 'Korean dramas, variety shows, and K-pop', url: 'https://www.youtube.com/@KBSWorld', logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=150&q=80', badge: 'Dramas' },
          { id: 'kr-sbs', name: 'SBS Entertainment', tagline: 'Running Man and Korean variety shows', url: 'https://www.youtube.com/@SBSEntertainment', logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=150&q=80', badge: 'Variety' },
          { id: 'kr-mnet', name: 'Mnet K-POP', tagline: 'K-pop music awards, music shows, and debuts', url: 'https://www.youtube.com/@Mnet', logo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80', badge: 'K-Pop' },
          { id: 'kr-hybe', name: 'HYBE LABELS', tagline: 'BTS, TXT, and global music videos', url: 'https://www.youtube.com/@HYBE_LABELS', logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80', badge: 'Music' },
          { id: 'kr-smentertainment', name: 'SM Entertainment', tagline: 'EXO, NCT, aespa music videos', url: 'https://www.youtube.com/@SMTOWN', logo: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=150&q=80', badge: 'Music' },
          { id: 'kr-jtbc', name: 'JTBC Drama', tagline: 'Popular Korean drama series and clips', url: 'https://www.youtube.com/@jtbcdrama', logo: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=150&q=80', badge: 'Dramas' },
          { id: 'kr-tvn', name: 'tvN Drama', tagline: 'Hit tvN series, romantic comedies, and thrillers', url: 'https://www.youtube.com/@tvNDrama', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=150&q=80', badge: 'Dramas' },
          { id: 'kr-mbc', name: 'MBC Drama', tagline: 'Historic Korean dramas and entertainment', url: 'https://www.youtube.com/@MBCdrama', logo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=150&q=80', badge: 'Classic' },
        ],
      },
    ],
  },
  {
    regionId: 'middle-east-latam',
    regionName: 'Middle East & Latin America',
    countries: [
      {
        country: 'UAE / MENA',
        flag: '🇦🇪',
        channels: [
          { id: 'ae-alarabiya', name: 'Al Arabiya', tagline: 'Leading 24/7 Arabic news and current affairs', url: 'https://www.youtube.com/@AlArabiya/live', logo: 'https://images.unsplash.com/photo-1578836537282-3171d77f8632?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'qa-aljazeera', name: 'Al Jazeera English', tagline: 'Middle Eastern and international live journalism', url: 'https://www.youtube.com/@AlJazeeraEnglish/live', logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=150&q=80', badge: 'Global' },
          { id: 'ae-dubai', name: 'Dubai TV', tagline: 'UAE entertainment, series and cultural shows', url: 'https://www.youtube.com/@DubaiTV', logo: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=150&q=80', badge: 'Entertainment' },
          { id: 'ae-skynewsarabia', name: 'Sky News Arabia', tagline: 'Arabic live news and regional reports', url: 'https://www.youtube.com/@skynewsarabia/live', logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=150&q=80', badge: 'Live News' },
          { id: 'ae-sharjah', name: 'Sharjah TV', tagline: 'Traditional UAE arts and cultural broadcasting', url: 'https://www.youtube.com/@SharjahTV', logo: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=150&q=80', badge: 'Culture' },
          { id: 'ae-mbcgroup', name: 'MBC Group', tagline: 'Middle East blockbuster series and talent shows', url: 'https://www.youtube.com/@MBCTheVoice', logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=150&q=80', badge: 'Hits' },
          { id: 'ae-rotana', name: 'Rotana Music', tagline: 'Top Arabic music videos and concert hits', url: 'https://www.youtube.com/@Rotana', logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80', badge: 'Music' },
          { id: 'ae-abudhabi', name: 'Abu Dhabi TV', tagline: 'Emirati drama series and documentary features', url: 'https://www.youtube.com/@AbuDhabiTV', logo: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=150&q=80', badge: 'Dramas' },
          { id: 'ae-iqraa', name: 'Iqraa TV', tagline: 'Family values and cultural programs', url: 'https://www.youtube.com/@IqraaChannel', logo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=150&q=80', badge: 'Family' },
          { id: 'ae-riyadh', name: 'Saudi TV', tagline: 'Official Saudi broadcasting network', url: 'https://www.youtube.com/@SaudiTV', logo: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=150&q=80', badge: 'Saudi' },
        ],
      },
      {
        country: 'Brazil',
        flag: '🇧🇷',
        channels: [
          { id: 'br-cnn', name: 'CNN Brasil', tagline: 'Brazilian news, economy, and culture', url: 'https://www.youtube.com/@CNNBrasil/live', logo: 'https://images.unsplash.com/photo-1483450388369-9ed8bb7987fc?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'br-globo', name: 'TV Globo', tagline: 'Brazil’s biggest telenovelas and entertainment', url: 'https://www.youtube.com/@tvglobo', logo: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=150&q=80', badge: 'Dramas' },
          { id: 'br-record', name: 'Record TV', tagline: 'Brazilian series, news, and reality shows', url: 'https://www.youtube.com/@recordtv', logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=150&q=80', badge: 'Shows' },
          { id: 'br-sbt', name: 'SBT Online', tagline: 'Family variety shows and classic game shows', url: 'https://www.youtube.com/@sbt', logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=150&q=80', badge: 'Variety' },
          { id: 'br-band', name: 'Band Jornalismo', tagline: 'Brazilian sports, news and debate live', url: 'https://www.youtube.com/@bandjornalismo/live', logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=150&q=80', badge: 'Live' },
          { id: 'br-kondzilla', name: 'KondZilla', tagline: 'World’s biggest funk music video channel', url: 'https://www.youtube.com/@KondZilla', logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80', badge: 'Music' },
          { id: 'br-multishow', name: 'Multishow', tagline: 'Brazilian music festivals and reality entertainment', url: 'https://www.youtube.com/@multishow', logo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80', badge: 'Music' },
          { id: 'br-metropoles', name: 'Metrópoles', tagline: 'Brasilia breaking news and culture', url: 'https://www.youtube.com/@MetropolesOficial', logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=150&q=80', badge: 'News' },
          { id: 'br-jovempan', name: 'Jovem Pan News', tagline: '24/7 Brazilian political talk and news', url: 'https://www.youtube.com/@jovempannews/live', logo: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=150&q=80', badge: 'Live News' },
          { id: 'br-mauricio', name: 'Turma da Mônica', tagline: 'Classic Brazilian animated cartoons for family', url: 'https://www.youtube.com/@TurmadaMonica', logo: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=150&q=80', badge: 'Animation' },
        ],
      },
    ],
  },
];

const DEFAULT_ENTERTAINMENT_ITEMS: EntertainmentItem[] = [
  {
    id: 'ent-plutotv',
    name: 'Pluto TV',
    tagline: 'Free Live TV & 100s of free movies',
    category: 'Movies & Dramas',
    logo: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=150&q=80',
    url: 'https://pluto.tv',
    description: 'Watch free streaming television and movies without any subscription required.',
    badge: 'Free Live',
    region: 'US / Global',
  },
  {
    id: 'ent-tubitv',
    name: 'Tubi TV',
    tagline: 'Free movies & TV shows on demand',
    category: 'Movies & Dramas',
    logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=150&q=80',
    url: 'https://tubitv.com',
    description: 'Watch thousands of hit movies and television series for free with ads.',
    badge: 'Free',
    region: 'US / Americas',
  },
  {
    id: 'ent-rakuten',
    name: 'Rakuten Viki',
    tagline: 'Asian dramas, movies, and K-pop shows',
    category: 'Movies & Dramas',
    logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=150&q=80',
    url: 'https://www.viki.com',
    description: 'Stream Asian dramas, Korean variety shows, Chinese series, and Japanese anime.',
    badge: 'Asia Hits',
    region: 'Asia / Global',
  },
  {
    id: 'ent-spotify',
    name: 'Spotify Free',
    tagline: 'Millions of songs and global playlists',
    category: 'Music & Radio',
    logo: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=150&q=80',
    url: 'https://open.spotify.com',
    description: 'Listen to free music, top charts, curated albums, and global podcasts on demand.',
    badge: 'Music',
    region: 'Global',
  },
  {
    id: 'ent-twitch',
    name: 'Twitch',
    tagline: 'Live streaming for gamers and creators',
    category: 'Gaming & Live',
    logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80',
    url: 'https://www.twitch.tv',
    description: 'Watch live video game streams, esports tournaments, and creative broadcasts.',
    badge: 'Live',
    region: 'Global',
  },
  {
    id: 'ent-youtube',
    name: 'YouTube',
    tagline: 'Videos, music, vlogs, and global live broadcasts',
    category: 'Gaming & Live',
    logo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=150&q=80',
    url: 'https://www.youtube.com',
    description: 'Enjoy millions of videos, music tracks, shorts, and live creator streams worldwide.',
    badge: 'Popular',
    region: 'Global',
  },
];

export const LiveChannelsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- COMPACT SEARCH BAR DROPDOWN STATE ---
  const [selectedDirRegionId, setSelectedDirRegionId] = useState<string>('all-regions');
  const [selectedDirCountry, setSelectedDirCountry] = useState<string>('Internet');
  const [selectedDirChannelId, setSelectedDirChannelId] = useState<string>('net-youtube');

  // Custom added items state
  const [items, setItems] = useState<EntertainmentItem[]>(() => {
    try {
      const saved = localStorage.getItem('appgo_custom_entertainment');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...parsed, ...DEFAULT_ENTERTAINMENT_ITEMS];
      }
    } catch {}
    return DEFAULT_ENTERTAINMENT_ITEMS;
  });

  // Form state
  const [formName, setFormName] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formCategory, setFormCategory] = useState<EntertainmentItem['category']>('Movies & Dramas');
  const [formUrl, setFormUrl] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const categories = [
    'All',
    'Movies & Dramas',
    'Music & Radio',
    'News & Podcasts',
    'Gaming & Live',
    'Streaming Apps',
  ];

  // Get current region directory
  const currentRegionObj = useMemo(() => {
    return (
      COMPACT_GLOBAL_DIRECTORY.find((r) => r.regionId === selectedDirRegionId) ||
      COMPACT_GLOBAL_DIRECTORY[0]
    );
  }, [selectedDirRegionId]);

  // Countries in current region
  const currentCountries = currentRegionObj.countries;

  // Current country group
  const currentCountryGroup = useMemo(() => {
    return (
      currentCountries.find((c) => c.country === selectedDirCountry) ||
      currentCountries[0]
    );
  }, [currentCountries, selectedDirCountry]);

  // Channels in current country
  const currentCountryChannels = currentCountryGroup.channels;

  // Currently selected channel object
  const selectedChannelObj = useMemo(() => {
    return (
      currentCountryChannels.find((ch) => ch.id === selectedDirChannelId) ||
      currentCountryChannels[0]
    );
  }, [currentCountryChannels, selectedDirChannelId]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCat = activeCategory === 'All' || item.category === activeCategory;
      const matchesRegion =
        selectedRegion === 'All' ||
        (item.region && item.region.toLowerCase().includes(selectedRegion.toLowerCase()));
      const matchesQuery =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.region && item.region.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesRegion && matchesQuery;
    });
  }, [items, activeCategory, selectedRegion, searchQuery]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formUrl.trim()) return;

    const newItem: EntertainmentItem = {
      id: `custom-ent-${Date.now()}`,
      name: formName.trim(),
      tagline: formTagline.trim() || 'Custom Entertainment Portal',
      category: formCategory,
      logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80',
      url: formUrl.startsWith('http') ? formUrl : `https://${formUrl}`,
      description: formDesc.trim() || 'User added entertainment web link.',
      badge: 'Custom',
      region: 'Custom',
      isCustom: true,
    };

    const updated = [newItem, ...items];
    setItems(updated);
    try {
      const customOnly = updated.filter((i) => i.isCustom);
      localStorage.setItem('appgo_custom_entertainment', JSON.stringify(customOnly));
    } catch {}

    setFormName('');
    setFormTagline('');
    setFormUrl('');
    setFormDesc('');
    setIsAddModalOpen(false);
  };

  const handleDeleteCustom = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    try {
      const customOnly = updated.filter((i) => i.isCustom);
      localStorage.setItem('appgo_custom_entertainment', JSON.stringify(customOnly));
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              Global Entertainment & Live Channels Hub
            </span>
            <span className="text-[11px] text-slate-400">· All Regions, Internet Streams & Rated Contents</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Free Live TV, Shows, Movies & Global Apps
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition active:scale-[0.98] shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Link</span>
          </button>
        </div>
      </div>

      {/* --- COMPACT SEARCH / DIRECTORY BAR WITH ALL REGIONS, INTERNET & RATED CONTENTS --- */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 border border-indigo-500/30 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${selectedDirRegionId === 'rated-mature' ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-red-600/20 border-red-500/40 text-red-400'}`}>
              {selectedDirRegionId === 'rated-mature' ? <ShieldAlert className="w-4 h-4" /> : <Youtube className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                <span>Global Channel Quick Search Bar</span>
                {selectedDirRegionId === 'rated-mature' ? (
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    18+ Mature & Rated Contents
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                    Top 20 Worldwide Internet Channels
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-300">
                {selectedDirRegionId === 'rated-mature' ? 'Restricted access: Uncensored thriller, cult classics & midnight movie vaults.' : 'Select All Regions, Internet country, or Rated Contents for mature titles.'}
              </p>
            </div>
          </div>
        </div>

        {/* 3 Cascading Selectors in Search Bar layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* 1. Region Dropdown */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-indigo-300 mb-1">
              1. Region / Category
            </label>
            <select
              value={selectedDirRegionId}
              onChange={(e) => {
                const newRegId = e.target.value;
                setSelectedDirRegionId(newRegId);
                const reg = COMPACT_GLOBAL_DIRECTORY.find((r) => r.regionId === newRegId);
                if (reg && reg.countries.length > 0) {
                  const firstCountry = reg.countries[0];
                  setSelectedDirCountry(firstCountry.country);
                  if (firstCountry.channels.length > 0) {
                    setSelectedDirChannelId(firstCountry.channels[0].id);
                  }
                }
              }}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none focus:border-indigo-400"
            >
              {COMPACT_GLOBAL_DIRECTORY.map((reg) => (
                <option key={reg.regionId} value={reg.regionId}>
                  {reg.regionName}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Country Dropdown */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-indigo-300 mb-1">
              2. Subcategory ({currentCountries.length} available)
            </label>
            <select
              value={selectedDirCountry}
              onChange={(e) => {
                const newCountry = e.target.value;
                setSelectedDirCountry(newCountry);
                const cGrp = currentCountries.find((c) => c.country === newCountry);
                if (cGrp && cGrp.channels.length > 0) {
                  setSelectedDirChannelId(cGrp.channels[0].id);
                }
              }}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none focus:border-indigo-400"
            >
              {currentCountries.map((cGroup) => (
                <option key={cGroup.country} value={cGroup.country}>
                  {cGroup.flag} {cGroup.country}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Channel Dropdown */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-indigo-300 mb-1">
              3. Channel ({currentCountryChannels.length} channels)
            </label>
            <select
              value={selectedDirChannelId}
              onChange={(e) => setSelectedDirChannelId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none focus:border-indigo-400"
            >
              {currentCountryChannels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  📺 {ch.name} ({ch.badge || 'Live'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Channel Preview & Watch Button */}
        {selectedChannelObj && (
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-3">
              <img
                src={selectedChannelObj.logo}
                alt={selectedChannelObj.name}
                className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {selectedChannelObj.name}
                  </h4>
                  {selectedChannelObj.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${selectedDirRegionId === 'rated-mature' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                      {selectedChannelObj.badge}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400">
                    {currentCountryGroup?.flag} {currentCountryGroup?.country}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                  {selectedChannelObj.tagline}
                </p>
              </div>
            </div>

            <a
              href={selectedChannelObj.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition active:scale-[0.98] shrink-0 ${selectedDirRegionId === 'rated-mature' ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30' : 'bg-red-600 hover:bg-red-500 shadow-red-600/30'}`}
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Watch {selectedChannelObj.name}</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Entertainment Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750">
          <Globe className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No entertainment links found</h3>
          <p className="text-xs text-slate-500 mt-1">Try clearing your filters or add a custom streaming link.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750/80 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.logo}
                      alt={item.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {item.name}
                        </h3>
                        {item.badge && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            {item.badge}
                          </span>
                        )}
                        {item.region && (
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {item.region}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-medium">
                        {item.tagline}
                      </span>
                    </div>
                  </div>

                  {item.isCustom && (
                    <button
                      onClick={() => handleDeleteCustom(item.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition"
                      title="Delete custom link"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                  {item.category}
                </span>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm shadow-indigo-600/20 transition active:scale-[0.98]"
                >
                  <span>Launch Live Stream</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Custom Link Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Global Entertainment Link or App
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Platform / Channel Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free TV Channel or Radio Stream"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Live 24/7 News from Europe"
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as EntertainmentItem['category'])}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Movies & Dramas">Movies & Dramas</option>
                  <option value="Music & Radio">Music & Radio</option>
                  <option value="News & Podcasts">News & Podcasts</option>
                  <option value="Gaming & Live">Gaming & Live</option>
                  <option value="Streaming Apps">Streaming Apps</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Web URL / Stream Link *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition active:scale-[0.98]"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
