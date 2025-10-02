import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { HomePage } from './pages/HomePage'
import { StudentLogin } from './pages/StudentLogin'
import { StudentSignup } from './pages/StudentSignup'

function App() {

  return (
    <>
      <head>
        <style>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&family=Secular+One&display=swap" rel="stylesheet" />
        </style>

      </head>
      <BrowserRouter>
              <Routes>
                <Route index element={<HomePage />} />
                <Route path='/student-login' element={<StudentLogin />} />
                <Route path='/student-signup' element={<StudentSignup />} />
                <Route path='/student-login' element={<StudentLogin />} />
              </Routes>
            </BrowserRouter>
          </>
          );
}

          export default App
