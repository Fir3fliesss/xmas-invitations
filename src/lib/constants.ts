// ========================================
// EVENT INFORMATION
// ========================================

export const EVENT_INFO = {
  title: 'Celebrate Christmas',
  subtitle: 'Light Up Christmas With Christ',
  
  // Event datetime (WIB = UTC+7)
  date: new Date('2026-01-15T15:30:00+07:00'),
  openGate: '15:00',
  startTime: '15:30',
  timezone: 'WIB',
  
  // Location
  location: {
    name: 'GBI Jl. Tapos Cibinong',
    address: 'Jl. Tapos, Cibinong, Bogor, Jawa Barat',
    mapsUrl: 'https://maps.app.goo.gl/vv6r27VM2pWK6zQi6',
    // TODO: Update with actual embed URL if needed
    mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.0!2d106.8!3d-6.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzAnMDAuMCJTIDEwNsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890'
  },
  
  // Activities
  activities: ['Praise and Worship', 'Candle Light', 'Games'],
  
  // Gift
  giftMinimum: '20K',
  
  // RSVP Deadline
  rsvpDeadline: new Date('2025-12-31T23:59:59+07:00'),
  
  // Bible verse
  verse: {
    text: 'Maka Yesus berkata pula kepada orang banyak, kata-Nya: "Akulah terang dunia; barangsiapa mengikut Aku, ia tidak akan berjalan dalam kegelapan, melainkan ia akan mempunyai terang hidup."',
    reference: 'Yohanes 8:12'
  },
  
  // Social media
  instagram: '@rohkris_penus',

  // Contact
  contact: {
    name: 'Panitia',
    phone: '+62 859-6727-9063',
    whatsapp: 'https://wa.me/6285967279063'
  }
} as const;

// ========================================
// SCHOOLS
// ========================================

export const SCHOOLS = [
  { 
    value: 'penus', 
    label: 'SMK Plus Pelita Nusantara (Penus)',
    shortLabel: 'Penus'
  },
  { 
    value: 'pesat', 
    label: 'SMA Plus PGRI Cibinong (Pesat)',
    shortLabel: 'Pesat'
  },
  { 
    value: 'other', 
    label: 'Lainnya',
    shortLabel: 'Lainnya'
  }
] as const;

export type SchoolValue = typeof SCHOOLS[number]['value'];

// ========================================
// CLASSES BY SCHOOL
// Format: Tingkat.Jurusan-Rombel
// ========================================

// SMK Classes (Penus)
// TODO: Confirm jurusan yang ada di Penus
export const SMK_CLASSES = [
  // RPL (Rekayasa Perangkat Lunak)
  'X.RPL-1', 'X.RPL-2', 
  'XI.RPL-1', 'XI.RPL-2',
  'XII.RPL-1', 'XII.RPL-2', 'XII.RPL-3',
  
  // TKJ (Teknik Komputer dan Jaringan)
  'X.TKJ-1', 'X.TKJ-2',
  'XI.TKJ-1', 'XI.TKJ-2',
  'XII.TKJ-1', 'XII.TKJ-2', 'XII.TKJ-3',
  
  // DKV & MM (Desain Komunikasi Visual) & (Multimedia)
  'X.DKV-1', 'X.DKV-2', 'X.DKV-3', 'X.DKV-4',
  'XI.DKV-1', 'XI.DKV-2', 'XI.DKV-3', 'XI.DKV-4',
  'XII.MM-1', 'XII.MM-2', 'XII.MM-3', 'XII.MM-4',
  
  // LPB & PKM (Layanan Perbankan) & (Perbankan Keuangan Mikro)
  'X.LPB-1', 'X.LPB-2',
  'XI.LPB-1', 'XI.LPB-2',
  'XII.PKM-1', 'XII.PKM-2',
  
  // TOI (Teknik Otomasi Industri)
  'X.TOI-1',
  
  'Lainnya'
] as const;

// SMA Classes (Pesat)
export const SMA_CLASSES = [
  // IPA
  'X.IPA-1', 'X.IPA-2',
  'XI.IPA-1', 'XI.IPA-2',
  'XII.IPA-1', 'XII.IPA-2',
  
  // IPS
  'X.IPS-1', 'X.IPS-2',
  'XI.IPS-1', 'XI.IPS-2',
  'XII.IPS-1', 'XII.IPS-2',
  
  'Lainnya'
] as const;

// Get classes based on school
export function getClassesBySchool(school: SchoolValue): readonly string[] {
  switch (school) {
    case 'penus':
      return SMK_CLASSES;
    case 'pesat':
      return SMA_CLASSES;
    default:
      return ['Lainnya'];
  }
}

// ========================================
// ATTENDANCE STATUS
// ========================================

export const ATTENDANCE_STATUS = {
  ATTENDING: true,
  NOT_ATTENDING: false
} as const;

// ========================================
// LOCAL STORAGE KEYS
// ========================================

export const STORAGE_KEYS = {
  RSVP_DATA: 'christmas_rsvp_data',
  ADMIN_TOKEN: 'christmas_admin_token'
} as const;

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface RSVPData {
  id?: string;
  name: string;
  school: string;
  schoolOther?: string;
  class: string;
  classOther?: string;
  isAttending: boolean;
  reason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoredRSVPData extends RSVPData {
  submittedAt: string;
}
