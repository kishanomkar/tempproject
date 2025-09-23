// tourist/components/MainLayout.js
import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import AskAI from './AskAI';

export default function MainLayout() {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar />
      <main className='flex-1 overflow-y-auto'>
        <Outlet />
      </main>
      <AskAI/>
    </div>
  );
}