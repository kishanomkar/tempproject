import React from 'react'
import { LuMessageCircle } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';

function AskAI() {

const navigate = useNavigate();

  return (
    <div className='absolute top-[80vh] left-[88vw] bg-[#009689] text-white p-4 rounded-full z-1000 '>
      <div onClick={()=> navigate('/home/chatbot')}  className='text-3xl'>
    <LuMessageCircle />
</div>
    </div>
  )
}

export default AskAI