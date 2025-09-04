export interface ApiResponse<T> {
  totalRecords: number;
  page: number;
  pageSize: number;
  data: T[];
}

export interface BusEvent {
  id: number;
  title: string;
  description: string;
  fromPlace: string;
  toPlace: string;
  travelDate: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  status: string;
  organizer: string;
  contactInfo: string;
  isActive: boolean;
  busType: BusType;
  busCategory: BusCategory;
  images: Image[];
}

export interface BusType {
  id: number;
  name: string;
  description: string;
  features: string;
}

export interface BusCategory {
  id: number;
  name: string;
  description: string;
}

export interface Image {
  id: number;
  url: string;
  isPrimary: boolean;
}
