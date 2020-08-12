import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-plan-vida",
  templateUrl: "./plan-vida.component.html",
  styleUrls: ["./plan-vida.component.css"],
})
export class PlanVidaComponent implements OnInit {
  cities: any[];
  selectedCities: any[];

  constructor() {}

  ngOnInit(): void {
    this.cities = [
      { name: "New York", code: "NY" },
      { name: "Rome", code: "RM" },
      { name: "London", code: "LDN" },
      { name: "Istanbul", code: "IST" },
      { name: "Paris", code: "PRS" },
    ];
  }
}
