import { Button, Card, Container, Row, Col, Alert} from 'react-bootstrap'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import './bootstrap.min.css'
function App() {
  const [keyword,setKeyword] = useState("")
  const [ads, setAds] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  
  useEffect(() => {
    setErrorMessage('')
    axios.get(`http://localhost:5000/api/ads`)
      .then(({data}) => {
       setAds(data)
      })
      .catch(error => {
        setErrorMessage('Error')
      });
  }, []);

  const handleSubmit = async (e) => {
   try{
          e.preventDefault()
          const value = keyword ? keyword : ""
          if(value) {
            setErrorMessage("")
            setKeyword(value)
            const result =  await axios.get(`http://localhost:5000/api/search?keyword=${keyword}`)
            console.log("result", result)
            setAds(result.data)
            setKeyword("")
          } else {
            setKeyword("")
            setErrorMessage("Please enter input to search")
          }

      
   } catch(e) {
    setKeyword("")
    setErrorMessage("Please enter valid input value")
   }
  
  }

  return (
    <div style={{backgroundColor: 'purple', minHeight: '100vh'}}>
      <div style={{display: 'flex', justifyContent: 'center',alignItems: 'center', flexDirection: 'column'}}>
       <h1 className='pageTitle' >Search Ads</h1>
      <input style={{width: '250px',padding:'8px',fontSize: '16px',border: '1pxsolid#ccc',borderRadius:'2px', textAlign: 'center', marginTop: '20px'}}
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search"
      />
     <Button variant='outline-success py-2 px-3 mt-2 rounded' onClick={handleSubmit}>Search</Button>
      </div>

      <Container>
          <Row>
      {errorMessage ? <Alert variant='danger' className='mt-2'>{errorMessage}</Alert> : ads.map((ad) => {
        const regex = /\/file\/d\/([^/]+)\//;
        const match = ad.imageUrl.match(regex);
        const fileId = match && match[1];
        return <Col key={ad._id}>
          <Card style={{width: "20rem", height: '30rem'}} className='ads-card' sm={6} md={4} lg={3}>
            <div style={{width: '300px', height: '250px'}}>
              <Card.Img variant="top" className='ads-card-image' src={`https://drive.google.com/uc?id=${fileId}`} />
            </div>
          <Card.Body className='ads-card-body'>
              <Card.Title className='ads-card-title'>{ad.companyId.name}</Card.Title>
              <Card.Text>{ad.headline}</Card.Text>
              <Card.Text>{ad.primaryText}</Card.Text>
            </Card.Body>
        </Card>
        </Col>
      })
     }
        </Row>
      </Container>
    </div>
  );
}

export default App;
