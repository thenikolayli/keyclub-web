export interface Member {
  id: string;
  name: string;
  all_hours: number;
  term_hours: number;
  grad_year: number;
  class: string;
  strikes: number;
  personal_email: string;
  school_email: string;
  phone_number: string;
  shirt_size: string;
  paid_dues: boolean;
  created_at: Date;
  updated_at: Date;
}
