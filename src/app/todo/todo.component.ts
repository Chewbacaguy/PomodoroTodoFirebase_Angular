import { Component, OnInit,  Renderer2, ViewChild, ElementRef} from '@angular/core';
import { TodoService } from '../shared/todo.service';
import { MatDialog } from '@angular/material/dialog'; // Import the MatDialog



@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styles: [
  ]
})

export class TodoComponent implements OnInit {
  titleInput!: ElementRef<HTMLInputElement | null>;
  isEditingTextBox: boolean = false;
  todos: any[] = [];

  constructor(private todoService: TodoService,
    private renderer: Renderer2) { }

    ngOnInit(): void {
      this.todoService.firestoreCollection.valueChanges({ idField: 'id' })
        .subscribe(item => {
          this.todos = item.map(todo => ({ ...todo, editing: false })); // Initialize editing property
          this.todos.sort((a: any, b: any) => a.isDone - b.isDone);
        });
    }

  onClick(titleInput: HTMLInputElement) {
    if (titleInput.value) {
      this.todoService.addTodo(titleInput.value);
      titleInput.value = "";
    }
  }

  onStatusChange(id: string, newStatus: boolean) {
    this.todoService.updateTodoStatus(id, newStatus);
  }
  
  onDelete(id:string){
    this.todoService.deleteTodo(id);
  }



  onKeyPress(event: KeyboardEvent, titleInput: HTMLInputElement): void {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default Enter behavior (e.g., form submission)
      this.onClick(titleInput);
    }
  }

  

  onEditToggle(item: any, event: MouseEvent) {
    // Stop the event propagation to prevent it from reaching the parent container
    event.stopPropagation();
  
    item.editing = true;
    setTimeout(() => {
      if (this.titleInput) {
        const inputElement = this.titleInput.nativeElement as HTMLInputElement;
        inputElement.focus();
        inputElement.select();
      }
    });
  }

  onEditBlur(id: string): void {
    const updatedItem = this.todos.find(item => item.id === id);
    if (updatedItem) {
      this.todoService.updateTodoTitle(id, updatedItem.title);
      updatedItem.editing = false;
    }

  }

  onEditConfirm(item: any) {
    item.editing = false;
    this.todoService.updateTodoTitle(item.id, item.title);
  }

}
