import React,{useEffect} from 'react'
import { animateHomeElements } from '../../animation/gsap'
import Navbar from '../../components/Navbar'
const Home = () => {
  useEffect(() => {
    animateHomeElements();
     // Ensure audio plays automatically
   
     
  }, []);

  return (
    <div className='bg-[#FCEEDC] w-screen h-screen flex justify-center items-center relative overflow-hidden'>
 
<Navbar />
      {/* Yellow Circle */}
      <div className='absolute z-0 w-250 h-250 bg-[#efb556] rounded-full top-70 yellow-cirlce'></div>
      {/* Image */}
      <div className='relative z-50 '>
        <img className='scale-155 mt-30 z-10' src="krishna.png" alt="Krishna" />
      </div>
      {/* Left Side Image */}
      <img
        className='absolute left-0 bottom-0 transform w-[250px] h-full left-image'
        src="banana.png"
        alt="Left Side"
      />
        {/* Right Side Image */}
        <img
        className='absolute z-0 right-0 opacity-0.5 bottom-0 transform scale-x-[-1] w-[250px] h-full right-image'
        src="banana.png"
        alt="Left Side"
      />
    </div>
  )
}

export default Home