import { Component, Input, OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share';
import { ActionSheetController, Platform } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent  implements OnInit {

  @Input()
  article!: Article;

  @Input()
  index!: number;

  constructor(
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private storageService: StorageService
  ) { }

  ngOnInit() {}

  public async openArticle() {

    if(this.platform.is('ios') || this.platform.is('android')){
      await Browser.open({url: this.article.url})
      return;
    }

    window.open(this.article.url, '_blank')
  }

  private async onShareArticle() {
    return await Share.share({
      title: this.article.title,
      text: this.article.description,
      url: this.article.url,
      dialogTitle: this.article.source.name
    })
  }

  private onToggleFavorite() {

    this.storageService.saveRemoveArticle(this.article);

  }

  public async onOpenMenu() {

    const articleInFavorite = this.storageService.articleInFavorites(this.article);

    const confirm = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Compartir',
          icon: 'share-outline',
          handler: () => this.onShareArticle()
        },
        {
          text: articleInFavorite ? 'Remover Favorito' : 'Favorito',
          icon: articleInFavorite ? 'heart' : 'heart-outline',
          handler: () => this.onToggleFavorite()
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'close-outline'
        }
      ]
    })

    await confirm.present();
  }

}
