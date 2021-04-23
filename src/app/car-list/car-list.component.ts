import { Component, OnInit } from '@angular/core';
import { CarService } from '../shared/car/car.service';
import { GiphyService } from '../shared/giphy/giphy.service';
import { OwnerService } from '../shared/owner/owner.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
  cars: Array<any>;
  constructor(private carService: CarService, private giphyService: GiphyService, private ownerService:OwnerService) { }

  ngOnInit() {
    this.carService.getAll().subscribe(data => {
      this.cars = data;
      for (const car of this.cars) {
        this.giphyService.get(car.name).subscribe(url => car.giphyUrl = url);
        if(car.ownerDni != null){ 
          this.ownerService.getOwner(car.ownerDni).subscribe((resp:any) => {
            if(resp._embedded.owners.length!){
              car.ownerName = resp._embedded.owners[0].name;
            }
            else{
              car.ownerName = "No owner registered";
            }
          });
        }
      }
      console.log(this.cars);
    });
    
  }
}
