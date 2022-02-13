export class Evaluation{
  comments_count:number;
  content:string;
  created_at:string;
  id:number;
  lec_id:number;
  like_count:number;
  like_status:any;
  name:string;
  star_achievement:number;
  star_attendance:number;
  star_difficulty:number;
  star_grade:number;
  star_studytime:number;
  star_total:number;
  updated_at:string;
  user_id:number;
  write_status:number;
  comments_status:boolean;
  profile:string;
}

export class Evaluations{
  total_count:number;
  data: Evaluation[];
}

export class Comment{
  id:number;
  user_id:number;
  content:string;
  created_at:string;
  name:string;
  write_status:number;
  profile:string;
}
