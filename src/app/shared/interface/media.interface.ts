export interface IMedia {
  id: number;
  type: string;
  url: string;
}

export interface IAlbum {
  id: number;
  name: string;
  route: string;
  date: Date;
  medias: IMedia[];
  description: string;
}