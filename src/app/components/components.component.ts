import { Component, OnInit, Renderer2 } from "@angular/core";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-components",
  templateUrl: "./components.component.html",
  styles: [
    `
      ngb-progressbar {
        margin-top: 5rem;
      }

      .tab {
        font-size: 40px;
      }
    `,
  ],
})
export class ComponentsComponent implements OnInit {
  page = 4;
  page1 = 5;
  focus;
  focus1;
  focus2;
  date: { year: number; month: number };
  model: NgbDateStruct;

  books: Array<any>;
  selectedBook: string;

  constructor(private renderer: Renderer2) {
    this.books = [
      { name: "Book1", author: "Author1" },
      { name: "Book2", author: "Author2" },
      { name: "Book3", author: "Author3" },
      { name: "Book4", author: "Author4" },
      { name: "Book5", author: "Author5" },
      { name: "Libro1", author: "Author1" },
      { name: "Libro2", author: "Author2" },
      { name: "Libro3", author: "Author3" },
      { name: "Libro4", author: "Author4" },
      { name: "Libro5", author: "Author5" },
    ];
  }
  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  bookSelected(event) {
    console.log(event.name);
  }

  isDisabled(date: NgbDateStruct, current: { month: number }) {
    return date.month !== current.month;
  }

  ngOnInit() {
    let input_group_focus = document.getElementsByClassName("form-control");
    let input_group = document.getElementsByClassName("input-group");
    for (let i = 0; i < input_group.length; i++) {
      input_group[i].children[0].addEventListener("focus", function () {
        input_group[i].classList.add("input-group-focus");
      });
      input_group[i].children[0].addEventListener("blur", function () {
        input_group[i].classList.remove("input-group-focus");
      });
    }
  }
}
