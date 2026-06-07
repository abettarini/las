// Define the types for armory data
export interface Weapon {
  id: string;
  brand: string;
  model: string;
  caliber: string;
  hasOptics: boolean;
  opticsDetails?: string;
  image: string;
  description?: string;
}

export interface Ammunition {
  id: string;
  caliber: string;
  type: string;
  price: string;
  available: boolean;
}

export interface ArmoryData {
  weapons: {
    rifles: Weapon[];
    shotguns: Weapon[];
    semiAutoPistols: Weapon[];
    revolvers: Weapon[];
  };
  ammunitions: Ammunition[];
}

// Declare the module for the JSON file
declare module "@/data/armory.json" {
  const data: ArmoryData;
  export default data;
}