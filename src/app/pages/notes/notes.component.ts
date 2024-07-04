import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NotesService } from './notes.services';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent implements OnInit {

  constructor(
    private notesSv : NotesService
  ){}

  listNotes:any

  async ngOnInit(){
    await this.loadListNotes();
  }

  async loadListNotes(){
    let req = await this.notesSv.getNotes();
    this.listNotes = req;
    console.log('req: ', req);
  }

  convertNumberToDate(value:any){
    if (!value || value.length !== 8) {
      return value; // Return original value if it's not valid
    }

    // Extract year, month, and day from the input string
    const year = value.substr(0, 4);
    const month = value.substr(4, 2);
    const day = value.substr(6, 2);

    // Construct the formatted date string in DD/MM/YYYY format
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }
}
