import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export interface Order {
  id: number,
  name: string,
  quantity: number,
  price: number,
  description: string,
  note_public: string,
  label:string,
  note: string
}

const ORDER_KEY = 'QUESADILLA';

@Injectable({
  providedIn: 'root'
})
export class OrderStorageService {

  constructor(private storage: Storage) { }

  //create ORDER
  addOrder(order: Order): Promise<any> {
    return this.storage.get(ORDER_KEY).then((orders: Order[]) => {
      if (orders) {
        orders.push(order);
        return this.storage.set(ORDER_KEY, orders);
      } else {
        return this.storage.set(ORDER_KEY, [order]);
      }
    });
  }

  //Read order
  getOrders(): Promise<Order[]> {
    return this.storage.get(ORDER_KEY);
  }

  //Update order
  updateOrder(order: Order): Promise<any> {
    return this.storage.get(ORDER_KEY).then((orders: Order[]) => {
      if (!orders || orders.length === 0) {
        return null;
      }

      let newOrders: Order[] = [];

      for( let i of orders ){
        if( i.id === order.id){
          newOrders.push(order);
          console.log('error uploading'+order.id +' '+i.id);
        } 
        else {
          newOrders.push(i);
        }
      }
      return this.storage.set(ORDER_KEY, newOrders);
    });
  }

  //Delete battle
  deleteOrder(id: number): Promise<Order> {
    return this.storage.get(ORDER_KEY).then((orders: Order[]) => {
      if(!orders || orders.length === 0) {
        return null;
      }

      let tokeep: Order[] = [];

      for(let i of orders){
        if(i.id !== id){
          tokeep.push(i);
        }
      }
      return this.storage.set(ORDER_KEY, tokeep);
    });
  }

  deleteOrderIndex(id: number): Promise<Order> {
    return this.storage.get(ORDER_KEY).then((orders: Order[]) => {
      if(!orders || orders.length === 0) {
        return null;
      }

      let tokeep: Order[] = [];
      for(let i=0; i<orders.length; i++){
        if(i !== id){
          tokeep.push(orders[i]);
        }
      }
      return this.storage.set(ORDER_KEY, tokeep);
    });
  }

  clearStorage(){
    this.storage.remove(ORDER_KEY);
    console.log('Database deleted')
  }

}
