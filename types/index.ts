export interface Frame {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'archived';
  views: number;
  interactions: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'completed';
  frames: string[];
  members: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  isFree: boolean;
  featured: boolean;
  tags: string[];
  previewUrl?: string;
}

export interface User {
  id: string;
  address: string;
  email?: string;
  username?: string;
  avatar?: string;
  createdAt: Date;
}

export interface PaymentConfig {
  stripe?: {
    publishableKey: string;
    secretKey: string;
  };
  crypto?: {
    receiverAddress: string;
    supportedTokens: string[];
  };
}
