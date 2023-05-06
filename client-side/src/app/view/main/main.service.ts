import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from 'src/app/common/api.config';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(

    private http: HttpClient
  ) { }


  getLeaderBoard() {
    return this.http.get<{
      username: string,
      point: number,
      level: number
    }[]>(`${API}/proggress/leaderboard`)
  }
}
