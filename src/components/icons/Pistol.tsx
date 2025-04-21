import { LucideProps } from 'lucide-react';

const Pistol = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Barrel and Muzzle */}
    <path d="M14 10h7" />
    
    {/* Slide */}
    <path d="M14 7h5a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-5" />
    
    {/* Slide Serrations */}
    <line x1="17" y1="7" x2="17" y2="9" />
    <line x1="19" y1="7" x2="19" y2="9" />
    
    {/* Frame/Body */}
    <path d="M4 10h10v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3z" />
    
    {/* Trigger Guard */}
    <path d="M6 15v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3" />
    <path d="M4 19h2" />
    
    {/* Trigger */}
    <line x1="8" y1="15" x2="8" y2="16.5" />
    
    {/* Grip */}
    <path d="M9 15l3 4" />
    <path d="M12 19v-4" />
    
    {/* Magazine */}
    <path d="M7 19v2" />
    
    {/* Ejection Port */}
    <line x1="14" y1="8.5" x2="16" y2="8.5" />
    
    {/* Front Sight */}
    <line x1="20" y1="7" x2="20" y2="9" />
  </svg>
);

export default Pistol;