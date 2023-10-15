import { Component, OnInit, ViewChild } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { Article } from 'src/app/interfaces';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild(IonInfiniteScroll, {static: true}) infiniteScrooll!: IonInfiniteScroll;

  public articles: Article[] = []

  constructor(
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    this.newsService.getToHeadlines()
      .subscribe({
        next: (articles) => this.articles = articles
      })
  }

  public loadData() {
    this.newsService.getTopHeadlinesByCategory('business', true)
    .subscribe({
      next: articles => {

        if(articles.length === this.articles.length){
          this.infiniteScrooll.disabled = true
          return;

        }
        
        this.articles = articles
       this.infiniteScrooll.complete();

      }
    })
  }

}
