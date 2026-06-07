import { TurniManagementComponent } from '@/components/turni/turni-management';
import { TurniMatrix } from '@/components/turni/turni-matrix';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function TurniManagement() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams();
    if (!searchParams.has('month') || !searchParams.has('year')) {
      const date = new Date();
      params.append('month', format(date, 'MM'));
      params.append('year', format(date, 'yyyy'));
      setSearchParams(params, { replace: true });
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Matrice dei turni */}
      <TurniMatrix />
      
      {/* Componente di gestione turni esistente */}
      <TurniManagementComponent />
    </div>
  );
}

export default TurniManagement;