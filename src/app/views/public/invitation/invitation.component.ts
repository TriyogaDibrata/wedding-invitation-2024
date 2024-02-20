import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export interface PicSum {
  id: number;
  download_url : string;
  height: number;
  width: number;
  author: string;
}

@Component({
  selector: 'app-invitation',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.scss'
})
export class InvitationComponent implements OnInit{
  
  public pics : any;
  
  constructor(
    private http: HttpClient,
    private translate : TranslateService
  ) {}

  ngOnInit(): void {
      this.getRandomPic();
  }

  async getRandomPic() {
     this.http.get('https://picsum.photos/v2/list?limit=5', {}).subscribe(
      {
        next: (resp) => {
          this.pics = resp;
          console.log(this.pics[0].url);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('request done !');
        }
      }
    )
  }

  async switchLang(lang : string) {
    const switching = await this.translate.use(lang);
  }

}
