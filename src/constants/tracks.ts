export interface TrackMeta {
  city: string
  country: string
  description: string
}

export const TRACK_METADATA: Record<string, TrackMeta> = {
  'lake-placid': {
    city: 'Lake Placid',
    country: 'USA',
    description: 'Home of the 1932 and 1980 Winter Olympics. A gentle, wide track in the Adirondacks.',
  },
  calgary: {
    city: 'Calgary',
    country: 'Canada',
    description: 'The 1988 Olympic track. Smooth curves through the Canadian Rockies.',
  },
  vancouver: {
    city: 'Vancouver',
    country: 'Canada',
    description: 'The 2010 Olympic venue. Pacific breezes and flowing turns.',
  },
  nagano: {
    city: 'Nagano',
    country: 'Japan',
    description: 'The 1998 track through the Japanese Alps. Watch for the S-curves!',
  },
  'salt-lake-city': {
    city: 'Salt Lake City',
    country: 'USA',
    description: 'The 2002 Olympic course. High altitude means extra speed!',
  },
  turin: {
    city: 'Turin',
    country: 'Italy',
    description: 'The 2006 Italian track. Elegant curves in the shadow of the Alps.',
  },
  oslo: {
    city: 'Oslo',
    country: 'Norway',
    description: 'A Norwegian classic. Tight and technical through snowy forests.',
  },
  innsbruck: {
    city: 'Innsbruck',
    country: 'Austria',
    description: 'Two-time Olympic host. Alpine precision required!',
  },
  lillehammer: {
    city: 'Lillehammer',
    country: 'Norway',
    description: 'The 1994 fairy-tale track. Beautiful but demanding.',
  },
  chamonix: {
    city: 'Chamonix',
    country: 'France',
    description: 'The first Winter Olympics, 1924. A legendary mountain course.',
  },
  'st-moritz': {
    city: 'St. Moritz',
    country: 'Switzerland',
    description: 'The birthplace of bobsled racing. Ice and tradition since 1884.',
  },
  cortina: {
    city: "Cortina d'Ampezzo",
    country: 'Italy',
    description: 'The 2026 host! Narrow passages through the Dolomites.',
  },
  beijing: {
    city: 'Beijing',
    country: 'China',
    description: 'The 2022 track. Lightning-fast with tricky spirals.',
  },
  sochi: {
    city: 'Sochi',
    country: 'Russia',
    description: 'The 2014 subtropical ice run. Speed and precision at the edge.',
  },
  pyeongchang: {
    city: 'PyeongChang',
    country: 'South Korea',
    description: 'The 2018 course. Dragon-like twists at extreme speed.',
  },
}
