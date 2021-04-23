import { Component, OnInit } from '@angular/core';
import {OwnerService} from '../shared/owner/owner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../shared/car/car.service';

@Component({
  selector: 'app-owner-list',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.css']
})
export class OwnerListComponent implements OnInit {
  owners:Array<any>;
  ownersChecked:Array<any> =[];
  ownersId:Array<any>=[];
  car:any ={};
  constructor(private ownerService:OwnerService, route: ActivatedRoute, private router: Router,private carService:CarService) { }

  ngOnInit() {
    this.ownerService.getAll().subscribe((resp:any)=>{
      this.owners = resp._embedded.owners;
      console.log(this.owners);
    })
  }


  ownersChecks(href:string,id:string,e){
    console.log(e.target.checked);
    if(e.target.checked){
      this.ownersChecked.push(href);
      this.ownersId.push(id);
    }else{ 
      this.ownersChecked.map((values,i)=>{
        if(values === href){
            this.ownersChecked.splice(i,1);
            
        }
      })
      this.ownersChecked.map((values,i)=>{
        if(values === href){
          this.ownersId.splice(i,1);        
        }
      })
      
    }
  
    console.log(this.ownersChecked);
  }
  
   deleteOWners(){
    for (let j = 0; j < this.ownersId.length; j++) {
      this.carService.getAll().subscribe((resp:any)=>{
        for (let index = 0; index < resp.length; index++) {
          if(resp[index].ownerDni==this.ownersId[j]){
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
      
    }
     this.ownerService.removeOWners(this.ownersChecked).subscribe((resp)=>{
       console.log(resp);
       this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/owner-list']);
     })
   } 
}
