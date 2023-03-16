import { Injectable } from '@angular/core';
import { PagingClient } from 'src/app/services/paging/paging.client';

@Injectable({
  providedIn: 'root'
})
export class PagingService {
  private clients = Array<PagingClient>();
  constructor() { }
}
