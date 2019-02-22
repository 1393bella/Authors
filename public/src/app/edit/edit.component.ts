import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  author: any;
  updatedAuthor: any;
  errors: any = [];

  constructor(private _httpService: HttpService, private _route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit() {
    this.updatedAuthor = {
      name: ''
    }
    this._route.params.subscribe((params: Params) => {
      this.getOneAuthor(params['id'])
    });
  }

  getOneAuthor(id: string) {
    this._httpService.getAuthor(id).subscribe(author => {
      this.updatedAuthor = author['data']
    })
  }
  editAuthor() {
    this._httpService.editAuthor(this.updatedAuthor).subscribe(response => {
      if (response['message'] == 'Error') {
        console.log(response)
        this.errors = response['error']
      } else {
        this.goHome()
      }
    })
  }
  goHome() {
    this._router.navigate(['']);
  }
}
