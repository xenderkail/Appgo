export interface GlobalChannelItem {
  id: string;
  name: string;
  region: string;
  flag: string;
  category: 'News' | 'Entertainment' | 'Movies' | 'Sports' | 'Music' | 'Tech & Nature';
  tagline: string;
  url: string;
  badge?: string;
}

export const GLOBAL_CHANNELS_LIST: GlobalChannelItem[] = [
  // --- 🌐 GLOBAL STREAMING & TECH ---
  { id: 'gc-youtube', name: 'YouTube Global', region: 'Global', flag: '🌐', category: 'Entertainment', tagline: 'Videos, music, and worldwide live streams', url: 'https://www.youtube.com', badge: 'Popular' },
  { id: 'gc-twitch', name: 'Twitch', region: 'Global', flag: '🌐', category: 'Entertainment', tagline: 'Gaming, esports, and interactive live creator streams', url: 'https://www.twitch.tv', badge: 'Gaming' },
  { id: 'gc-netflix', name: 'Netflix', region: 'Global', flag: '🌐', category: 'Movies', tagline: 'Official movie trailers, series previews, and originals', url: 'https://www.youtube.com/@Netflix', badge: 'Cinema' },
  { id: 'gc-crunchyroll', name: 'Crunchyroll', region: 'Global', flag: '🌐', category: 'Entertainment', tagline: 'Anime episodes, premiere simulcasts, and trailers', url: 'https://www.crunchyroll.com', badge: 'Anime' },
  { id: 'gc-nasa', name: 'NASA Live TV', region: 'Global', flag: '🚀', category: 'Tech & Nature', tagline: 'Earth from orbit, rocket launches, and space walks', url: 'https://www.youtube.com/@NASA/live', badge: 'Space 4K' },
  { id: 'gc-redbull', name: 'Red Bull TV', region: 'Global', flag: '⚡', category: 'Sports', tagline: 'Extreme sports, cliff diving, F1 racing, and festivals', url: 'https://www.redbull.com', badge: 'Action' },
  { id: 'gc-ted', name: 'TED Talks', region: 'Global', flag: '💡', category: 'Tech & Nature', tagline: 'Ideas worth spreading from innovators and thinkers', url: 'https://www.youtube.com/@TED', badge: 'Ideas' },
  { id: 'gc-ign', name: 'IGN', region: 'Global', flag: '🎮', category: 'Entertainment', tagline: 'Game reviews, movie trailers, gameplay, and walkthroughs', url: 'https://www.youtube.com/@IGN', badge: 'Gaming' },
  { id: 'gc-vevo', name: 'VEVO Music', region: 'Global', flag: '🎵', category: 'Music', tagline: 'Top official music video premieres and live sessions', url: 'https://www.youtube.com/@VEVO', badge: 'Hits' },
  { id: 'gc-billboard', name: 'Billboard', region: 'Global', flag: '🎶', category: 'Music', tagline: 'Hot 100 charts, artist interviews, and awards coverage', url: 'https://www.youtube.com/@Billboard', badge: 'Charts' },
  { id: 'gc-boilerroom', name: 'Boiler Room', region: 'Global', flag: '🎧', category: 'Music', tagline: 'Underground DJ sets, electronic music, and club sessions', url: 'https://www.youtube.com/@BoilerRoom', badge: 'DJ Sets' },
  { id: 'gc-fashiontv', name: 'Fashion TV', region: 'Global', flag: '✨', category: 'Entertainment', tagline: 'High fashion runway shows, supermodels, and luxury', url: 'https://www.fashiontv.com', badge: 'Fashion' },
  { id: 'gc-worldfashion', name: 'World Fashion Channel', region: 'Global', flag: '💎', category: 'Entertainment', tagline: 'Designer showcases, couture, and red carpet interviews', url: 'https://wfc.tv', badge: 'Style' },
  { id: 'gc-clubbing', name: 'Clubbing TV', region: 'Global', flag: '🪩', category: 'Music', tagline: 'Global dance music festivals and premier DJ club events', url: 'https://www.clubbingtv.com', badge: 'Dance' },
  { id: 'gc-pitchfork', name: 'Pitchfork', region: 'Global', flag: '🎸', category: 'Music', tagline: 'Independent music reviews, interviews, and live sets', url: 'https://www.youtube.com/@Pitchfork', badge: 'Indie' },
  { id: 'gc-warner', name: 'Warner Bros. Pictures', region: 'Global', flag: '🎬', category: 'Movies', tagline: 'Blockbuster Hollywood films and official teaser trailers', url: 'https://www.youtube.com/@WarnerBrosPictures', badge: 'Trailers' },
  { id: 'gc-sony', name: 'Sony Pictures', region: 'Global', flag: '🍿', category: 'Movies', tagline: 'Cinema previews, behind-the-scenes, and announcements', url: 'https://www.youtube.com/@SonyPictures', badge: 'Movies' },
  { id: 'gc-universal', name: 'Universal Pictures', region: 'Global', flag: '📽️', category: 'Movies', tagline: 'Feature releases, animated hits, and movie clips', url: 'https://www.youtube.com/@UniversalPictures', badge: 'Cinema' },
  { id: 'gc-paramount', name: 'Paramount Pictures', region: 'Global', flag: '🏔️', category: 'Movies', tagline: 'Blockbusters, classic franchises, and new releases', url: 'https://www.youtube.com/@ParamountPictures', badge: 'Movies' },
  { id: 'gc-marvel', name: 'Marvel Entertainment', region: 'Global', flag: '🦸', category: 'Movies', tagline: 'MCU superhero trailers, comic series, and games', url: 'https://www.youtube.com/@Marvel', badge: 'Marvel' },

  // --- 🇬🇧 UNITED KINGDOM & EUROPE ---
  { id: 'gc-bbcnews', name: 'BBC News', region: 'UK', flag: '🇬🇧', category: 'News', tagline: 'Trusted international journalism and 24/7 breaking updates', url: 'https://www.youtube.com/@BBCNews/live', badge: 'Live News' },
  { id: 'gc-skynews', name: 'Sky News', region: 'UK', flag: '🇬🇧', category: 'News', tagline: 'Breaking news from London and around the world', url: 'https://www.youtube.com/@skynews/live', badge: 'Live News' },
  { id: 'gc-itvnews', name: 'ITV News', region: 'UK', flag: '🇬🇧', category: 'News', tagline: 'British national and global news bulletins', url: 'https://www.youtube.com/@itvnews/live', badge: 'News' },
  { id: 'gc-channel4', name: 'Channel 4', region: 'UK', flag: '🇬🇧', category: 'Entertainment', tagline: 'British comedy, investigative documentaries, and drama', url: 'https://www.youtube.com/@Channel4', badge: 'UK TV' },
  { id: 'gc-film4', name: 'Film4 Cinema', region: 'UK', flag: '🇬🇧', category: 'Movies', tagline: 'British cinematic releases and classic independent films', url: 'https://www.youtube.com/@Film4', badge: 'Cinema' },
  { id: 'gc-bbcearth', name: 'BBC Earth', region: 'UK', flag: '🇬🇧', category: 'Tech & Nature', tagline: 'Spectacular wildlife wonders, oceans, and natural history', url: 'https://www.youtube.com/@BBCEarth', badge: 'Nature' },
  { id: 'gc-formula1', name: 'Formula 1', region: 'UK', flag: '🏎️', category: 'Sports', tagline: 'Grand Prix race highlights, paddock interviews, and analysis', url: 'https://www.youtube.com/@Formula1', badge: 'Racing' },
  { id: 'gc-france24', name: 'France 24 English', region: 'France', flag: '🇫🇷', category: 'News', tagline: '24/7 international news, debates, and cultural coverage', url: 'https://www.youtube.com/@FRANCE24English/live', badge: 'Live News' },
  { id: 'gc-france24-fr', name: 'France 24 Français', region: 'France', flag: '🇫🇷', category: 'News', tagline: 'Actualités internationales en continu et analyses', url: 'https://www.youtube.com/@FRANCE24/live', badge: 'Français' },
  { id: 'gc-euronews', name: 'Euronews', region: 'Europe', flag: '🇪🇺', category: 'News', tagline: 'European multilingual journalism and world headlines', url: 'https://www.youtube.com/@euronews/live', badge: 'Live News' },
  { id: 'gc-arte', name: 'ARTE Cinema', region: 'Europe', flag: '🇪🇺', category: 'Movies', tagline: 'European arthouse films, masterclasses, and documentaries', url: 'https://www.youtube.com/@ARTEplus7', badge: 'Arthouse' },
  { id: 'gc-tv5monde', name: 'TV5MONDE', region: 'France', flag: '🇫🇷', category: 'Entertainment', tagline: 'French entertainment, cinema, series, and cultural arts', url: 'https://www.youtube.com/@TV5MONDE', badge: 'Culture' },
  { id: 'gc-dw', name: 'DW News', region: 'Germany', flag: '🇩🇪', category: 'News', tagline: 'German international news and global investigative reports', url: 'https://www.youtube.com/@dwenglish/live', badge: 'Live News' },
  { id: 'gc-zdf', name: 'ZDF heute', region: 'Germany', flag: '🇩🇪', category: 'News', tagline: 'German public broadcasting news and in-depth reports', url: 'https://www.youtube.com/@zdfheute/live', badge: 'News' },
  { id: 'gc-tagesschau', name: 'ARD Tagesschau', region: 'Germany', flag: '🇩🇪', category: 'News', tagline: 'Germany’s premier daily news broadcast and live stream', url: 'https://www.youtube.com/@tagesschau/live', badge: 'News' },
  { id: 'gc-prosieben', name: 'ProSieben', region: 'Germany', flag: '🇩🇪', category: 'Entertainment', tagline: 'Popular German entertainment, reality shows, and sitcoms', url: 'https://www.youtube.com/@ProSieben', badge: 'Shows' },
  { id: 'gc-mosfilm', name: 'Mosfilm Cinema', region: 'Russia', flag: '🇷🇺', category: 'Movies', tagline: 'Legendary classic films, restored cinematic masterpieces', url: 'https://www.youtube.com/@Mosfilm_eng', badge: 'Classic' },
  { id: 'gc-rt', name: 'RT News', region: 'Russia', flag: '🇷🇺', category: 'News', tagline: 'International live news and investigative documentaries', url: 'https://www.youtube.com/@RT/live', badge: 'News' },
  { id: 'gc-russia24', name: 'Russia 24', region: 'Russia', flag: '🇷🇺', category: 'News', tagline: '24/7 continuous news and federal current affairs', url: 'https://www.youtube.com/@russia24/live', badge: 'Live' },

  // --- 🇺🇸 USA & CANADA ---
  { id: 'gc-cnn', name: 'CNN News', region: 'USA', flag: '🇺🇸', category: 'News', tagline: 'Breaking news, live analysis, and global field dispatches', url: 'https://edition.cnn.com', badge: 'Live News' },
  { id: 'gc-abc', name: 'ABC News', region: 'USA', flag: '🇺🇸', category: 'News', tagline: '24/7 national and world news with continuous video streams', url: 'https://www.youtube.com/@ABCNews/live', badge: 'Live News' },
  { id: 'gc-cbs', name: 'CBS News', region: 'USA', flag: '🇺🇸', category: 'News', tagline: 'In-depth national reporting, 60 Minutes, and documentaries', url: 'https://www.youtube.com/@CBSNews/live', badge: 'Live News' },
  { id: 'gc-nbc', name: 'NBC News NOW', region: 'USA', flag: '🇺🇸', category: 'News', tagline: 'Streaming news network with live breaking reporting', url: 'https://www.youtube.com/@NBCNews/live', badge: 'Live News' },
  { id: 'gc-bloomberg', name: 'Bloomberg TV', region: 'USA', flag: '📈', category: 'News', tagline: 'Global markets, business intelligence, Wall Street, and crypto', url: 'https://www.bloomberg.com/live', badge: 'Finance' },
  { id: 'gc-cnbc', name: 'CNBC', region: 'USA', flag: '💵', category: 'News', tagline: 'Real-time stock markets, technology earnings, and economy', url: 'https://www.cnbc.com/live-audio', badge: 'Business' },
  { id: 'gc-pluto', name: 'Pluto TV Movies', region: 'USA', flag: '🇺🇸', category: 'Movies', tagline: 'Free 24/7 Hollywood movies, action, comedy, and drama', url: 'https://pluto.tv', badge: 'Free Movies' },
  { id: 'gc-filmrise', name: 'FilmRise Free Cinema', region: 'USA', flag: '🇺🇸', category: 'Movies', tagline: 'Free hit movies, mystery series, and classic television', url: 'https://www.youtube.com/@FilmRise', badge: 'Movies' },
  { id: 'gc-popcornflix', name: 'Popcornflix', region: 'USA', flag: '🇺🇸', category: 'Movies', tagline: 'Feature-length movies, cult favorites, and comedies', url: 'https://www.youtube.com/@Popcornflix', badge: 'Movies' },
  { id: 'gc-cbc', name: 'CBC News', region: 'Canada', flag: '🇨🇦', category: 'News', tagline: 'Canadian headlines, politics, investigative reports, and docs', url: 'https://www.youtube.com/@CBCNews/live', badge: 'Canada' },
  { id: 'gc-globalnews', name: 'Global News Canada', region: 'Canada', flag: '🇨🇦', category: 'News', tagline: 'Breaking news bulletins and national Canadian affairs', url: 'https://www.youtube.com/@globalnews/live', badge: 'Live News' },
  { id: 'gc-cp24', name: 'CP24 Toronto', region: 'Canada', flag: '🇨🇦', category: 'News', tagline: 'Greater Toronto Area breaking news, weather, and traffic', url: 'https://www.youtube.com/@cp24/live', badge: 'Local' },
  { id: 'gc-tsn', name: 'TSN Sports', region: 'Canada', flag: '🇨🇦', category: 'Sports', tagline: 'Canadian hockey, basketball, football, and championship highlights', url: 'https://www.youtube.com/@TSN_Official', badge: 'Sports' },

  // --- 🇵🇰 PAKISTAN CHANNELS ---
  { id: 'gc-humtv', name: 'HUM TV', region: 'Pakistan', flag: '🇵🇰', category: 'Entertainment', tagline: 'Award-winning Pakistani drama serials, ost songs, and shows', url: 'https://www.youtube.com/@HUMTV', badge: 'Top Dramas' },
  { id: 'gc-arydigital', name: 'ARY Digital', region: 'Pakistan', flag: '🇵🇰', category: 'Entertainment', tagline: 'Blockbuster family serials, reality TV, and entertainment', url: 'https://www.youtube.com/@ARYDigitalPak', badge: 'Hits' },
  { id: 'gc-harpalgeo', name: 'Har Pal Geo', region: 'Pakistan', flag: '🇵🇰', category: 'Entertainment', tagline: 'Geo TV drama serials, telefilms, and primetime specials', url: 'https://www.youtube.com/@HarPalGeo', badge: 'Dramas' },
  { id: 'gc-humnews', name: 'Hum News', region: 'Pakistan', flag: '🇵🇰', category: 'News', tagline: '24/7 Pakistani breaking headlines, talk shows, and news', url: 'https://www.youtube.com/@HUMNewsPakistan/live', badge: 'Live News' },
  { id: 'gc-arynews', name: 'ARY News', region: 'Pakistan', flag: '🇵🇰', category: 'News', tagline: 'Pakistan’s leading 24-hour live breaking news channel', url: 'https://www.youtube.com/@arynews/live', badge: 'Live News' },
  { id: 'gc-samaa', name: 'Samaa TV', region: 'Pakistan', flag: '🇵🇰', category: 'News', tagline: 'Fast national news, talk shows, and current affairs analysis', url: 'https://www.youtube.com/@SamaaTV/live', badge: 'Live News' },
  { id: 'gc-dunyanews', name: 'Dunya News', region: 'Pakistan', flag: '🇵🇰', category: 'News', tagline: 'Breaking news, political analysis, and special broadcasts', url: 'https://www.youtube.com/@DunyaNews/live', badge: 'Live News' },
  { id: 'gc-expressent', name: 'Express Entertainment', region: 'Pakistan', flag: '🇵🇰', category: 'Entertainment', tagline: 'Family entertainment, drama serials, and lifestyle programming', url: 'https://www.youtube.com/@ExpressEntertainment', badge: 'Shows' },
  { id: 'gc-ptvhome', name: 'PTV Home', region: 'Pakistan', flag: '🇵🇰', category: 'Entertainment', tagline: 'National broadcaster classic dramas, music, and cultural series', url: 'https://www.youtube.com/@PTVHomeOfficial', badge: 'Classic' },
  { id: 'gc-bolent', name: 'BOL Entertainment', region: 'Pakistan', flag: '🇵🇰', category: 'Entertainment', tagline: 'Game shows, reality broadcasts, and comedy series', url: 'https://www.youtube.com/@BOLEntertainment', badge: 'Reality' },

  // --- 🇮🇳 INDIA CHANNELS ---
  { id: 'gc-sonysab', name: 'Sony SAB', region: 'India', flag: '🇮🇳', category: 'Entertainment', tagline: 'Family comedy serials, lighthearted drama, and sitcoms', url: 'https://www.youtube.com/@SonySAB', badge: 'Comedy' },
  { id: 'gc-starplus', name: 'Star Plus', region: 'India', flag: '🇮🇳', category: 'Entertainment', tagline: 'Top-rated Indian family serials, romance, and reality shows', url: 'https://www.youtube.com/@StarPlus', badge: 'Dramas' },
  { id: 'gc-zeetv', name: 'Zee TV', region: 'India', flag: '🇮🇳', category: 'Entertainment', tagline: 'Popular drama series, talent reality shows, and movie specials', url: 'https://www.youtube.com/@ZeeTV', badge: 'Hits' },
  { id: 'gc-colorstv', name: 'Colors TV', region: 'India', flag: '🇮🇳', category: 'Entertainment', tagline: 'Bigg Boss, reality TV, drama serials, and celebrity shows', url: 'https://www.youtube.com/@ColorsTV', badge: 'Reality' },
  { id: 'gc-tseries', name: 'T-Series', region: 'India', flag: '🇮🇳', category: 'Music', tagline: 'World’s most-subscribed music channel with Bollywood hits', url: 'https://www.youtube.com/@tseries', badge: 'Music #1' },
  { id: 'gc-goldmines', name: 'Goldmines Telefilms', region: 'India', flag: '🇮🇳', category: 'Movies', tagline: 'Blockbuster South Indian action movies dubbed in Hindi', url: 'https://www.youtube.com/@GoldminesTelefilms', badge: 'Movies' },
  { id: 'gc-aajtak', name: 'Aaj Tak', region: 'India', flag: '🇮🇳', category: 'News', tagline: 'India’s #1 live Hindi news channel, debates, and breaking news', url: 'https://www.youtube.com/@AajTak/live', badge: 'Live News' },
  { id: 'gc-ndtv', name: 'NDTV 24x7', region: 'India', flag: '🇮🇳', category: 'News', tagline: 'Trusted English news, analysis, and investigative journalism', url: 'https://www.youtube.com/@NDTV/live', badge: 'News' },
  { id: 'gc-republic', name: 'Republic World', region: 'India', flag: '🇮🇳', category: 'News', tagline: 'Prime debates, national headlines, and breaking reporting', url: 'https://www.youtube.com/@RepublicWorld/live', badge: 'News' },
  { id: 'gc-wion', name: 'WION Global News', region: 'India', flag: '🌏', category: 'News', tagline: 'South Asian perspective on global news and diplomacy', url: 'https://www.youtube.com/@WION/live', badge: 'World News' },
  { id: 'gc-zeemusic', name: 'Zee Music Company', region: 'India', flag: '🇮🇳', category: 'Music', tagline: 'Latest Bollywood hit music videos, lyrical tracks, and pop', url: 'https://www.youtube.com/@zeemusiccompany', badge: 'Music' },

  // --- 🌏 ASIA-PACIFIC (JAPAN, KOREA, SINGAPORE, AUSTRALIA) ---
  { id: 'gc-nhkworld', name: 'NHK WORLD-JAPAN', region: 'Japan', flag: '🇯🇵', category: 'News', tagline: 'Live English news, Japanese culture, tech, and travel', url: 'https://www.youtube.com/@nhkworld', badge: 'Japan Live' },
  { id: 'gc-annnews', name: 'ANN News Live', region: 'Japan', flag: '🇯🇵', category: 'News', tagline: 'Japanese national and regional breaking news stream', url: 'https://www.youtube.com/@ANNnewsCH/live', badge: 'Live' },
  { id: 'gc-pokemon', name: 'The Pokémon Channel', region: 'Japan', flag: '⚡', category: 'Entertainment', tagline: 'Official anime episodes, movie trailers, and gaming updates', url: 'https://www.youtube.com/@Pokemon', badge: 'Anime' },
  { id: 'gc-kbsworld', name: 'KBS World TV', region: 'Korea', flag: '🇰🇷', category: 'Entertainment', tagline: 'Korean dramas with subtitles, K-pop music bank, and shows', url: 'https://www.youtube.com/@kbsworldtv', badge: 'K-Drama' },
  { id: 'gc-arirang', name: 'Arirang TV Live', region: 'Korea', flag: '🇰🇷', category: 'News', tagline: 'Korean culture, K-Wave updates, and 24/7 world news', url: 'https://www.youtube.com/@ArirangCoKr/live', badge: 'Korea' },
  { id: 'gc-cna', name: 'CNA (Channel NewsAsia)', region: 'Singapore', flag: '🇸🇬', category: 'News', tagline: 'Asian business, ASEAN geopolitics, and international news', url: 'https://www.youtube.com/@channelnewsasia/live', badge: 'Asia News' },
  { id: 'gc-abcau', name: 'ABC News Australia', region: 'Australia', flag: '🇦🇺', category: 'News', tagline: 'Australian 24/7 breaking news, politics, and analysis', url: 'https://www.youtube.com/@abcnewsaustralia/live', badge: 'Australia' },
  { id: 'gc-skynewsau', name: 'Sky News Australia', region: 'Australia', flag: '🇦🇺', category: 'News', tagline: 'Australian national affairs, commentary, and live coverage', url: 'https://www.youtube.com/@SkyNewsAustralia/live', badge: 'News' },

  // --- 🌍 MIDDLE EAST & INTERNATIONAL ---
  { id: 'gc-aljazeera-en', name: 'Al Jazeera English', region: 'Middle East', flag: '🌍', category: 'News', tagline: 'Global south perspective on world news, human stories, and docs', url: 'https://www.aljazeera.com/live', badge: 'Live News' },
  { id: 'gc-aljazeera-ar', name: 'Al Jazeera Arabic', region: 'Middle East', flag: '🇶🇦', category: 'News', tagline: 'البث الحي لقناة الجزيرة الإخبارية على مدار الساعة', url: 'https://www.youtube.com/@aljazeera/live', badge: 'مباشر' },
  { id: 'gc-alarabiya', name: 'Al Arabiya News', region: 'Middle East', flag: '🇸🇦', category: 'News', tagline: 'Arabic and Middle East breaking news and geopolitical analysis', url: 'https://www.youtube.com/@AlArabiya/live', badge: 'News' },
  { id: 'gc-trtworld', name: 'TRT World', region: 'Turkey', flag: '🇹🇷', category: 'News', tagline: 'Turkish international news channel with global dispatches', url: 'https://www.youtube.com/@trtworld/live', badge: 'Live News' },
  { id: 'gc-cgtn', name: 'CGTN News', region: 'Global', flag: '🇨🇳', category: 'News', tagline: 'China Global Television Network live broadcasting and stories', url: 'https://www.youtube.com/@cgtn/live', badge: 'Live' },
];
