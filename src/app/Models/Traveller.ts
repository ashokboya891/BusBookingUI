export interface Traveller{
      travellerId?: number;
  name: string;
  phoneNumber: string;
  email: string;
  age: number;
  userId: string;
  selected?: boolean; // <-- for booking selection
}