import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  endpoint = environment.apiUrl;
  constructor(private http: HttpClient) {}

  uservotes(voteid: string) {
    return this.http.post<number>(this.endpoint + '/uservotes/' + voteid, null);
  }

  getAllVoteItem() {
    return this.http.get<IGetAllVoteItemResponse>(this.endpoint + '/voteitem');
  }

  editVoteItem(voteid: string, description: string) {
    return this.http.put<number>(this.endpoint + '/voteitem', {
      name: voteid,
      description,
    });
  }

  deleteVoteItem(voteid: string) {
    return this.http.delete<number>(this.endpoint + '/voteitem/' + voteid);
  }

  addVoteItem(voteid: string, description: string) {
    return this.http.post<number>(this.endpoint + '/voteitem', {
      name: voteid,
      description,
    });
  }
}

export interface IGetAllVoteItemResponse {
  totalVote: number;
  voteitem: IVoteItem[];
}

export interface IVoteItem {
  itemId: string;
  name: string;
  description: string;
  voteCount: number;
}
