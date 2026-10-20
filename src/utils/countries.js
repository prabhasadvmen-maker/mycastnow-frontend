// [ISO-3166 alpha-2, name, dial code (digits only), min national digits, max national digits]
const RAW = [
  ['IN', 'India', '91', 10, 10],
  ['US', 'United States', '1', 10, 10],
  ['CA', 'Canada', '1', 10, 10],
  ['GB', 'United Kingdom', '44', 10, 10],
  ['AE', 'United Arab Emirates', '971', 8, 9],
  ['SA', 'Saudi Arabia', '966', 8, 9],
  ['QA', 'Qatar', '974', 8, 8],
  ['KW', 'Kuwait', '965', 8, 8],
  ['OM', 'Oman', '968', 8, 8],
  ['BH', 'Bahrain', '973', 8, 8],
  ['SG', 'Singapore', '65', 8, 8],
  ['MY', 'Malaysia', '60', 9, 10],
  ['AU', 'Australia', '61', 9, 9],
  ['NZ', 'New Zealand', '64', 8, 10],
  ['NP', 'Nepal', '977', 10, 10],
  ['BD', 'Bangladesh', '880', 10, 10],
  ['LK', 'Sri Lanka', '94', 9, 9],
  ['PK', 'Pakistan', '92', 10, 10],
  ['BT', 'Bhutan', '975', 8, 8],
  ['MV', 'Maldives', '960', 7, 7],
  ['AF', 'Afghanistan', '93', 9, 9],
  ['AL', 'Albania', '355', 8, 9],
  ['DZ', 'Algeria', '213', 9, 9],
  ['AR', 'Argentina', '54', 10, 11],
  ['AM', 'Armenia', '374', 8, 8],
  ['AT', 'Austria', '43', 10, 13],
  ['AZ', 'Azerbaijan', '994', 9, 9],
  ['BE', 'Belgium', '32', 8, 9],
  ['BO', 'Bolivia', '591', 8, 8],
  ['BA', 'Bosnia & Herzegovina', '387', 8, 9],
  ['BW', 'Botswana', '267', 7, 8],
  ['BR', 'Brazil', '55', 10, 11],
  ['BN', 'Brunei', '673', 7, 7],
  ['BG', 'Bulgaria', '359', 8, 9],
  ['KH', 'Cambodia', '855', 8, 9],
  ['CM', 'Cameroon', '237', 9, 9],
  ['CL', 'Chile', '56', 9, 9],
  ['CN', 'China', '86', 11, 11],
  ['CO', 'Colombia', '57', 10, 10],
  ['CR', 'Costa Rica', '506', 8, 8],
  ['HR', 'Croatia', '385', 8, 9],
  ['CY', 'Cyprus', '357', 8, 8],
  ['CZ', 'Czechia', '420', 9, 9],
  ['DK', 'Denmark', '45', 8, 8],
  ['DO', 'Dominican Republic', '1', 10, 10],
  ['EC', 'Ecuador', '593', 9, 9],
  ['EG', 'Egypt', '20', 10, 10],
  ['EE', 'Estonia', '372', 7, 8],
  ['ET', 'Ethiopia', '251', 9, 9],
  ['FJ', 'Fiji', '679', 7, 7],
  ['FI', 'Finland', '358', 9, 10],
  ['FR', 'France', '33', 9, 9],
  ['GE', 'Georgia', '995', 9, 9],
  ['DE', 'Germany', '49', 10, 11],
  ['GH', 'Ghana', '233', 9, 9],
  ['GR', 'Greece', '30', 10, 10],
  ['GT', 'Guatemala', '502', 8, 8],
  ['HK', 'Hong Kong', '852', 8, 8],
  ['HU', 'Hungary', '36', 9, 9],
  ['IS', 'Iceland', '354', 7, 7],
  ['ID', 'Indonesia', '62', 9, 12],
  ['IR', 'Iran', '98', 10, 10],
  ['IQ', 'Iraq', '964', 10, 10],
  ['IE', 'Ireland', '353', 9, 9],
  ['IL', 'Israel', '972', 9, 9],
  ['IT', 'Italy', '39', 9, 10],
  ['JM', 'Jamaica', '1', 10, 10],
  ['JP', 'Japan', '81', 10, 10],
  ['JO', 'Jordan', '962', 9, 9],
  ['KZ', 'Kazakhstan', '7', 10, 10],
  ['KE', 'Kenya', '254', 9, 9],
  ['KR', 'South Korea', '82', 9, 10],
  ['KG', 'Kyrgyzstan', '996', 9, 9],
  ['LA', 'Laos', '856', 8, 10],
  ['LV', 'Latvia', '371', 8, 8],
  ['LB', 'Lebanon', '961', 7, 8],
  ['LT', 'Lithuania', '370', 8, 8],
  ['LU', 'Luxembourg', '352', 8, 9],
  ['MO', 'Macau', '853', 8, 8],
  ['MU', 'Mauritius', '230', 8, 8],
  ['MX', 'Mexico', '52', 10, 10],
  ['MD', 'Moldova', '373', 8, 8],
  ['MN', 'Mongolia', '976', 8, 8],
  ['MA', 'Morocco', '212', 9, 9],
  ['MM', 'Myanmar', '95', 8, 10],
  ['NA', 'Namibia', '264', 9, 9],
  ['NL', 'Netherlands', '31', 9, 9],
  ['NG', 'Nigeria', '234', 10, 10],
  ['NO', 'Norway', '47', 8, 8],
  ['PA', 'Panama', '507', 8, 8],
  ['PY', 'Paraguay', '595', 9, 9],
  ['PE', 'Peru', '51', 9, 9],
  ['PH', 'Philippines', '63', 10, 10],
  ['PL', 'Poland', '48', 9, 9],
  ['PT', 'Portugal', '351', 9, 9],
  ['RO', 'Romania', '40', 9, 9],
  ['RU', 'Russia', '7', 10, 10],
  ['RW', 'Rwanda', '250', 9, 9],
  ['RS', 'Serbia', '381', 8, 9],
  ['SK', 'Slovakia', '421', 9, 9],
  ['SI', 'Slovenia', '386', 8, 8],
  ['ZA', 'South Africa', '27', 9, 9],
  ['ES', 'Spain', '34', 9, 9],
  ['SE', 'Sweden', '46', 7, 10],
  ['CH', 'Switzerland', '41', 9, 9],
  ['SY', 'Syria', '963', 9, 9],
  ['TW', 'Taiwan', '886', 9, 9],
  ['TJ', 'Tajikistan', '992', 9, 9],
  ['TZ', 'Tanzania', '255', 9, 9],
  ['TH', 'Thailand', '66', 9, 9],
  ['TT', 'Trinidad & Tobago', '1', 10, 10],
  ['TN', 'Tunisia', '216', 8, 8],
  ['TR', 'Türkiye', '90', 10, 10],
  ['UG', 'Uganda', '256', 9, 9],
  ['UA', 'Ukraine', '380', 9, 9],
  ['UY', 'Uruguay', '598', 8, 9],
  ['UZ', 'Uzbekistan', '998', 9, 9],
  ['VE', 'Venezuela', '58', 10, 10],
  ['VN', 'Vietnam', '84', 9, 10],
  ['YE', 'Yemen', '967', 9, 9],
  ['ZM', 'Zambia', '260', 9, 9],
  ['ZW', 'Zimbabwe', '263', 9, 9],
];

