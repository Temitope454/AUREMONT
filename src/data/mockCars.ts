export interface VehicleProvider {
  name: string;
  verifiedIdentity: boolean;
  terms: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  category: 'SUV' | 'Sedan' | 'Estate' | 'Sports' | 'Convertible';
  location: string;
  price: number;
  currency: string;
  pricingCadence: '/ day' | '/ week';
  seats: number;
  doors: number;
  transmission: 'Automatic' | 'Manual';
  powertrain: 'Electric' | 'Hybrid' | 'Petrol';
  luggageCapacity: string;
  features: string[];
  availability: string;
  mainImage: string;
  gallery: string[];
  provider: VehicleProvider;
  favoriteState: boolean;
}

export const mockCars: Vehicle[] = [
  {
    id: 'v-2001',
    slug: 'range-rover-velar-paris',
    make: 'Range Rover',
    model: 'Velar',
    year: 2024,
    category: 'SUV',
    location: 'Paris, France',
    price: 320,
    currency: '€',
    pricingCadence: '/ day',
    seats: 5,
    doors: 4,
    transmission: 'Automatic',
    powertrain: 'Hybrid',
    luggageCapacity: '2 Large, 2 Small',
    features: ['Leather interior', 'Panoramic roof', 'GPS Navigation', 'All-wheel drive', 'Premium audio'],
    availability: 'Available tomorrow',
    mainImage: '/images/car1.jpg',
    gallery: ['/images/car1.jpg'],
    provider: {
      name: 'Auremont Mobility Paris',
      verifiedIdentity: true,
      terms: 'Minimum 2 days rental. Valid international driving permit required.'
    },
    favoriteState: false
  },
  {
    id: 'v-2002',
    slug: 'porsche-taycan-milan',
    make: 'Porsche',
    model: 'Taycan Cross Turismo',
    year: 2024,
    category: 'Estate',
    location: 'Milan, Italy',
    price: 450,
    currency: '€',
    pricingCadence: '/ day',
    seats: 4,
    doors: 4,
    transmission: 'Automatic',
    powertrain: 'Electric',
    luggageCapacity: '2 Large',
    features: ['Electric performance', 'Air suspension', 'Adaptive cruise', 'Heated seats'],
    availability: 'Available in 2 days',
    mainImage: '/images/car1.jpg',
    gallery: ['/images/car1.jpg'],
    provider: {
      name: 'Auremont Mobility Milan',
      verifiedIdentity: true,
      terms: 'Minimum 2 days rental. Fast charging card provided.'
    },
    favoriteState: true
  },
  {
    id: 'v-2003',
    slug: 'mercedes-s-class-dubai',
    make: 'Mercedes-Benz',
    model: 'S-Class',
    year: 2024,
    category: 'Sedan',
    location: 'Dubai, UAE',
    price: 850,
    currency: 'AED',
    pricingCadence: '/ day',
    seats: 4,
    doors: 4,
    transmission: 'Automatic',
    powertrain: 'Hybrid',
    luggageCapacity: '3 Large',
    features: ['Executive package', 'Massage seating', 'Rear display suite', 'Acoustic comfort glazing'],
    availability: 'Available today',
    mainImage: '/images/car1.jpg',
    gallery: ['/images/car1.jpg'],
    provider: {
      name: 'Auremont Mobility Dubai',
      verifiedIdentity: true,
      terms: 'Minimum 1 day rental. Airport terminal drop-off available.'
    },
    favoriteState: false
  },
  {
    id: 'v-2004',
    slug: 'bentley-flying-spur-london',
    make: 'Bentley',
    model: 'Flying Spur Hybrid',
    year: 2024,
    category: 'Sedan',
    location: 'London, UK',
    price: 680,
    currency: '£',
    pricingCadence: '/ day',
    seats: 4,
    doors: 4,
    transmission: 'Automatic',
    powertrain: 'Hybrid',
    luggageCapacity: '3 Large',
    features: ['Naim audio', 'Hand-stitched leather', 'All-wheel steering', 'Night vision assistance'],
    availability: 'Available tomorrow',
    mainImage: '/images/car1.jpg',
    gallery: ['/images/car1.jpg'],
    provider: {
      name: 'Auremont Mobility London',
      verifiedIdentity: true,
      terms: 'Minimum 2 days rental. Mayfair delivery available.'
    },
    favoriteState: false
  },
  {
    id: 'v-2005',
    slug: 'audi-rs-e-tron-gt-madrid',
    make: 'Audi',
    model: 'RS e-tron GT',
    year: 2024,
    category: 'Sports',
    location: 'Madrid, Spain',
    price: 420,
    currency: '€',
    pricingCadence: '/ day',
    seats: 4,
    doors: 4,
    transmission: 'Automatic',
    powertrain: 'Electric',
    luggageCapacity: '2 Large',
    features: ['Carbon ceramic brakes', 'Matrix LED headlights', 'Sport seats plus', 'Bang & Olufsen 3D Sound'],
    availability: 'Immediate',
    mainImage: '/images/car1.jpg',
    gallery: ['/images/car1.jpg'],
    provider: {
      name: 'Auremont Mobility Madrid',
      verifiedIdentity: true,
      terms: 'Minimum 2 days rental. Salamanca delivery included.'
    },
    favoriteState: false
  },
  {
    id: 'v-2006',
    slug: 'lucid-air-grand-touring-new-york',
    make: 'Lucid',
    model: 'Air Grand Touring',
    year: 2024,
    category: 'Sedan',
    location: 'New York, US',
    price: 520,
    currency: '$',
    pricingCadence: '/ day',
    seats: 5,
    doors: 4,
    transmission: 'Automatic',
    powertrain: 'Electric',
    luggageCapacity: '3 Large',
    features: ['Surreal Sound Pro', 'Glass canopy roof', '516-mile range', 'DreamDrive Pro'],
    availability: 'Available tomorrow',
    mainImage: '/images/car1.jpg',
    gallery: ['/images/car1.jpg'],
    provider: {
      name: 'Auremont Mobility New York',
      verifiedIdentity: true,
      terms: 'Minimum 2 days rental. Manhattan valet delivery.'
    },
    favoriteState: false
  }
];
