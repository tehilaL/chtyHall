import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class StockPricesService {

  constructor(private http:HttpClient) { }
  getStockPrices(): Observable<any> {
    return this.http.get<any>('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&apikey=demo');
  }
}
