import * as React from "react";
import {
  Card,
  CardTitle,
  CardBody,
  Button,
  Form,
  Label,
  Input,
} from "reactstrap";
import { TodoItem } from "@models";
import { DIContext } from "@helpers";
import "./todo.styles.css";

interface Props {
  todo: TodoItem;
  handleDelete: (id: string, title: string) => Promise<void>;
  handleUpdate: (id: string, title: string) => Promise<void>;
}

const TodoItemsList = ({
  todo,
  handleDelete,
  handleUpdate,
}: Props): JSX.Element => {
  const dependencies = React.useContext(DIContext);
  const { translation } = dependencies;
  const [edit, setEdit] = React.useState<boolean>(false);
  const [editTitle, setEditTitle] = React.useState<string>(todo.title);
  const [error, setError] = React.useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEditTitle(e.target.value);
  };

  const toggle = (): void => {
    setEdit(!edit);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (editTitle) {
      setError("");
      handleUpdate(todo.id, editTitle);
      setEdit(false);
    } else {
      setError(translation.t("TITLE_INVALID"));
    }
  };

  return (
    <>
      <Card body className="mx-auto">
        {edit ? (
          <Form onSubmit={handleSubmit} inline>
            <Label htmlFor="title"></Label>
            <div className="mx-auto">
              <Input
                type="text"
                onChange={handleChange}
                placeholder={translation.t("ENTER_TITLE")}
                value={editTitle}
                id="title"
              />
              <Button>
                <i className="fas fa-paper-plane"></i>
              </Button>
              {error && <div className="text-error">{error}</div>}
            </div>
          </Form>
        ) : (
          <CardBody>
            <CardTitle tag="h5">{todo.title}</CardTitle>
            <Button className="btn btn-warning" onClick={toggle}>
              Edit
            </Button>
            <Button
              className="btn btn-danger"
              onClick={(): Promise<void> => handleDelete(todo.id, todo.title)}
            >
              Delete
            </Button>
          </CardBody>
        )}
      </Card>
    </>
  );
};

export default TodoItemsList;
