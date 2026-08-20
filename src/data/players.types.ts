export type Position = 'GKP' | 'DEF' | 'MID' | 'FWD';

export interface Player {
  id: string;
  name: string;
  tag: string;
  club: string;
  pos: Position;
  price: number;
  form: number;
  fdr: number;
  fdrs: number[];
  xg: number;
  xa: number;
  xs?: number;
  own: number;
  doubt?: boolean;
}