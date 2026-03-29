export type StudentStatus =
  | "UC Students"
  | "BINUS Students"
  | "UC Alumni"
  | "BINUS Alumni"
  | "Public (non UC or BINUS)";

export interface Profile {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  professional_link: string | null;
  student_status: StudentStatus;
  current_semester: string | null;
  submission_title: string;
  submission_cohort: string;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  description: string;
  year_accomplished: number;
  role_position: string;
  publication_link: string | null;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioImage {
  id: string;
  portfolio_id: string;
  image_url: string;
  storage_path: string;
  alt_text: string | null;
  is_cover: boolean;
  sort_order: number;
  created_at: string;
}

export interface PortfolioWithImages extends Portfolio {
  portfolio_images: PortfolioImage[];
}
