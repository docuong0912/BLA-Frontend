import '@/styles/globals.css';
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import "../styles/globals.css";
import { useEffect } from "react";
import '@fortawesome/fontawesome-svg-core/styles.css'
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  const getLayout = Component.getLayout || ((page) => page)
 
  return getLayout(
 
    
      <Component {...pageProps}  />
     
        
  
  
  )
}
