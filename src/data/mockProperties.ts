export interface Provider {
  name: string;
  role: 'Agent' | 'Landlord';
  verifiedIdentity: boolean;
  avatar?: string;
  agency?: string;
}

export interface Property {
  id: string;
  slug: string;
  transactionType: 'Buy' | 'Rent' | 'Lease';
  propertyType: 'Apartment' | 'House' | 'Loft' | 'Villa' | 'Residence';
  title: string;
  country: string;
  city: string;
  neighborhood: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  price: number;
  currency: string;
  pricingCadence?: '/ month' | '/ week' | '/ year';
  beds: number;
  baths: number;
  size: number;
  sizeUnit: 'm²' | 'sq ft';
  furnished: boolean;
  description: string;
  features: string[];
  amenities: string[];
  availability?: string; // Date string or 'Immediate'
  mainImage: string;
  gallery: string[];
  video?: string;
  floorPlan?: string;
  provider: Provider;
  listingVerified: boolean;
  publicationStatus: 'Published' | 'Draft' | 'Paused';
  favoriteState: boolean;
  creationDate: string;
}

export const mockProperties: Property[] = [
  {
    id: 'p-1001',
    slug: 'rue-de-varenne-residence-paris',
    transactionType: 'Buy',
    propertyType: 'Apartment',
    title: 'Rue de Varenne Residence',
    country: 'France',
    city: 'Paris',
    neighborhood: '7th arrondissement',
    price: 2850000,
    currency: '€',
    beds: 3,
    baths: 2,
    size: 184,
    sizeUnit: 'm²',
    furnished: false,
    description: 'Set on an upper floor near the Seine, this three-bedroom apartment pairs a restrained contemporary renovation with the proportions of a classic Paris residence. Tall windows bring daylight through the principal living spaces, while the kitchen and dining area open into a quieter courtyard-facing wing.',
    features: ['Courtyard view', 'Classic proportions', 'Contemporary renovation', 'Tall windows'],
    amenities: ['Elevator', 'Security', 'Storage'],
    mainImage: '/images/paris_apartment.jpg',
    gallery: [
      '/images/paris_apartment.jpg',
      '/images/madrid_apartment.jpg', // Reusing as mock gallery images
      '/images/london_apartment.jpg'
    ],
    provider: {
      name: 'Claire Moreau',
      role: 'Agent',
      verifiedIdentity: true,
      agency: 'Auremont Paris'
    },
    listingVerified: true,
    publicationStatus: 'Published',
    favoriteState: false,
    creationDate: '2023-10-15T08:00:00Z',
    coordinates: { lat: 48.8546, lng: 2.3219 }
  },
  {
    id: 'p-1002',
    slug: 'retiro-garden-apartment-madrid',
    transactionType: 'Buy',
    propertyType: 'Apartment',
    title: 'Retiro Garden Apartment',
    country: 'Spain',
    city: 'Madrid',
    neighborhood: 'Retiro',
    price: 1420000,
    currency: '€',
    beds: 3,
    baths: 2,
    size: 156,
    sizeUnit: 'm²',
    furnished: false,
    description: 'A quiet, earthy residence just steps from El Retiro park. Featuring warm tones and sophisticated architectural details, this apartment offers a calm retreat in the heart of the city.',
    features: ['Park proximity', 'Warm tones', 'Sophisticated details'],
    amenities: ['Terrace', 'Air conditioning', 'Elevator'],
    mainImage: '/images/madrid_apartment.jpg',
    gallery: ['/images/madrid_apartment.jpg'],
    provider: {
      name: 'Javier Silva',
      role: 'Agent',
      verifiedIdentity: true
    },
    listingVerified: true,
    publicationStatus: 'Published',
    favoriteState: true,
    creationDate: '2023-11-02T09:30:00Z',
    coordinates: { lat: 40.4153, lng: -3.6845 }
  },
  {
    id: 'p-1003',
    slug: 'alfama-courtyard-house-lisbon',
    transactionType: 'Rent',
    propertyType: 'House',
    title: 'Alfama Courtyard House',
    country: 'Portugal',
    city: 'Lisbon',
    neighborhood: 'Alfama',
    price: 4800,
    currency: '€',
    pricingCadence: '/ month',
    beds: 2,
    baths: 2,
    size: 128,
    sizeUnit: 'm²',
    furnished: true,
    description: 'Contemporary waterfront living in Lisbon. This home combines raw stone and warm wood materials with natural lighting to create a composed and restrained environment.',
    features: ['Waterfront', 'Private courtyard', 'Stone and wood materials'],
    amenities: ['Air conditioning', 'Furnished', 'Terrace'],
    availability: '12 October',
    mainImage: '/images/lisbon_house.jpg',
    gallery: ['/images/lisbon_house.jpg'],
    provider: {
      name: 'Ana Costa',
      role: 'Landlord',
      verifiedIdentity: true
    },
    listingVerified: true,
    publicationStatus: 'Published',
    favoriteState: false,
    creationDate: '2023-10-20T14:15:00Z',
    coordinates: { lat: 38.7126, lng: -9.1330 }
  },
  {
    id: 'p-1004',
    slug: 'canal-house-apartment-london',
    transactionType: 'Buy',
    propertyType: 'Apartment',
    title: 'Canal House Apartment',
    country: 'United Kingdom',
    city: 'London',
    neighborhood: 'Islington',
    price: 1650000,
    currency: '£',
    beds: 2,
    baths: 2,
    size: 118,
    sizeUnit: 'm²',
    furnished: false,
    description: 'A calm, knowledgeable space utilizing restrained materials. This apartment overlooks the Regent\'s Canal, offering neutral grading and architectural precision.',
    features: ['Canal view', 'Restrained materials', 'High ceilings'],
    amenities: ['Balcony', 'Concierge', 'Elevator'],
    mainImage: '/images/london_apartment.jpg',
    gallery: ['/images/london_apartment.jpg'],
    provider: {
      name: 'Thomas Wright',
      role: 'Agent',
      verifiedIdentity: false
    },
    listingVerified: false,
    publicationStatus: 'Published',
    favoriteState: false,
    creationDate: '2023-11-10T11:45:00Z',
    coordinates: { lat: 51.5361, lng: -0.1030 }
  },
  {
    id: 'p-1005',
    slug: 'brera-loft-milan',
    transactionType: 'Rent',
    propertyType: 'Loft',
    title: 'Brera Loft',
    country: 'Italy',
    city: 'Milan',
    neighborhood: 'Brera',
    price: 6200,
    currency: '€',
    pricingCadence: '/ month',
    beds: 2,
    baths: 2,
    size: 142,
    sizeUnit: 'm²',
    furnished: true,
    description: 'An exceptional double-height loft in the artistic heart of Milan. Earthy tones and exposed architectural elements are balanced with premium minimal finishes.',
    features: ['Double-height ceilings', 'Exposed brick', 'Minimal finishes'],
    amenities: ['Air conditioning', 'Furnished', 'Concierge'],
    availability: 'Immediate',
    mainImage: '/images/milan_apartment.jpg',
    gallery: ['/images/milan_apartment.jpg'],
    provider: {
      name: 'Marco Rossi',
      role: 'Landlord',
      verifiedIdentity: true
    },
    listingVerified: true,
    publicationStatus: 'Published',
    favoriteState: false,
    creationDate: '2023-11-12T10:00:00Z',
    coordinates: { lat: 45.4720, lng: 9.1878 }
  },
  {
    id: 'p-1006',
    slug: 'marina-terrace-residence-dubai',
    transactionType: 'Buy',
    propertyType: 'Residence',
    title: 'Marina Terrace Residence',
    country: 'UAE',
    city: 'Dubai',
    neighborhood: 'Dubai Marina',
    price: 7400000,
    currency: 'AED',
    beds: 3,
    baths: 3,
    size: 211,
    sizeUnit: 'm²',
    furnished: false,
    description: 'Elevated contemporary living without generic luxury tropes. This residence emphasizes space, light, and geometry, looking out over the marina architecture.',
    features: ['Marina views', 'Geometric architecture', 'Abundant light'],
    amenities: ['Pool', 'Security', 'Parking', 'Concierge'],
    mainImage: '/images/dubai_residence.jpg',
    gallery: ['/images/dubai_residence.jpg'],
    provider: {
      name: 'Sarah Al-Maktoum',
      role: 'Agent',
      verifiedIdentity: true,
      agency: 'Auremont Dubai'
    },
    listingVerified: true,
    publicationStatus: 'Published',
    favoriteState: false,
    creationDate: '2023-10-05T16:20:00Z',
    coordinates: { lat: 25.0805, lng: 55.1403 }
  },
  {
    id: 'p-1007',
    slug: 'tribeca-corner-loft-new-york',
    transactionType: 'Buy',
    propertyType: 'Loft',
    title: 'Tribeca Corner Loft',
    country: 'United States',
    city: 'New York',
    neighborhood: 'Tribeca',
    price: 3950000,
    currency: '$',
    beds: 2,
    baths: 2,
    size: 1640,
    sizeUnit: 'sq ft',
    furnished: false,
    description: 'A composed, gallery-like space offering corner exposure and significant volume. The renovation prioritized longevity and clarity over fleeting design trends.',
    features: ['Corner exposure', 'Gallery volume', 'Restored details'],
    amenities: ['Elevator', 'Storage', 'Doorman'],
    mainImage: '/images/paris_apartment.jpg', // Reused
    gallery: ['/images/paris_apartment.jpg'],
    provider: {
      name: 'Elena Pierce',
      role: 'Agent',
      verifiedIdentity: true
    },
    listingVerified: true,
    publicationStatus: 'Published',
    favoriteState: false,
    creationDate: '2023-11-15T09:00:00Z',
    coordinates: { lat: 40.7181, lng: -74.0076 }
  },
  {
    id: 'p-1008',
    slug: 'tanglin-garden-residence-singapore',
    transactionType: 'Buy',
    propertyType: 'Residence',
    title: 'Tanglin Garden Residence',
    country: 'Singapore',
    city: 'Singapore',
    neighborhood: 'Tanglin',
    price: 4650000,
    currency: 'S$',
    beds: 3,
    baths: 3,
    size: 176,
    sizeUnit: 'm²',
    furnished: false,
    description: 'Immersed in tropical greenery, this residence manages a delicate boundary between inside and outside. Restrained materials allow the surrounding landscape to dominate the experience.',
    features: ['Tropical greenery', 'Indoor-outdoor boundary', 'Restrained palette'],
    amenities: ['Garden', 'Pool', 'Security'],
    mainImage: '/images/lisbon_house.jpg', // Reused
    gallery: ['/images/lisbon_house.jpg'],
    provider: {
      name: 'Wei Chen',
      role: 'Agent',
      verifiedIdentity: true
    },
    listingVerified: true,
    publicationStatus: 'Published',
    favoriteState: true,
    creationDate: '2023-10-28T13:40:00Z',
    coordinates: { lat: 1.3060, lng: 103.8180 }
  }
];

export const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === '€' ? 'EUR' : currency === '£' ? 'GBP' : currency === '$' ? 'USD' : currency === 'AED' ? 'AED' : 'SGD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price).replace(/[A-Z]{3}/, currency).trim();
};
