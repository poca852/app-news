import { Component, OnInit, ViewChild } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { Article, ArticlesByCategoryAndPage } from '../../interfaces/index';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  @ViewChild(IonInfiniteScroll, {static: true}) infiniteScrool!: IonInfiniteScroll;

  public categories: string[] = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology'
  ]

  public selectedCategory: string = this.categories[0];

  public articles: Article[] = [];

  constructor(
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    this.newsService.getTopHeadlinesByCategory(this.selectedCategory)
      .subscribe({
        next: articles => {
          this.articles = [ ...articles ]
        }
      })
  }

  segmentChanges(event: Event){
    this.selectedCategory = (event as CustomEvent).detail.value;
    this.newsService.getTopHeadlinesByCategory(this.selectedCategory)
      .subscribe({
        next: articles => {
          this.articles = [...articles]
        }
      })
  }

  public loadData() {

    this.newsService.getTopHeadlinesByCategory(this.selectedCategory, true)
      .subscribe({
        next: articles => {

          if(articles.length === this.articles.length){
            this.infiniteScrool.disabled = true
            return;

          }
          
          this.articles = articles
         this.infiniteScrool.complete();
  
        }
      })
  }

}
