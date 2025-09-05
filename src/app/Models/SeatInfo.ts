export interface SeatDto {
  seatNumber: string;
  isBooked: boolean;
}

export interface ImageDto {
  photoId: number;
  url: string;
  isPrimary: boolean;
  eventId: number;
}

export interface EventSeatMap {
  id: number;
  title: string;
  description: string;
  travelDate: string;
  price: number;
  totalSeats: number;
  fromPlace: string;
  toPlace: string;
  images: ImageDto[];
  seatLayout: (SeatDto | null)[][]; // 2D grid with aisles (null)
}
