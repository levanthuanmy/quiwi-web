import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Container } from 'react-bootstrap'
import ExampleComponent from '../components/ExampleComponent/ExampleComponent'
import MyButton from '../components/MyButton/MyButton'

const Home: NextPage = () => {
  const router = useRouter()

  return (
    <Container fluid="lg">
      <div className="fs-32px fw-medium">Hello world</div>
      <ExampleComponent>This is an ExampleComponent</ExampleComponent>
      <MyButton onClick={() => router.push('/sign-in')}>
        To Sign In Page
      </MyButton>
    </Container>
  )
}

export default Home
