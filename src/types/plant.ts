// Define the types for plant data
export interface PlantFeatures {
  titleClassName: string;
  backgroundColor: string;
  items: string[];
}

export interface Plant {
  id: string;
  category: string;
  title: string;
  titleClassName: string;
  imageUrl: string;
  imageAlt: string;
  imagePosition: 'left' | 'right';
  description: string;
  features: PlantFeatures;
}
