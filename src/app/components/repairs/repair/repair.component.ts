import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

// model
import { Repair } from '../../../models/repair';

// service
import { RepairService } from '../../../services/repair.service';

// toastr
import { ToastrService } from 'ngx-toastr'; 
import Swal from 'sweetalert2';

//PDF
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-repair',
  templateUrl: './repair.component.html',
  styleUrls: ['./repair.component.css']
})
export class RepairComponent implements OnInit {

  contador:number;
  duis: Repair[];
  c:number;
  descuento:number;
  repdui : any;
  valor: any;
  

  constructor(
    public repairService: RepairService,
    private toastr: ToastrService
  ) { }

// Cuando se levanta la aplicacion, llama al metodo del servicio firebase para traer los productos
  
  ngOnInit() {
       this.repairService.getRepairs();
       this.resetForm();
       this.contador=0;
       this.c=0;
       this.descuento=0;
       this.repairService.getRepairs().snapshotChanges().subscribe(item => {
        this.duis = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.duis.push(x as Repair);
        });
      });
       
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
        Swal.fire({
          icon: 'success',
          title: 'Data found',
          showConfirmButton: false,
          timer: 1500
        })
      } else if(this.c>5) {
        this.descuento=repairForm.value.price*0.92
        repairForm.value.price=this.descuento;
        this.repairService.insertRepair(repairForm.value);
        this.duis.push(repairForm.value.dui);
        this.contador++;
        Swal.fire({
          icon: 'success',
          title: 'Data found',
          showConfirmButton: false,
          timer: 1500
        })
      }
      else{
        this.repairService.insertRepair(repairForm.value);
        this.duis.push(repairForm.value.dui);
        this.contador++;
        Swal.fire({
          icon: 'success',
          title: 'Data found',
          showConfirmButton: false,
          timer: 1500
        })
      }
      this.c=1;
    }
    else{
      this.repairService.updateRepair(repairForm.value);
      Swal.fire({
        icon: 'success',
        title: 'Data found',
        showConfirmButton: false,
        timer: 1500
      })
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


  generatePdf(action = 'open') {
    const documentDefinition = this.getDocumentDefinition();
    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      default: pdfMake.createPdf(documentDefinition).open(); break;
    }
  }
  getDocumentDefinition() {
    sessionStorage.setItem('cliente', JSON.stringify(this.repairService.getRepairs));
    return {
      content: [
        {
          text: 'Factura Taller Don Alex',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
          color: 'black'
        },
        {
          columns: [
            {
              layout: 'lightHorizontalLines', // optional
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ '*', 'auto', 100, '*' ],
        
                body: [
                  [ 'NAME', 'DUI', 'VEHICLE', 'PRICE' ],
                  [ this.repairService.selectedRepair.name, this.repairService.selectedRepair.dui, this.repairService.selectedRepair.vehicle, this.repairService.selectedRepair.price+'$' ],
                  //[ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', this.repairService.selectedRepair.price ]
                ]
              }
            }
          ]
        

        }],
        styles: {
          name: {
            fontSize: 16,
            bold: true
          }
        }

    };

}

}
