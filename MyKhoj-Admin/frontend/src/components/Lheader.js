import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';


function Header() {
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/"><img src='http://images.mykhoj.org/images/logo.svg' alt='Mykhoj Logo' width={150}/></Navbar.Brand>
        
      </Container>
    </Navbar>
  );
}

export default Header;