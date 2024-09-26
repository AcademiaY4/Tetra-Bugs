import {NextUIProvider, createTheme} from "@nextui-org/react";

import './App.css';
import {useState, useEffect} from "react";
import NavBar from "./components/NavBar";
import Main from "./components/Main";
import axios from 'axios';
import Cookies from 'js-cookie';

const lightTheme = createTheme({
  type: 'light',
  theme: {
   colors:{
    error:'#dc3545',
    secondary:'#f0f2f5',
   }
  },
  
})

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    colors:{
      error:'#dc3545',
      secondary:'#171818',
    }
  }
})

function App() {
  const [isDark, setIsDark] = useState()

  useEffect(() => {

    async function fetchCsrfToken() {
      try {
        // Fetch the CSRF token from the /csrf-token endpoint
        const response = await axios.get('/csrf-token');
        // Store the CSRF token in cookies
        Cookies.set('XSRF-TOKEN', response.data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token", error);
      }
    }

    // Call the function to fetch CSRF token
    fetchCsrfToken();

    const getIsDark = localStorage.getItem('isDark')
    
    if(getIsDark===null){
      setIsDark(false)
    }else if(getIsDark==='true'){
      setIsDark(true)
    }else if(getIsDark==='false'){
      setIsDark(false)
    }
    
    
  }, [])

  return (
    <NextUIProvider theme={isDark === true ? darkTheme : lightTheme}>
      <div className="app">
        <header className="app-header">
          <NavBar isDark={isDark} onThemeToggle={()=>setIsDark(!isDark)}/>
        </header>
        <main className='app-body'>
          <Main isDark={isDark}/>
        </main>
        <footer className='app-footer'>

        </footer>
      </div>
    </NextUIProvider>
    
  );
}

export default App;
