import * as React from "react";
import { useAsyncEffect } from "use-async-effect";
import { Jumbotron, Container, Form, Input, Label, Button } from "reactstrap";

import { DIContext, ComponentViewState, ComponentState } from "@helpers";

import "./todo.styles.css";
import { TodoItem, TodoItems } from "@models";
import TodoItemsList from "./todo.list";

const TodoComponent = (): JSX.Element => {
  const [title, setTitle] = React.useState<string>("");
  const [todos, setTodos] = React.useState<TodoItems>({ todos: [] });
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const dependencies = React.useContext(DIContext);
  const { translation, todoService } = dependencies;

  const [state, setComponentState] = React.useState<ComponentState>({
    componentState: ComponentViewState.DEFAULT,
  });

  const { componentState, error } = state;

  const isError = componentState === ComponentViewState.ERROR;

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setComponentState({ componentState: ComponentViewState.LOADING });
    if (title) {
      const response = await todoService.addTodo(title);
      if (response.hasData() && response.data) {
        setComponentState({ componentState: ComponentViewState.LOADED });
        const newTodos = [...todos.todos, response.data];
        setTodos({ todos: newTodos });
        setComponentState({
          componentState: ComponentViewState.DEFAULT,
          error: translation.t("SUCCESSFULLY_ADDED"),
        });
        setErrorMessage("");
      } else {
        const msg = response.error || translation.t("ERROR_CREATING_ITEM");
        setErrorMessage(translation.t("ERROR_CREATING_ITEM"));
      }
      setTitle("");
    } else {
      setErrorMessage(translation.t("TITLE_INVALID"));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
  };

  const getAllTodos = async (): Promise<void> => {
    setComponentState({ componentState: ComponentViewState.LOADING });
    const response = await todoService.getTodos();
    if (response.hasData() && response.data) {
      setComponentState({ componentState: ComponentViewState.LOADED });
      setTodos(response.data);
    } else {
      const msg = response.error || translation.t("NO_INTERNET");
      setComponentState({
        componentState: ComponentViewState.ERROR,
        error: msg,
      });
    }
  };

  useAsyncEffect(async (): Promise<void> => {
    await getAllTodos();
  }, []);

  const handleUpdate = async (id: string, title: string): Promise<void> => {
    setComponentState({ componentState: ComponentViewState.LOADING });
    const response = await todoService.updateTodo(id, title);
    if (response.hasData() && response.data) {
      setComponentState({ componentState: ComponentViewState.LOADED });
      const newtodos: any = todos.todos.map((todo: TodoItem): any =>
        todo.id === id ? response.data : todo
      );
      setComponentState({
        componentState: ComponentViewState.ERROR,
        error: translation.t("SUCCESSFULLY_UPDATED"),
      });
      setTodos({ todos: newtodos });
    } else {
      const msg = response.error || translation.t("NO_INTERNET");
      setComponentState({
        componentState: ComponentViewState.ERROR,
        error: msg,
      });
    }
  };

  const handleDelete = async (id: string, title: string): Promise<void> => {
    setComponentState({ componentState: ComponentViewState.LOADING });
    const response = await todoService.deleteTodo(id, title);
    if (response.hasData() && response.data) {
      setComponentState({ componentState: ComponentViewState.LOADED });
      setTodos({
        todos: todos.todos.filter((todo: any): any => todo.id !== id),
      });
      setComponentState({
        componentState: ComponentViewState.ERROR,
        error: translation.t("SUCCESSFULLY_REMOVED"),
      });
    } else {
      const msg = response.error || translation.t("NO_INTERNET");
      setComponentState({
        componentState: ComponentViewState.ERROR,
        error: msg,
      });
    }
  };

  const todosList = todos.todos.map((el: TodoItem): JSX.Element => {
    return (
      <TodoItemsList
        key={el.id}
        todo={el}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
      />
    );
  });

  return (
    <div>
      <Jumbotron fluid>
        <Container fluid>
          <Form onSubmit={handleSubmit} inline>
            <Label htmlFor="title"></Label>
            <div className="mx-auto">
              <Input
                type="text"
                onChange={handleChange}
                placeholder={translation.t("ENTER_TITLE")}
                value={title}
                id="title"
              />
              <Button>
                <i className="fas fa-paper-plane"></i>
              </Button>
            </div>
          </Form>
          <br />
          {errorMessage && <div className="text-error">{errorMessage}</div>}
        </Container>
      </Jumbotron>
      {todosList}
      {isError && <div> {error} </div>}
    </div>
  );
};

export default TodoComponent;
