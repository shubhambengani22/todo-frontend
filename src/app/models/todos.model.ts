import { TodoItem } from "./todo.model";
import * as _ from "lodash";

export class TodoItems {
  readonly todos: TodoItem[] = [];
  constructor(data: TodoItem[]) {
    this.todos = [];
    _.forEach(data, (item): void => {
      this.todos.push(new TodoItem(item));
    });
  }
}
