import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate();
  useEffect(() => {
 

    gsap.fromTo(
        '.navbar-logo , .navbar-button',
        { autoAlpha: 0, y: -250 },
        { autoAlpha: 1, y: 0, duration: 3.5, ease: 'power2.out' }
      );
  }, []);

    const onChatClick = () => {
    // const chatUrl = 'https://chat.openai.com/chat';
//    alert("chat button clicked")
   navigate('/chat') // Replace with actual chat URL if needed
   
    }

    return (
      <div className="fixed top-[-30px] left-1/2 transform -translate-x-1/2 w-[90%] z-[9999] flex justify-between items-center bg-transparent px-2 sm:px-6 py-4 sm:py-2">
    <img
  src="/logo2.png"
  alt="Chat with Krishna"
  className="navbar-logo w-22 h-22 min-w-30 min-h-30 sm:w-56 sm:h-56"
/>
<button
  className="relative flex items-center gap-2 bg-yellow-400 text-gray-800 font-poppins font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg hover:bg-yellow-400 hover:translate-y-[-3px] hover:shadow-xl navbar-button text-sm sm:text-base"
 // Move the button upward by 10px
  onClick={onChatClick}
>
  <span>Chat</span>
  <span className="text-lg sm:text-xl">💬</span>
</button>
      </div>
    );
  }
export default Navbar;
