import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
} from 'semantic-ui-react'

// import { createTodo, deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import { getFlashcards, createFlashcard, deleteFlashcard, patchFlashcard } from '../api/flashcards-api'
import Auth from '../auth/Auth'
import { Flashcard } from '../types/Flashcard'

interface FlashcardProps {
  auth: Auth
  history: History
}

interface FlashcardsState {
  flashcards: Flashcard[]
  newFlashcardQuestion: string
  newFlashcardAnswer: string
  newCategory: string
  loadingFlashcards: boolean
}

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
}


export class Flashcards extends React.PureComponent<FlashcardProps, FlashcardsState> {
  state: FlashcardsState = {
    flashcards: [],
    newFlashcardQuestion: '',
    newFlashcardAnswer: '',
    newCategory: 'None',
    loadingFlashcards: true
  }

  handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    this.setState({ newFlashcardQuestion: event.target.value })
  }

  handleAnswerChange = (value: string) => {
    this.setState({ newFlashcardAnswer: value })
  }

  onAddImageClick = (flashcardId: string) => {
    this.props.history.push(`/flashcards/${flashcardId}/add`)
  }

  // onFlashcardCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
  onFlashcardCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      console.log("token is ", this.props.auth.getIdToken())
      console.log("this new question is ", this.state.newFlashcardQuestion)
      const newFlashcard = await createFlashcard(this.props.auth.getIdToken(), {
        question: this.state.newFlashcardQuestion,
        answer: this.state.newFlashcardAnswer,
        category: this.state.newCategory
      }) 

      this.setState({        
        flashcards: [...this.state.flashcards, newFlashcard],
        newFlashcardQuestion: '',
        newFlashcardAnswer: '',
        newCategory: ''
      })
    } catch (e) {
      if (e instanceof TypeError) {
        console.log("Type error")
      }
      else if (e instanceof EvalError) {
        console.log("Eval Error")
      }
      else {
        console.log('Flashcard creation failed')
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

  onFlashcardCheck = async (pos: number) => {
    try {
      const flashcard = this.state.flashcards[pos]
      await patchFlashcard(this.props.auth.getIdToken(), flashcard.flashcardId, {
        question: flashcard.question,
        answer: flashcard.answer,
        mastery: !flashcard.mastery
      })
      this.setState({
        flashcards: update(this.state.flashcards, {
          [pos]: { mastery: { $set: !flashcard.mastery } }
        })
      })
    } catch {
      alert('Flashcard check failed')
    }
  }


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
      <Form onSubmit={(event) => this.onFlashcardCreate(event)}>
        <Form.Input label="Enter question" value={this.state.newFlashcardQuestion} onChange={(event) => this.handleQuestionChange(event)}/>
        <Form.Input label="Enter answer" value={this.state.newFlashcardAnswer} onChange={(event) => this.handleAnswerChange(event.target.value)}/>
        <Button type='submit'>Submit</Button>
      </Form>
      // <Grid.Row columns="equal">
      //   <Grid.Column>
      //     <Input
      //       action={{
      //         color: 'teal',
      //         labelPosition: 'left',
      //         icon: 'add',
      //         content: 'Add flashcard',
      //         onClick: this.onFlashcardCreate
      //       }}
      //       fluid
      //       // actionPosition="left"
      //       placeholder="School in Spanish?"
      //       onChange={(event) => this.handleQuestionChange(event.target.value)}
      //     />
      //   </Grid.Column>

      //   <Grid.Column>
      //     <Input fluid placeholder="answer"/>
      //   </Grid.Column>

      //   <Grid.Column>
      //     <Divider />
      //   </Grid.Column>
      // </Grid.Row>
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
                  onChange={() => this.onFlashcardCheck(pos)}
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
                  onClick={() => this.onAddImageClick(flashcard.flashcardId)}
                >
                  <Icon name="file image outline" />
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
}
