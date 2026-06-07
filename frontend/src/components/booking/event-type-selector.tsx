import { cn } from '@/lib/utils';

interface EventTypeOption {
  value: string;
  label: string;
  icon: string;
}

interface EventTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: Record<string, { label: string }>;
}

const EventTypeSelector = ({ value, onChange, options }: EventTypeSelectorProps) => {
  // Mappa le opzioni con le icone corrispondenti
  const eventTypeOptions: EventTypeOption[] = Object.keys(options).map(key => {
    let icon = '/images/icons/training-course.svg'; // Default icon
    
    // Assegna l'icona appropriata in base al tipo di evento
    switch (key) {
      case 'visita_dottore':
        icon = '/images/icons/doctor.svg';
        break;
      case 'corso_dima':
        icon = '/images/icons/training-course.svg';
        break;
      case 'taratura_carabina':
        icon = '/images/icons/rifle-scope.svg';
        break;
      case 'cinghialino_corrente':
        icon = '/images/icons/wild-boar.svg';
        break;
    }
    
    return {
      value: key,
      label: options[key].label,
      icon
    };
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      {eventTypeOptions.map((option) => (
        <div
          key={option.value}
          className={cn(
            "flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all",
            "hover:border-primary hover:shadow-md",
            value === option.value 
              ? "border-primary bg-primary/10 shadow-md" 
              : "border-gray-200"
          )}
          onClick={() => onChange(option.value)}
        >
          <div className="w-16 h-16 mb-3">
            <img 
              src={option.icon} 
              alt={option.label} 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-center font-medium">{option.label}</span>
        </div>
      ))}
    </div>
  );
};

export default EventTypeSelector;