import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  dataProductToPopUpDelete = new EventEmitter<any>();
  messageToLogMessage = new EventEmitter<any>();
}
