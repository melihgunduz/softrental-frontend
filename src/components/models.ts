// noinspection SpellCheckingInspection
export interface Property {
  owner: string;
  hirer: string;
  isAvailable: boolean;
  id: number;
  adres: string;
  name: string;
  sort: string;
  end: number;
  price: number;
  start: number;
  votes: number;
}

export interface CreatePropertyInterface {
  name: string;
  sort: string;
  adres: string;
  price: number;
}
