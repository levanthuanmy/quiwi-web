import type { NextPage } from 'next'
import { Container } from 'react-bootstrap'
import ExampleComponent from '../components/ExampleComponent/ExampleComponent'

const Home: NextPage = () => {
  return (
    <Container fluid="lg">
      <div className="fs-32px fw-medium">Hello world</div>
      <ExampleComponent>This is an ExampleComponent</ExampleComponent>
    </Container>
  )
}

export default Home
