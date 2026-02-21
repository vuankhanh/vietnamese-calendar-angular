import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IAlbum } from '../interface/media.interface';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  private readonly httpClient = inject(HttpClient);

  private readonly albumUrl = './data/album.json';

  getAlbum(): Observable<IAlbum[]> {
    return this.httpClient.get(this.albumUrl).pipe(
      map((response: any) => {
        return response.map((album: any) => ({
          ...album,
          date: new Date(album.date),
        }));
      })
    );
  }
}
