export interface Event {
  id: number;
  title: string;
  description: string;
  travelDate: string;
  price: number;
  fromPlace: string;
  toPlace: string;
}

export interface Payment {
  paymentId: number;
  provider: string;
  providerOrderId: string;
  providerPaymentId:string;
  currency: string;
  amount: number;
  status: string;
  createdAt: string;
  paidAt?: string | null;
}

export interface Traveller {
  travellerId: number;
  name: string;
  phoneNumber: string;
  email: string;
  age: number;
  userId: string;
}

export interface Booking {
  bookingId: number;
  eventId: number;
  seatNumber: string;
  price: number;
  pricePaid: number;
  status: string;
  holdExpiry: string;
  bookingDate: string;
  provider: string;
  userId: string;
}

export interface BookingWrapper {
  booking: Booking;
  payment: Payment;
  traveller: Traveller;
  event: Event;
}
