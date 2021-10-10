import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

// import { createTodo, deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import { getFlashcards, createFlashcard, deleteFlashcard } from '../api/flashcards-api'
import Auth from '../auth/Auth'
import { Flashcard } from '../types/Flashcard'

interface TodosProps {
  auth: Auth
  history: History
}

interface FlashcardsState {
  flashcards: Flashcard[]
  newFlashcardQuestion: string
  loadingFlashcards: boolean
}

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
}


export class Flashcards extends React.PureComponent<TodosProps, FlashcardsState> {
  state: FlashcardsState = {
    flashcards: [],
    newFlashcardQuestion: '',
    loadingFlashcards: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newFlashcardQuestion: event.target.value })
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      console.log("token is ", this.props.auth.getIdToken())
      const newFlashcard = await createFlashcard(this.props.auth.getIdToken(), {
        question: this.state.newFlashcardQuestion,
        answer: ""
      }) 

      this.setState({
        flashcards: [...this.state.flashcards, newFlashcard],
        newFlashcardQuestion: ''
      })
    } catch (e) {
      if (e instanceof TypeError) {
        console.log("Type error")
      }
      else if (e instanceof EvalError) {
        console.log("Eval Error")
      }
      else {
        console.log('Todo creation failed')
      }
    }
  }

  onFlashcardDelete = async (flashcardId: string) => {
    try {
      await deleteFlashcard(this.props.auth.getIdToken(), flashcardId)
      this.setState({
        flashcards: this.state.flashcards.filter(flashcard => flashcard.flashcardId != flashcardId)
      })
    } catch {
      alert('Flashcard deletion failed')
    }
  }

  // onTodoCheck = async (pos: number) => {
  //   try {
  //     const todo = this.state.todos[pos]
  //     await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
  //       name: todo.name,
  //       dueDate: todo.dueDate,
  //       done: !todo.done
  //     })
  //     this.setState({
  //       todos: update(this.state.todos, {
  //         [pos]: { done: { $set: !todo.done } }
  //       })
  //     })
  //   } catch {
  //     alert('Todo check failed')
  //   }
  // }

  async componentDidMount() {
    try {
      const flashcards = await getFlashcards(this.props.auth.getIdToken())
      this.setState({
        flashcards,
        loadingFlashcards: false
      })
    } catch (e) {
      console.log('Failed to fetch todos: ', e)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Flashcards!</Header>

        {this.renderCreateTodoInput()}

        {this.renderFlashcards()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Add flashcard',
              onClick: this.onTodoCreate
            }}
            fluid
            actionPosition="left"
            placeholder="School in Spanish?"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderFlashcards() {
    if (this.state.loadingFlashcards) {
      return this.renderLoading()
    }

    return this.renderFlashcardsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Flashcards
        </Loader>
      </Grid.Row>
    )
  }

  renderFlashcardsList() {
    return (
      <Grid padded>
        {this.state.flashcards.map((flashcard, pos) => {
          return (
            <Grid.Row key={flashcard.flashcardId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  // onChange={() => this.onTodoCheck(pos)}
                  checked={flashcard.mastery}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {flashcard.question}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {flashcard.answer}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(flashcard.flashcardId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onFlashcardDelete(flashcard.flashcardId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {flashcard.attachmentUrl && (
                <Image src={flashcard.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
