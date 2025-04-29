
export interface DogReport {
  status: 'lost' | 'found';
  description: string;
  location: {
    lat: number;
    lon: number;
  };
  phone: string;
  image?: File;
}

export interface DogMatch {
  _id: string;
  text: string;
  phone: string;
  lat: number;
  lon: number;
  image_name: string;
  score: number;
}

export interface ReportResponse {
  message: string;
  matches?: DogMatch[];
}
