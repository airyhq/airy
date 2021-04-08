export interface Members {
  data: Array<Member>;
  query: string;
}

export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
}
