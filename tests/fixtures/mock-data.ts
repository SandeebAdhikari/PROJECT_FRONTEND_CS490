export const mockSalon = {
  salonId: 1,
  name: 'Test Salon',
  slug: 'test-salon',
  address: '123 Test Street',
  city: 'Test City',
  state: 'TS',
  zipCode: '12345',
  phone: '+1234567890',
  email: 'salon@test.com',
  rating: 4.5,
  reviewCount: 100,
  businessHours: {
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '18:00', closed: false },
    saturday: { open: '10:00', close: '16:00', closed: false },
    sunday: { open: '00:00', close: '00:00', closed: true },
  },
};

export const mockServices = [
  {
    serviceId: 1,
    name: 'Haircut',
    duration: 60,
    price: 50,
    description: 'Professional haircut',
    category: 'Hair',
  },
  {
    serviceId: 2,
    name: 'Hair Coloring',
    duration: 120,
    price: 100,
    description: 'Hair coloring service',
    category: 'Hair',
  },
  {
    serviceId: 3,
    name: 'Manicure',
    duration: 45,
    price: 30,
    description: 'Professional manicure',
    category: 'Nails',
  },
];

export const mockStaffMembers = [
  {
    staffId: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@test.com',
    phone: '+1234567890',
    specialization: 'Hair Styling',
    rating: 4.8,
    photoUrl: 'https://example.com/photo1.jpg',
  },
  {
    staffId: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@test.com',
    phone: '+1234567891',
    specialization: 'Nail Care',
    rating: 4.9,
    photoUrl: 'https://example.com/photo2.jpg',
  },
];

export const mockCustomers = [
  {
    customerId: 1,
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice@test.com',
    phone: '+1111111111',
    totalVisits: 15,
    totalSpent: 750,
    loyaltyPoints: 150,
  },
  {
    customerId: 2,
    firstName: 'Bob',
    lastName: 'Williams',
    email: 'bob@test.com',
    phone: '+2222222222',
    totalVisits: 8,
    totalSpent: 400,
    loyaltyPoints: 80,
  },
];

export const mockAppointments = [
  {
    appointmentId: 1,
    customerId: 1,
    staffId: 1,
    serviceId: 1,
    date: '2025-12-15',
    time: '10:00',
    status: 'confirmed',
    totalAmount: 50,
    paymentStatus: 'paid',
  },
  {
    appointmentId: 2,
    customerId: 2,
    staffId: 2,
    serviceId: 3,
    date: '2025-12-16',
    time: '14:00',
    status: 'pending',
    totalAmount: 30,
    paymentStatus: 'pending',
  },
];

export const mockReviews = [
  {
    reviewId: 1,
    customerId: 1,
    salonId: 1,
    rating: 5,
    comment: 'Excellent service!',
    date: '2025-12-01',
    response: null,
  },
  {
    reviewId: 2,
    customerId: 2,
    salonId: 1,
    rating: 4,
    comment: 'Very good experience',
    date: '2025-12-05',
    response: 'Thank you for your feedback!',
  },
];

export const mockProducts = [
  {
    productId: 1,
    name: 'Shampoo',
    price: 25,
    description: 'Professional hair shampoo',
    stock: 50,
    imageUrl: 'https://example.com/shampoo.jpg',
  },
  {
    productId: 2,
    name: 'Hair Gel',
    price: 15,
    description: 'Strong hold hair gel',
    stock: 30,
    imageUrl: 'https://example.com/gel.jpg',
  },
];

export const mockCartItems = [
  {
    type: 'service',
    serviceId: 1,
    serviceName: 'Haircut',
    staffId: 1,
    staffName: 'John Doe',
    date: '2025-12-15',
    time: '10:00',
    price: 50,
    salonId: 1,
  },
  {
    type: 'product',
    productId: 1,
    productName: 'Shampoo',
    quantity: 2,
    price: 25,
    salonId: 1,
  },
];

export const mockAnalytics = {
  revenue: {
    today: 450,
    week: 3200,
    month: 12500,
    growth: 15.5,
  },
  appointments: {
    today: 8,
    week: 45,
    month: 180,
    pending: 12,
    confirmed: 28,
    completed: 140,
    cancelled: 5,
  },
  customers: {
    total: 250,
    new: 15,
    loyal: 85,
    retention: 68,
  },
};

export const mockLoyaltyPoints = {
  customerId: 1,
  totalPoints: 150,
  availablePoints: 120,
  usedPoints: 30,
  salonPoints: [
    {
      salonId: 1,
      salonName: 'Test Salon',
      points: 120,
    },
  ],
};

export const mockTimeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

export const mockAvailableSlots = [
  '10:00', '11:00', '14:00', '15:00', '16:00',
];