export const COUNTRIES = RAW.map(([iso, name, dial, min, max]) => ({ iso, name, dial, min, max }));

export const DEFAULT_COUNTRY = COUNTRIES[0];

export const findCountry = (iso) => COUNTRIES.find((c) => c.iso === iso) || DEFAULT_COUNTRY;

// Flag image (emoji flags don't render on Windows, so use a small image CDN)
export const flagUrl = (iso, w = 40) => `https://flagcdn.com/w${w}/${iso.toLowerCase()}.png`;

const STORAGE_KEY = 'creatorLoginCountry';

// Pick the visitor's country: last choice → browser locale region → India
export const detectCountry = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return findCountry(saved);
  } catch { /* ignore */ }
  try {
    // Many Indian users have an en-US browser locale, so trust the timezone first
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (/^Asia\/(Kolkata|Calcutta)$/.test(tz)) return DEFAULT_COUNTRY;
  } catch { /* ignore */ }
  try {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const l of langs) {
      const region = new Intl.Locale(l).region;
      const hit = region && COUNTRIES.find((c) => c.iso === region);
      if (hit) return hit;
    }
  } catch { /* ignore */ }
  return DEFAULT_COUNTRY;
};

export const saveCountry = (iso) => {
  try { localStorage.setItem(STORAGE_KEY, iso); } catch { /* ignore */ }
};
