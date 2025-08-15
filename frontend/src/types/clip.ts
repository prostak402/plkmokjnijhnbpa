export interface Clip {
  id: string;
  filmTitle: string;
  year: number;
  genres: string[];
  logline: string;
  src: string;
  poster: string;
  tags?: string[];
  filmSlug: string;
  watchUrl: string;
}
