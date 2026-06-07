import React from 'react';
import Pistol from './Pistol';

const IconTest: React.FC = () => {
  return (
    <div className="p-8 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Pistol Icon Test</h1>
      
      <div className="flex gap-8 items-center">
        <div className="flex flex-col items-center">
          <p>Default Size</p>
          <Pistol />
        </div>
        
        <div className="flex flex-col items-center">
          <p>Large (32px)</p>
          <Pistol size={32} />
        </div>
        
        <div className="flex flex-col items-center">
          <p>Colored</p>
          <Pistol color="#0066cc" />
        </div>
        
        <div className="flex flex-col items-center">
          <p>Thicker Stroke</p>
          <Pistol strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

export default IconTest;