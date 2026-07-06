export interface Club {
  id: string;
  _id?: string;
  name: string;
  type: 'Initiative' | 'Organization' | 'Club';
  logo: string;
  description: string;
  aboutUs: string;
  glimpses: string[];
  tags: string[];
  foundedOn?: string;
  venue?: string;
  eventsConducted?: number;
  detailedDescription?: string;
  leadership?: any[];
}

export const fallbackClubs: Club[] = [
  {
    id: 'student-council-ju',
    name: 'Student Council JU',
    type: 'Organization',
    logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&h=150&fit=crop',
    description: 'The apex student body representing JU students, coordinating events, and driving student-led programs.',
    aboutUs: 'Student Council JU is the governing student organization dedicated to representing the voice, interests, and aspirations of the entire student body at JECRC University. We bridge the gap between students and administration, organize major fests, manage student-run resources, and champion academic and extracurricular excellence across campus.',
    glimpses: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&h=300&fit=crop'
    ],
    tags: ['Leadership', 'Fests', 'Student Representation']
  },
  {
    id: 'jecrc-incubation-centre',
    name: 'JECRC Incubation Centre',
    type: 'Initiative',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&h=150&fit=crop',
    description: 'Nurturing startups, fostering innovation, and building an entrepreneurial ecosystem on campus.',
    aboutUs: 'JECRC Incubation Centre (JIC) is a state-of-the-art startup incubator fostering young entrepreneurs and innovators. JIC provides seed funding, mentoring, industry connections, co-working space, and intellectual property support to student startups, paving the way for commercial success and social impact.',
    glimpses: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&h=300&fit=crop'
    ],
    tags: ['Startup', 'Incubation', 'Entrepreneurship', 'Funding']
  },
  {
    id: 'code-club',
    name: 'Code Club JU',
    type: 'Club',
    logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=150&fit=crop',
    description: 'The premier programming hub for competitive coding, hackathons, and technical workshops.',
    aboutUs: 'Code Club JU is a passionate community of developers, competitive programmers, and open-source contributors. We host weekly coding challenges, teach modern development stacks, mentor students for national hackathons, and organize workshops on AI/ML, WebDev, and Cyber Security.',
    glimpses: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=300&fit=crop'
    ],
    tags: ['Coding', 'Hackathons', 'Tech Workshops', 'Open Source']
  },
  {
    id: 'music-club',
    name: 'Music Club JU',
    type: 'Club',
    logo: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=150&h=150&fit=crop',
    description: 'Where melodies blend and beats collide. Organizing open mics, band wars, and acoustic sessions.',
    aboutUs: 'Music Club JU is a sanctuary for instrumentalists, vocalists, and music enthusiasts. From classical Indian rhythms to contemporary Western rock, we host regular jam sessions, open mics, and inter-collegiate band battles. Whether you want to perform or just listen, we have a spot for you.',
    glimpses: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=300&fit=crop'
    ],
    tags: ['Acoustic', 'Rock', 'Open Mics', 'Classical']
  },
  {
    id: 'dance-club',
    name: 'Dance Club JU',
    type: 'Club',
    logo: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&h=150&fit=crop',
    description: 'Expressing stories through movement. Specialized in hip-hop, classical, contemporary, and folk.',
    aboutUs: 'Dance Club JU brings energy, rhythm, and artistic storytelling to the campus. Bringing together dancers of all styles (Hip Hop, Bollywood, Contemporary, Classical, and Salsa), we perform at university ceremonies, choreograph flagship fests, and represent JECRC at national dance competitions.',
    glimpses: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1547153760-18fc86324498?w=500&h=300&fit=crop'
    ],
    tags: ['Choreography', 'Fests', 'Hip Hop', 'Classical']
  },
  {
    id: 'photography-club',
    name: 'Photography Club JU',
    type: 'Club',
    logo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150&h=150&fit=crop',
    description: 'Capturing moments, freeze-framing campus life, and running visual storytelling workshops.',
    aboutUs: 'Photography Club JU is a platform for shutterbugs, visual storytellers, and filmmakers. We cover all major university events, host photo walks across Jaipur, and teach the nuances of composition, lighting, camera settings, and post-processing in Photoshop/Lightroom.',
    glimpses: [
      'https://images.unsplash.com/photo-1452780212940-6f5c0d14d84a?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=500&h=300&fit=crop'
    ],
    tags: ['Photography', 'Videography', 'Workshops', 'Media Coverage']
  }
];
