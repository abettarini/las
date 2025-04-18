import { TurniManagementComponent } from '@/components/turni/turni-management';
import { TurniMatrix } from '@/components/turni/turni-matrix';

export function TurniManagement() {
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