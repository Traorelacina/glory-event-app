export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  gallery: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  type: 'Mariage' | 'Réunion' | 'Réunion Pro' | 'Autres';
  images: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  avatar?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  service?: string;
}

export interface OrderForm extends ContactForm {
  address: string;
  items: CartItem[];
}
