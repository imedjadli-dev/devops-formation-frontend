import { Injectable } from '@angular/core';

import { HttpClient} from '@angular/common/http';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class StockService {

  readonly API_URL = environment.API_Base;

  constructor(private httpClient: HttpClient) { }

  getAllStocks() {
    return this.httpClient.get(`${this.API_URL}/stock/retrieve-all-stocks`)
  }
  addStock(stock : any) {
    return this.httpClient.post(`${this.API_URL}/stock/add-stock`, stock)
  }
  editStock(stock : any){
    return this.httpClient.put(`${this.API_URL}/stock/modify-stock`, stock)
  }
  deleteStock(idStock : any){
    return  this.httpClient.delete(`${this.API_URL}/stock/remove-stock/${idStock}`)
  }
}
