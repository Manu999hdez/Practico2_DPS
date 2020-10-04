import { Injectable } from '@angular/core';

// Firebase
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

// Model
import { Repair } from '../models/repair';

@Injectable({
  providedIn: 'root'
})
export class RepairService {
  // Traer los datos de firebase
  repairList: AngularFireList<any>;

  // Una variable temporal, para guardar los datos seleccionados, del tipo Product
  selectedRepair: Repair = new Repair();

  constructor(private firebase: AngularFireDatabase) { }

  // Traer todos los productos desde firebase 
  getRepairs() { // guarda los elementos en la varible 'products'
    return this.repairList = this.firebase.list('repairs');
  }

  // crear un nuevo producto  , recibiendo un parametro de tipo Product
  insertRepair(repair: Repair) {
    // agregar un dato al final de la lista, como recibe un objeto del tipo Product , puede acceder a sus propiedades
    this.repairList.push({
      name: repair.name,
      dui: repair.dui,
      vehicle: repair.vehicle,
      price: repair.price
    });
  }

  // Actualiza un producto, recibiendo un parametro de tipo Product
  updateRepair(repair: Repair) {
    // Utilizando el metodo update de firebase , se envia clave y los parametros que va actualizar 
    this.repairList.update(repair.$key, {
      name: repair.name,
      dui: repair.dui,
      vehicle: repair.vehicle,
      price: repair.price
    });
  }

  // Elimina un producto, recibiendo como parametro la clave , utilizando el metodo remove de firebase
  deleteRepair($key: string) {
    this.repairList.remove($key);
  }
} 