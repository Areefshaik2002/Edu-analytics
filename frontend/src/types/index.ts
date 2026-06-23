export interface Student {
  id: number;
  name: string;
  age: number;
  currentClass: string;
  teluguAverage: number;
  hindiAverage: number;
  englishAverage: number;
  socialStudiesAverage: number;
}

export interface StudentDetail {
  id: number;
  name: string;
  age: number;
  currentClass: string;
  marks: {
    [subject: string]: {
      [month: string]: number;
    };
  };
}

export interface StudentListResponse {
  students: Student[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AnalyticsResponse {
  student: {
    id: number;
    name: string;
    age: number;
    currentClass: string;
  };
  analytics: {
    telugu: number[];
    hindi: number[];
    english: number[];
    socialStudies: number[];
  };
}
