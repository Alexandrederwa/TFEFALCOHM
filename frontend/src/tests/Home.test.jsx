import { render, screen, cleanup } from "@testing-library/react";
// Importing the jest testing library
import '@testing-library/jest-dom'
import Home from "../pages/home/Home";
import {BrowserRouter as Router} from 'react-router-dom';
 
// afterEach function runs after each test suite is executed
afterEach(() => {
    cleanup(); 
})
  
describe("Button Component" ,() => {
    render(<Router>
        <Home />,
      </Router>,
    ); 

// Unit test 1 : 
    const title1 = screen.getByTestId('textTitle');  
    test("Title rendering", () => {
        expect(title1).toBeInTheDocument(); 
    })
    test("Title informations", () => {
        expect(title1).toHaveTextContent("A propos"); 
    })
//Unit test 2 :
    const button = screen.getByTestId('buttonAsk'); 
    test("Button text", () => {
        expect(button).toHaveTextContent("Faire une demande"); 
    })
//Unit test 3 :
    const footer = screen.getByTestId('footerText'); 
    test("Test du contenu du text affiché dans le footer", () => {
        expect(footer).toHaveTextContent("FAQ"); 
    })
    
 

})