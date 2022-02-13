export class Lecture{
  id: number;
  sc_id: string;
  year: string;
  term: string;
  name: string;
  code: string;
  class: string;
  college: string;
  department: string;
  type: string;
  credit: number;
  prof: string;
  time: string;
  location: string;
  hit: number;
  eval_count: number;
  star_achievement:number;
  star_attendance:number;
  star_difficulty:number;
  star_grade:number;
  star_studytime:number;
  star_total:number;
}

export class SearchInfo{
  total_count:number;
  page:number;
  data: Lecture[];
}

export class LectureEval{
  contents:string;
  total:number;
  difficulty:number;
  studytime:number;
  attendance:number;
  grade:number;
  achievement:number;
}
