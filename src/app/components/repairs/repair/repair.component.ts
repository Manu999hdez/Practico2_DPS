import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

// model
import { Repair } from '../../../models/repair';

// service
import { RepairService } from '../../../services/repair.service';

// toastr
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-repair',
  templateUrl: './repair.component.html',
  styleUrls: ['./repair.component.css']
})
export class RepairComponent implements OnInit {

  contador:number;
  duis=[]
  c:number;
  descuento:number;

  constructor(
    public repairService: RepairService,
    private toastr: ToastrService
  ) { }

// Cuando se levanta la aplicacion, llama al metodo del servicio firebase para traer los productos
  
  ngOnInit() {
       this.repairService.getRepairs();
       this.resetForm();

    this.contador=0;
    this.c=1;
    this.descuento=0;
     }

  // Recibe un formulario del tipo NgForm, lo envia a guardar o actualizar , invocando el servicio Firebase
  // lo termina limpiando resetForm
  onSubmit(repairForm: NgForm) {
    if (repairForm.value.$key == null){
      
    this.repairService.getRepairs()
    .snapshotChanges().subscribe((res) => {
      var i = 0 ;
      this.c = res.length;
      res.forEach(element => {
        let x = element.payload.toJSON();
        x["dui"] = element.key;
         
            if(x ==repairForm.value.dui) {
              i++ ;
              console.log(i);
            } 
      
          });
      //use you variable here
      console.log(i);
      
    });
   

    for (let i = 0; i < this.duis.length; i++) {
      if (repairForm.value.dui==this.duis[i]) {
        this.c++;
      }
     }
   
     if (this.c>=2 && this.c<=5) {
      this.descuento=repairForm.value.price*0.95
      repairForm.value.price=this.descuento;
      this.repairService.insertRepair(repairForm.value);
      this.duis.push(repairForm.value.dui);
      this.contador++;
    } else if(this.c>5) {
      this.descuento=repairForm.value.price*0.92
      repairForm.value.price=this.descuento;
      this.repairService.insertRepair(repairForm.value);
      this.duis.push(repairForm.value.dui);
      this.contador++;
    }
    else{
      this.repairService.insertRepair(repairForm.value);
      this.duis.push(repairForm.value.dui);
      this.contador++;
    }
    this.c=1;
  }
  else{
    this.repairService.updateRepair(repairForm.value);
  }
  this.resetForm(repairForm);
  this.toastr.success('Operacion Exitosa', 'Registrado!');
  }

  // Para limpiar el formulario
  resetForm(repairForm?: NgForm) {
    if (repairForm != null)
    repairForm.reset();
    this.repairService.selectedRepair = new Repair();
  }
}
