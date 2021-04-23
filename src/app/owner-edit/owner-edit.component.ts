import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { OwnerService } from '../shared/owner/owner.service';
import { CarService } from '../shared/car/car.service';

@Component({
  selector: 'app-owner-edit',
  templateUrl: './owner-edit.component.html',
  styleUrls: ['./owner-edit.component.css']
})
export class OwnerEditComponent implements OnInit, OnDestroy {
  owner: any = {};
  sub: Subscription;
  car:any ={};

  constructor(private route: ActivatedRoute, private router: Router, private ownerService:OwnerService,private carService:CarService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.ownerService.getOwner(id).subscribe((resp: any) => {
          console.log(resp);
          if (resp) {
            this.owner = resp._embedded.owners[0];
            this.owner.href = resp._embedded.owners[0]._links.self.href;
          } else {
            console.log(`Car with id '${id}' not found, returning to list`);
            this.gotoList();
          }
        });
      }
    });
  }
  
  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  gotoList() {
    this.router.navigate(['/owner-list']);
  }

  save(form: NgForm) {
    console.log(form);
    this.ownerService.save(form).subscribe(result => {
      this.gotoList();
    }, error => console.error(error));
  }
  remove(href:string,dni:string){
    this.carService.getAll().subscribe((resp:any)=>{
      for (let index = 0; index < resp.length; index++) {
        if(resp[index].ownerDni==dni){
          this.carService.get(resp[index].id).subscribe((result:any)=>{
              this.car ={
                name:result.name,
                ownerDni:null,
                href:result._links.self.href

              }
              this.carService.save(this.car).subscribe(resp=>{

              });
          })
        }
      }
    })

    this.ownerService.remove(href).subscribe(result => {
      this.gotoList();
    }, error => console.error(error));
  }
}
