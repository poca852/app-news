import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Article } from '../../interfaces/index';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  get articles(): Article[] {
    return this.storageService.localArticles;
  }

  constructor(
    private storageService: StorageService
  ) {}


  ngOnInit(): void {
  }

}
