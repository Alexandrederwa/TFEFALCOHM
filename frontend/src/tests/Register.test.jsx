import { render, screen, cleanup } from "@testing-library/react";
// Importing the jest testing library
import '@testing-library/jest-dom'
import Register from "../pages/register/Register";
import {BrowserRouter as Router} from 'react-router-dom';
 
// afterEach function runs after each test suite is executed
afterEach(() => {
    cleanup(); // Resets the DOM after each test suite
})
  
describe("Button Component" ,() => {
    render(<Router>
        <Register />,
      </Router>,
    ); 

// Unit test 1 : 
    const mail = screen.getByTestId('emailTest');  
    test("Email dont have wrong class MUI", () => {
    expect(mail).not.toHaveClass("Mui-checked");
    })

//Unit test 2 :
    const box = screen.getByTestId('boxTest');  
    test("Box not have wrong class MUI", () => {
    expect(box).not.toHaveClass("Mui-checked");
    })
//Unit test 3 :
const checkBox = screen.getByTestId('checkBoxTest');  
test("CheckBox not have wrong class MUI", () => {
expect(checkBox).not.toHaveClass("Mui-required");
})

//fin
    
 

})