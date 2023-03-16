import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";


export interface Item{
socid:number
id:number,
name: string,
phone: number,
email:string,
place: number,

}

export interface SecondItem{
street: string,
code: number,
town: string
}
export interface ProfilePic{
    name:string;
    data:string;
}
export interface OpenTime{
    template:String;
}

const ITEMS_KEY = 'my-items'
const SECOND_ITEMS_KEY='my-second-items'
const PICTURE_ITEMS_KEY='profile_picture'
const TEMPLATE_KEYS='open_Time'
@Injectable({
providedIn: 'root'
})
export class StorageService{
constructor(private storage: Storage){

}
// Read
addPic(picture: ProfilePic): Promise<any>{
    return this.storage.get(PICTURE_ITEMS_KEY).then((picture: ProfilePic)=>{
        if(picture){
            return this.storage.set(PICTURE_ITEMS_KEY, picture);
        }else{
            return this.storage.set(PICTURE_ITEMS_KEY, picture);
    
        }
    });
    }

    addTemplate(template: OpenTime): Promise<any>{
        return this.storage.get(TEMPLATE_KEYS).then((template: OpenTime)=>{
            if(template){
                return this.storage.set(TEMPLATE_KEYS, template);
            }else{
                return this.storage.set(TEMPLATE_KEYS, template);
        
            }
        });
        }
        getOpeningTime(): Promise<OpenTime>{
            return this.storage.get(TEMPLATE_KEYS);
            
            }

    

addItem(item: Item): Promise<any>{
return this.storage.get(ITEMS_KEY).then((items: Item)=>{
    if(items){
        return this.storage.set(ITEMS_KEY, item);
    }else{
        return this.storage.set(ITEMS_KEY, item);

    }
});
}

addSecondItem(item: SecondItem): Promise<any>{
return this.storage.get(SECOND_ITEMS_KEY).then((items: SecondItem)=>{
    if(items){
        return this.storage.set(SECOND_ITEMS_KEY, item);
    }else{
        return this.storage.set(SECOND_ITEMS_KEY, item);

    }
});
}




update(){

}
// Read Data
getItems(): Promise<Item>{
return this.storage.get(ITEMS_KEY);

}
getSecondItems(): Promise<SecondItem>{
return this.storage.get(SECOND_ITEMS_KEY);

}

//Delete Data
deleteItem(id: number): Promise<any>{
return this.storage.get(ITEMS_KEY).then((items: Item[])=>{
    if(!items || items.length === 0 ){
        return null
    }
    let toKeep: Item[] = [];
    for (let i of items){
        if(i.id !== id){
            toKeep.push(i);
        }
    }
    return this.storage.set(ITEMS_KEY, toKeep);
});
}

deleteSecondItem(code: number): Promise<any>{
return this.storage.get(SECOND_ITEMS_KEY).then((items: SecondItem[])=>{
    if(!items || items.length === 0 ){
        return null
    }
    let toKeep: SecondItem[] = [];
    for (let i of items){
        if(i.code !== code){
            toKeep.push(i);
        }
    }
    return this.storage.set(SECOND_ITEMS_KEY, toKeep);
});
}

}