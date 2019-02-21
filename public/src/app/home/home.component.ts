import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  formHeader = 'New Author'
  authors = [];
  author: any;
  newAuthor: any;
  updatedAuthor: any;

  constructor(private _httpService: HttpService) { }

  ngOnInit() {
    this.getAllAuthors();
  }

  getAllAuthors(){
    this._httpService.getAuthors().subscribe(all_authors=> this.authors=all_authors['data'])
  }
  deleteAuthor(id:string){
    this._httpService.deleteAuthor(id).subscribe(author=> this.author=author['data'])
    this.getAllAuthors();
  }
}
