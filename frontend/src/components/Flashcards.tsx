import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Dropdown,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Segment
} from 'semantic-ui-react'

import {  getFlashcardsByCategory, createFlashcard, deleteFlashcard, patchFlashcard } from '../api/flashcards-api'
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
  newCategory: string,
  filterByCategory: string,
  filterByMastery: string,
  loadingFlashcards: boolean
}

interface DropDownOptions {
  key: string,
  value: string,
  text: string

}
// const getRandomInt = (max: number) => {
//   return Math.floor(Math.random() * max);
// }


export class Flashcards extends React.PureComponent<FlashcardProps, FlashcardsState> {
  state: FlashcardsState = {
    flashcards: [],
    newFlashcardQuestion: '',
    newFlashcardAnswer: '',
    newCategory: 'None',
    filterByCategory: '',
    filterByMastery: 'All',
    loadingFlashcards: true
  }

  handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    this.setState({ newFlashcardQuestion: event.target.value })
  }

  handleAnswerChange = (value: string) => {
    this.setState({ newFlashcardAnswer: value })
  }

  handleCategoryInputChange = (value: string) => {
    this.setState({ newCategory: value })
  }

  handleFilterByCatChange = (value: string) => {
    this.setState({ filterByCategory: value})
  }

  handleFilterByMasteryChange = (event: React.SyntheticEvent<HTMLElement>, data: any ) => {
    console.log("setting filterByMastery to ", data.value)
    this.setState({ filterByMastery: data.value })
  }

  onAddImageClick = (flashcardId: string) => {
    this.props.history.push(`/flashcards/${flashcardId}/add`)
  }

  onFlashcardCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      console.log("token is ", this.props.auth.getIdToken())
      console.log("this new question is ", this.state.newFlashcardQuestion)
      const newFlashcard = await createFlashcard(this.props.auth.getIdToken(), {
        question: this.state.newFlashcardQuestion,
        answer: this.state.newFlashcardAnswer,
        category: this.state.newCategory,
      }) 

      this.setState({        
        flashcards: [...this.state.flashcards, newFlashcard],
        newFlashcardQuestion: '',
        newFlashcardAnswer: '',
        newCategory: 'None'
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

  onFlashcardGetByCategory = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("onFlashcardGetByCategory submit")

    // if (this.state.filterByCategory === "") {
    //   this.getAllFlashcards()
    //   return
    // }

    try {
      const flashcards = await getFlashcardsByCategory(this.props.auth.getIdToken(), this.state.filterByCategory, this.state.filterByMastery)
      this.setState({
        flashcards,
        loadingFlashcards: false
      })
    } catch (e) {
      console.log('Failed to fetch flashcards by category')
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

  getAllFlashcards = async () => {
    try {
      // const flashcards = await getFlashcardsByCategory(this.props.auth.getIdToken())
      const flashcards = await getFlashcardsByCategory(this.props.auth.getIdToken(), this.state.filterByCategory, this.state.filterByMastery)
      this.setState({
        flashcards,
        loadingFlashcards: false
      })
    } catch (e) {
      console.log('Failed to fetch flashcards on page load: ', e)
    }
  }

  async componentDidMount() {
    this.getAllFlashcards()
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
    const masteryOptions = [
      { key: 'All', value: 'All',  text: "All" },
      { key: 'Learned', value: 'true', text: "Learned" },
      { key: 'Study', value: 'false', text: "To Study" }
    ]
    return (
      <Segment>
      <Grid columns={2} relaxed='very' stackable>
        <Grid.Column>
          <Form onSubmit={(event) => this.onFlashcardCreate(event)}>
            <Form.Input label="Enter question" value={this.state.newFlashcardQuestion} onChange={(event) => this.handleQuestionChange(event)}/>
            <Form.Input label="Enter answer" value={this.state.newFlashcardAnswer} onChange={(event) => this.handleAnswerChange(event.target.value)}/>
            <Form.Input label="Category" value={this.state.newCategory} onChange={(event) => this.handleCategoryInputChange(event.target.value)}/>
            <Button content="Add Flashcard" primary type='submit'/>
          </Form>
        </Grid.Column>
        <Grid.Column verticalAlign='middle'>
          <Form onSubmit={(event) => this.onFlashcardGetByCategory(event)}>
          <Form.Input label="Filter by:" placeholder="Enter a category..." value={this.state.filterByCategory} onChange={(event) => this.handleFilterByCatChange(event.target.value)}/>
          <Dropdown 
            inline 
            fluid 
            selection 
            labeled 
            placeholder="Select learned or to study..." 
            options={masteryOptions}
            // value={this.state.filterByMastery}
            onChange={(event, data) => this.handleFilterByMasteryChange(event, data)}
          />
          <Button content="View" primary type='submit' style={{marginTop: "20px"}}/>
          </Form>
        </Grid.Column>
      </Grid>
      <Divider vertical>Or</Divider>

      </Segment>
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
        <Grid.Row style={{fontWeight:"bold", fontSize:"larger"}}>
          <Grid.Column width={1}></Grid.Column>
          <Grid.Column width={7}>Question</Grid.Column>
          <Grid.Column width={3}>Answer</Grid.Column>
          <Grid.Column width={3}>Category</Grid.Column>
        </Grid.Row>
        {this.state.flashcards.map((flashcard, pos) => {
          return (
            <Grid.Row key={flashcard.flashcardId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onFlashcardCheck(pos)}
                  checked={flashcard.mastery}
                />
              </Grid.Column>
              <Grid.Column width={7} verticalAlign="middle">
                {flashcard.question}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {flashcard.answer}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {flashcard.category}
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
