import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { StockPricesService } from '../stock-prices.service';
import { kill } from 'process';

@Component({
  selector: 'app-display-price',
  templateUrl: './display-price.component.html',
  styleUrls: ['./display-price.component.css']
})
export class DisplayPriceComponent implements OnInit {
  constructor(private stockPricesService: StockPricesService) { }
  objectKeys = Object.keys;
  TimeSeries = {};
  ngOnInit() {
    this.getStockPrices();
  }
  getStockPrices() {
    this.stockPricesService.getStockPrices().subscribe(data => {
      // this.TimeSeries = data["Time Series (Daily)"];
      Object.entries(data["Time Series (Daily)"]).forEach((key, index) => {
        let i = 0;
        for (const key of Object.keys(data["Time Series (Daily)"])) {
          if (i < 20)
            this.TimeSeries[key] = data["Time Series (Daily)"][key];
          i++
        }

      })
      this.calculateMaximumProfit();
    })
  }
  addValueInObject(object, key, value) {
    var res = {};
    var textObject = JSON.stringify(object);
    if (textObject === '{}') {
      res = JSON.parse('{"' + key + '":"' + value + '"}');
    } else {
      res = JSON.parse('{' + textObject.substring(1, textObject.length - 1) + ',"' + key + '":"' + value + '"}');
    }
    return res;
  }
  filterByPrices(filter: string) {
    this.TimeSeries = Object.entries(this.TimeSeries).sort(([, value1], [, value2]) => {
      return (value1[filter] - value2[filter])
    })
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
  }
  minBuying: {} = 0;
  maxSelling: {} = 0;
  hefresh: number = 0;
  calculateMaximumProfit() {
    Object.keys(this.TimeSeries).forEach((key, index) => {
      Object.keys(this.TimeSeries).forEach((key2, index2) => {
        if (index < 20 && index2 < 20) {
          if (index2 == 0 && index == 0) {
            this.minBuying = { key: key, value: this.TimeSeries[key] };
            this.maxSelling = { key: key2, value: this.TimeSeries[key2] };
          }
          else
            if (this.TimeSeries[key2]['2. high'] - this.TimeSeries[key]['3. low'] > this.hefresh) {
              this.hefresh = this.TimeSeries[key2]['2. high'] - this.TimeSeries[key]['3. low'];
              this.minBuying = { key: key, value: this.TimeSeries[key] };
              this.maxSelling = { key: key2, value: this.TimeSeries[key2] };
            }
        }
      });
    })
  }
  calculateMaximumProfitDateNotSort() {
    this.hefresh = 0;
    Object.keys(this.TimeSeries).forEach((key, index) => {
      Object.keys(this.TimeSeries).forEach((key2, index2) => {
        if (index < 20 && index2 < 20) {
          if (index2 == 0 && index == 0) {
            this.minBuying = { key: key, value: this.TimeSeries[key] };
            this.maxSelling = { key: key2, value: this.TimeSeries[key2] };
          }
          else
            if (this.TimeSeries[key2]['2. high'] - this.TimeSeries[key]['3. low'] > this.hefresh) {
              if (key2 < key) {
                this.hefresh = this.TimeSeries[key2]['2. high'] - this.TimeSeries[key]['3. low'];
                this.minBuying = { key: key, value: this.TimeSeries[key] };
                this.maxSelling = { key: key2, value: this.TimeSeries[key2] };
              }
            }
        }
      });
    })
  }
}
