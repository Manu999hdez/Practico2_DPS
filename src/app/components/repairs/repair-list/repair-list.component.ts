import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';

// model
import { Repair } from '../../../models/repair';

// service
import { RepairService } from '../../../services/repair.service';

// toastr
import { ToastrService } from 'ngx-toastr'; 
import Swal from 'sweetalert2';

//PDF
import {jsPDF} from 'jspdf';

@Component({
  selector: 'app-repair-list',
  templateUrl: './repair-list.component.html',
  styleUrls: ['./repair-list.component.css']
})
export class RepairListComponent implements OnInit {
  repairList: Repair[];
  buscar: string;

  constructor(
    private repairService: RepairService,
    private toastr: ToastrService
  ) { }

  /* 
    Cuando cargue la aplicación, que reciba toda la información con el método 'getProducts' del servicio de firebase
     pero ademas que utilice el metodo 'snapshotChanges' para estar atento a los cambios que tengas los datos en la
     base de datos de firebase, para recorrerlo con forEach. 
  
     Cada dato lo obtengo 'payload' y lo convierto en formato JSON y lo asigno a la variable 'x'
     let x = element.payload.toJSON();
  
     Se le asigna por cada elemento la llave de cada registro, en una propiedad llamada '$key'
     por que se necesita para luego eliminar el registro
     x["$key"] = element.key;
  
     Cuando ya se tiene el elemento se asigna a mi arreglo 'productList' para ser mostrado en mi pantalla list
     this.productList.push(x as Product);
  */
  ngOnInit() {
      this.repairService.getRepairs().snapshotChanges().subscribe(item => {
       this.repairList = [];
       item.forEach(element => {
         let x = element.payload.toJSON();
         x["$key"] = element.key;
         this.repairList.push(x as Repair);
       });
     });

  }

  consult(){
     

      this.repairList=this.repairList.filter(data =>{
        return data.dui.toString().trim() === this.buscar;
      })
      console.log(this.buscar, this.repairList, this.repairList.length);

      if(this.repairList.length === 0){
        this.ngOnInit();
         Swal.fire({
           icon: 'error',
           title: 'Oops...',
           text: 'Data not found',
           showConfirmButton: false,
           timer: 1500
         })
        }else{
          Swal.fire({
            icon: 'success',
            title: 'Data found',
            showConfirmButton: false,
            timer: 1500
          })
      }
  }
  /* 
   Recibe una varible de tipo 'Repair' para invocar el servicio de firebase, para actualizarlo
   Para no ocupar el doble enlace de datos ' [(ngModel)]' , se va utilizar 'Object.assign({}, product)'  
  */
    onEdit(repair: Repair) {
      this.repairService.selectedRepair = Object.assign({}, repair);
      
    }

      /* 
   Recibe la llave '$key' para eliminar el registro, invocando el metodo 'deleteProduct' del servicio de firebase
   ademas muestra un 'warning' con toastr
*/
    onDelete($key: string) {
      if (confirm('Are you sure you want to delete it?')){
        this.repairService.deleteRepair($key);
        this.toastr.warning('Deleted Successfully', ' Repair Removedd');
      }
    }
}
