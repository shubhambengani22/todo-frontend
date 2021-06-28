export class TodoItem {
  id: string;
  title: string;
  constructor(todo: any) {
    this.id = todo.id;
    this.title = todo.title;
  }
}
