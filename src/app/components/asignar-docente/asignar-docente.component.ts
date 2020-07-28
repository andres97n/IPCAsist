import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-asignar-docente",
  templateUrl: "./asignar-docente.component.html",
  styleUrls: ["./asignar-docente.component.css"],
})
export class AsignarDocenteComponent implements OnInit {
  books: Array<any>;
  palabra: string;
  libros: string[];

  constructor() {
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

    this.libros = [
      "Book1",
      "Book2",
      "Book3",
      "Book4",
      "Book5",
      "Libro1",
      "Libro2",
      "Libro3",
      "Libro4",
      "Libro5",
    ];
  }

  ngOnInit(): void {}
}
