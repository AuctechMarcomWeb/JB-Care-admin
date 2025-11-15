import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{display.toLocaleString()}</span>;
}

function StatCard({ title, value, icon: Icon, color, bgColor, delay }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      x,
      y,
      id: Date.now()
    };
    
    setRipples([...ripples, newRipple]);
    setIsClicked(true);
    
    setTimeout(() => {
      setRipples(ripples.filter(r => r.id !== newRipple.id));
    }, 600);
    
    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <div 
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 transition-all duration-500 transform cursor-pointer relative overflow-hidden ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${
        isClicked ? 'scale-95' : isHovered ? 'scale-105 shadow-lg -translate-y-1' : ''
      }`}
      style={{
        borderColor: isHovered ? color.replace('text-', '') : '',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Animated gradient overlay on hover */}
      <div 
        className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : ''
        }`}
        style={{
          background: `linear-gradient(135deg, ${bgColor.replace('bg-', 'rgba(')} 0%, transparent 100%)`,
          pointerEvents: 'none'
        }}
      />
      
      {/* Ripple effect */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-blue-400 opacity-50 animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
        />
      ))}
      
      {/* Shine effect on hover */}
      {isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
            animation: 'shine 1.5s infinite'
          }}
        />
      )}
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className={`text-xs font-medium uppercase tracking-wide mb-1 transition-all duration-300 ${
            isHovered ? 'text-gray-900 tracking-wider' : 'text-gray-600'
          }`}>
            {title}
          </p>
          <p className={`text-3xl font-bold transition-all duration-300 ${
            isClicked ? 'scale-90' : isHovered ? 'scale-110' : ''
          }`} style={{ color: isHovered ? color.replace('text-', '#') : '' }}>
            <AnimatedNumber value={value} />
          </p>
        </div>
        <div 
          className={`${bgColor} rounded-full p-3 transition-all duration-300 ${
            isClicked ? 'scale-75 rotate-12' : isHovered ? 'scale-125 rotate-12 shadow-lg' : ''
          }`}
          style={{
            animation: isVisible ? (isHovered ? 'bounce 0.5s infinite' : 'bounce 2s infinite') : 'none',
            boxShadow: isHovered ? `0 10px 25px -5px ${color.replace('text-', 'rgba(').replace('600', '0.4)')}` : ''
          }}
        >
          <Icon 
            className={`${color} w-6 h-6 transition-all duration-300 ${
              isHovered ? 'animate-pulse' : ''
            }`} 
            strokeWidth={isHovered ? 2.5 : 2} 
          />
        </div>
      </div>
      
      {/* Bottom accent bar on hover */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `linear-gradient(90deg, transparent, ${color.replace('text-', '#')}, transparent)`
        }}
      />
    </div>
  );
}

export default function ComplaintsStats() {
  const stats = [
    {
      title: 'Total Complaints',
      value: 850,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      delay: 0
    },
    {
      title: 'Open Complaints',
      value: 120,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      delay: 100
    },
    {
      title: 'Resolved Complaints',
      value: 730,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      delay: 200
    },
    {
      title: 'Closed Complaints',
      value: 50,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      delay: 300
    }
  ];

  return (
        <div className="min-h-[50px] bg-gradient-to-br from-white-100 to-gray-50 p-6 border-s-transparent rounded-lg shadow-sm mb-6">

      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes ripple {
          to {
            width: 500px;
            height: 500px;
            opacity: 0;
            transform: translate(-50%, -50%);
          }
        }
        
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }
        
        .animate-ripple {
          animation: ripple 0.6s ease-out;
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto">
    
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
}