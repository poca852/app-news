import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Article, ArticlesByCategoryAndPage, NeswResponse } from '../interfaces';
import { Observable, map, of } from 'rxjs';
import { storedArticlesByCategory } from '../data/mock-news';

const apiKey = environment.api_key;
const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private articlesByCategoryAndPage: ArticlesByCategoryAndPage | any = storedArticlesByCategory;

  constructor(
    private http: HttpClient
  ) { }

  private executeQuery<T>(endpoint: string) {
    console.log('peticion http')
    return this.http.get<T>(`${baseUrl}/${endpoint}`, {
      params: { 
        apiKey,
        country: 'us'
      }
    })

  }

  public getToHeadlines(): Observable<Article[]> {

    return this.getTopHeadlinesByCategory('business')

  }

  public getTopHeadlinesByCategory(category: string, loadMore: boolean = false): Observable<Article[]> {

    return of(this.articlesByCategoryAndPage[category].articles)

    // if(loadMore) {
    //   return this.getArticlesByCategory(category);
    // }

    // if(this.articlesByCategoryAndPage[category]) {
    //   return of(this.articlesByCategoryAndPage[category].articles)
    // }

    // return this.getArticlesByCategory(category);

  }

  private getArticlesByCategory(category: string): Observable<Article[]> {

    if(Object.keys(this.articlesByCategoryAndPage).includes(category)) {

      // this.articlesByCategoryAndPage[category].page += 1;

    }else {

      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
      }

    }

    const page = this.articlesByCategoryAndPage[category].page + 1;

    return this.executeQuery<NeswResponse>(`/top-headlines?category=${category}&page=${page}`)
      .pipe(
        map( ({articles}) => {
          if( articles.length === 0 ) return this.articlesByCategoryAndPage[category].articles;

          this.articlesByCategoryAndPage[category] = {
            page,
            articles: [...this.articlesByCategoryAndPage[category].articles, ...articles]
          }

          return this.articlesByCategoryAndPage[category].articles;
        } )
      )

  }

}
