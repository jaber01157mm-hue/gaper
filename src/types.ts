export type ServiceType = 'oil_change' | 'mechanical' | 'electrical' | 'diagnostic' | 'general';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  vehicleId: string;
  serviceType: ServiceType;
  date: string;
  time: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  bookingId?: string;
  serviceType: string;
  description: string;
  odometerReading?: number;
  nextServiceOdometer?: number;
  cost?: number;
  date: string;
  createdAt: string;
}
