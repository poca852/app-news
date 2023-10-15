import { Injectable } from '@angular/core';
import { Toast } from '@capacitor/toast';

import { Storage } from '@ionic/storage-angular';
import { Article } from '../interfaces/index';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;

  private _localArticles: Article[] = [];

  constructor(
    private storage: Storage
  ) { 

    this.init()
  }

  get localArticles() {
    return [...this._localArticles];
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;

    this.loadFavorites();
  }

  async saveRemoveArticle(article: Article) {

    const exists = this._localArticles.find(localArticle => localArticle.title === article.title)

    if( exists ){

      this._localArticles = this._localArticles.filter(localArticle => localArticle.title !== article.title)

      await Toast.show({
        text: 'Articulo Eliminado'
      })

    } else {

      this._localArticles = [article, ...this._localArticles];

      await Toast.show({
        text: 'Articulo Agregado'
      })

    }


    await this._storage!.set('articles', this._localArticles);

  }

  public async loadFavorites(): Promise<void>{
    try {
      
      const articles = await this._storage?.get('articles');

      this._localArticles = articles || [];

    } catch (error) {
      
    }
  }

  public articleInFavorites(article: Article): boolean {

    return !!this._localArticles.find(localArticle => localArticle.title === article.title);

  }
}
