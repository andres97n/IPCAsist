import { Friends } from "./friends";

export class Persons {
  _id?: string;
  index?: number;
  guid?: string;
  isActive?: boolean;
  balance?: string;
  picture?: string;
  age?: number;
  eyeColor?: string;
  name?: string;
  gender?: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
  about?: string;
  registered?: string;
  latitude?: string;
  longitude?: string;
  tags?: string[];
  friends?: Friends[];
  greeting?: string;
  favoriteFruit?: string;
}
