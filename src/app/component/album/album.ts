import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyDialogService } from '../../shared/service/my-dialog.service';
import { AlbumService } from '../../shared/service/album.service';
import { filter, map, Subscription, switchMap, take, tap } from 'rxjs';
import { SlidesComponent } from './slides/slides.component';
import { MaterialModule } from '../../shared/module/material';
import { IAlbum } from '../../shared/interface/media.interface';

@Component({
  selector: 'app-album',
  imports: [
    MaterialModule
  ],
  templateUrl: './album.html',
  styleUrl: './album.scss',
})
export class Album implements OnInit, AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly myDialogService = inject(MyDialogService);
  private readonly albumService = inject(AlbumService);

  readonly albums$ = this.albumService.getAlbum();
  private readonly subscription = new Subscription();

  constructor() {

  }
  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.activatedRoute.queryParams.pipe(
      filter(params => !!params['route']),
      map(params => params['route']),
      take(1),
      switchMap(route => this.albums$.pipe(
        map(albums => albums.find(album => album.route === route)),
        filter(album => !!album)
      ))
    ).subscribe(album => {
      this.goToAlbum(album as IAlbum);
    });
  }

  goToAlbum(album: IAlbum) {
    const dialog = this.myDialogService.open(SlidesComponent, {
      id: '',
      data: album,
      minWidth: '100%',
      minHeight: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}