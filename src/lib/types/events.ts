export interface Event {
  name: string;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  address: string | null;
  n_of_slots: number | null;
  n_of_volunteers: number | null;
  description: string | null;
  attendance_url: string | null;
}

export interface EventSearchRequest {
  times: [number, number];
  length: [number, number];
  dates: [string, string]; // 2026-08-09
  spots: [number, number];
}
