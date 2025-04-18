import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { User } from '../../context/auth-context';
import { getUsers, updateUser } from '../../services/admin-service';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [isSaving, setIsSaving] = useState(false);

  // Carica gli utenti all'avvio e quando cambiano i parametri di ricerca
  useEffect(() => {
    loadUsers();
  }, [currentPage, pageSize, searchTerm]);

  // Funzione per caricare gli utenti
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers({
        page: currentPage,
        limit: pageSize,
        search: searchTerm.length > 2 ? searchTerm : undefined
      });

      if (response.success) {
        // Log per debug
        console.log('Utenti caricati:', response.users);
        
        // Assicurati che tutti gli utenti abbiano un array di ruoli
        const usersWithRoles = response.users.map(user => ({
          ...user,
          roles: user.roles || ['ROLE_USER']
        }));
        
        setUsers(usersWithRoles);
        setTotalUsers(response.total);
      } else {
        toast.error('Errore', {
          description: response.message || 'Impossibile caricare gli utenti'
        });
      }
    } catch (error) {
      console.error('Errore durante il caricamento degli utenti:', error);
      toast.error('Errore', {
        description: 'Si è verificato un errore durante il caricamento degli utenti'
      });
    } finally {
      setLoading(false);
    }
  };

  // Funzione per aprire il modale di modifica
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditedUser({...user});
    setIsEditDialogOpen(true);
  };

  // Funzione per gestire i cambiamenti nei campi del form
  const handleInputChange = (field: keyof User, value: any) => {
    if (editedUser) {
      // Se stiamo modificando i ruoli, assicuriamoci che siano gestiti correttamente
      if (field === 'roles') {
        console.log('Aggiornamento ruoli:', value);
        
        // Assicurati che i ruoli siano sempre un array
        const updatedRoles = Array.isArray(value) ? value : ['ROLE_USER'];
        
        // Assicurati che ROLE_USER sia sempre incluso
        if (!updatedRoles.includes('ROLE_USER')) {
          updatedRoles.push('ROLE_USER');
        }
        
        setEditedUser({
          ...editedUser,
          roles: updatedRoles
        });
      } else {
        // Per tutti gli altri campi, aggiorna normalmente
        setEditedUser({
          ...editedUser,
          [field]: value
        });
      }
    }
  };

  // Funzione per salvare le modifiche
  const handleSaveChanges = async () => {
    if (editedUser && selectedUser) {
      setIsSaving(true);
      try {
        // Log per debug
        console.log('Utente modificato prima del salvataggio:', editedUser);
        
        // Estrai i ruoli per gestirli correttamente
        const { roles, ...profileData } = editedUser;
        
        // Assicurati che ROLE_USER sia sempre incluso nei ruoli
        const updatedRoles = roles || ['ROLE_USER'];
        if (!updatedRoles.includes('ROLE_USER')) {
          updatedRoles.push('ROLE_USER');
        }
        
        // Log per debug
        console.log('Ruoli da aggiornare:', updatedRoles);
        
        // Aggiorna il profilo dell'utente e i ruoli in un'unica chiamata
        const response = await updateUser(selectedUser.id, profileData, updatedRoles);
        
        if (!response.success) {
          throw new Error(response.message || 'Errore durante l\'aggiornamento dell\'utente');
        }
        
        // Aggiorna la lista degli utenti
        await loadUsers();
        
        toast.success('Successo', {
          description: 'Utente aggiornato con successo'
        });
        
        // Chiudi il modale
        setIsEditDialogOpen(false);
        setSelectedUser(null);
        setEditedUser(null);
      } catch (error) {
        console.error('Errore durante il salvataggio delle modifiche:', error);
        toast.error('Errore', {
          description: error instanceof Error ? error.message : 'Si è verificato un errore durante il salvataggio'
        });
      } finally {
        setIsSaving(false);
      }
    }
  };
  
  // Funzione per gestire la ricerca
  const handleSearch = () => {
    setCurrentPage(1); // Resetta alla prima pagina quando si effettua una nuova ricerca
    loadUsers();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestione Utenti</h1>
        <p className="text-muted-foreground">Gestisci gli utenti registrati nel sistema.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Utenti</CardTitle>
          <CardDescription>
            Visualizza e gestisci tutti gli utenti registrati nel sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Input
              placeholder="Cerca per email o nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              variant="outline" 
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Caricamento...
                </>
              ) : 'Cerca'}
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Verificato</TableHead>
                  <TableHead>Ruoli</TableHead>
                  <TableHead>Socio</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        <span>Caricamento utenti...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name || '-'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.isVerified ? (
                          <div className="flex items-center">
                            <Check className="mr-1 h-4 w-4 text-green-500" />
                            <span>Sì</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <X className="mr-1 h-4 w-4 text-red-500" />
                            <span>No</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles?.filter(role => role !== 'ROLE_USER').map((role) => {
                            // Determina il colore del badge in base al ruolo
                            let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
                            
                            if (role === 'ROLE_ADMIN') {
                              variant = 'destructive';
                            } else if (role === 'ROLE_DIRECTOR') {
                              variant = 'default';
                            } else if (role === 'ROLE_INSTRUCTOR') {
                              variant = 'secondary';
                            }
                            
                            return (
                              <Badge key={role} variant={variant}>
                                {role.replace('ROLE_', '')}
                              </Badge>
                            );
                          })}
                          {(!user.roles || user.roles.length <= 1) && (
                            <span className="text-muted-foreground text-xs">Utente base</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.isSocio ? (
                          <div className="flex items-center">
                            <Check className="mr-1 h-4 w-4 text-green-500" />
                            <span>{user.numeroTessera || 'Sì'}</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <X className="mr-1 h-4 w-4 text-red-500" />
                            <span>No</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mr-2"
                          onClick={() => handleEditUser(user)}
                        >
                          Modifica
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nessun utente trovato.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Paginazione */}
          {totalUsers > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {users.length} di {totalUsers} utenti
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                >
                  Precedente
                </Button>
                <div className="text-sm">
                  Pagina {currentPage} di {Math.ceil(totalUsers / pageSize)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage >= Math.ceil(totalUsers / pageSize) || loading}
                >
                  Successiva
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog per la modifica dell'utente */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifica Utente</DialogTitle>
            <DialogDescription>
              Modifica i dettagli dell'utente selezionato.
            </DialogDescription>
          </DialogHeader>

          {editedUser && (
            <div className="grid gap-4 py-4">
              {/* Informazioni di base */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={editedUser.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={editedUser.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Telefono
                </Label>
                <Input
                  id="phone"
                  value={editedUser.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="col-span-3"
                />
              </div>

              {/* Stato e ruoli */}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">
                  <Label>Verificato</Label>
                </div>
                <div className="flex items-center space-x-2 col-span-3">
                  <Checkbox
                    id="isVerified"
                    isSelected={editedUser.isVerified}
                    onChange={(isSelected) => handleInputChange('isVerified', isSelected)}
                  />
                  <Label htmlFor="isVerified">Utente verificato</Label>
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">
                  Ruoli
                </Label>
                <div className="col-span-3 space-y-3">
                  {/* Ruolo Utente (sempre presente) */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="role-user"
                      isSelected={true}
                      isDisabled={true}
                    />
                    <Label htmlFor="role-user">Utente (base)</Label>
                  </div>
                  
                  {/* Ruolo Amministratore */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="role-admin"
                      isSelected={editedUser.roles?.includes('ROLE_ADMIN') || false}
                      onChange={(isSelected) => {
                        const currentRoles = [...(editedUser.roles || ['ROLE_USER'])];
                        const newRoles = isSelected 
                          ? [...currentRoles, 'ROLE_ADMIN'].filter((v, i, a) => a.indexOf(v) === i) // Rimuovi duplicati
                          : currentRoles.filter(role => role !== 'ROLE_ADMIN');
                        handleInputChange('roles', newRoles);
                      }}
                    />
                    <Label htmlFor="role-admin">Amministratore</Label>
                  </div>
                  
                  {/* Ruolo Direttore */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="role-director"
                      isSelected={editedUser.roles?.includes('ROLE_DIRECTOR') || false}
                      onChange={(isSelected) => {
                        console.log('Aggiungo/Rimuovo ruolo Direttore:', isSelected);
                        console.log('Ruoli correnti:', editedUser.roles);
                        const currentRoles = [...(editedUser.roles || ['ROLE_USER'])];
                        const newRoles = isSelected 
                          ? [...currentRoles, 'ROLE_DIRECTOR'].filter((v, i, a) => a.indexOf(v) === i) // Rimuovi duplicati
                          : currentRoles.filter(role => role !== 'ROLE_DIRECTOR');
                        console.log('Nuovi ruoli:', newRoles);
                        handleInputChange('roles', newRoles);
                      }}
                    />
                    <Label htmlFor="role-director">Direttore</Label>
                  </div>
                  
                  {/* Ruolo Istruttore */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="role-instructor"
                      isSelected={editedUser.roles?.includes('ROLE_INSTRUCTOR') || false}
                      onChange={(isSelected) => {
                        const currentRoles = [...(editedUser.roles || ['ROLE_USER'])];
                        const newRoles = isSelected 
                          ? [...currentRoles, 'ROLE_INSTRUCTOR'].filter((v, i, a) => a.indexOf(v) === i) // Rimuovi duplicati
                          : currentRoles.filter(role => role !== 'ROLE_INSTRUCTOR');
                        handleInputChange('roles', newRoles);
                      }}
                    />
                    <Label htmlFor="role-instructor">Istruttore</Label>
                  </div>
                </div>
              </div>

              {/* Informazioni socio */}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">
                  <Label>Socio</Label>
                </div>
                <div className="flex items-center space-x-2 col-span-3">
                  <Checkbox
                    id="isSocio"
                    isSelected={editedUser.isSocio || false}
                    onChange={(isSelected) => handleInputChange('isSocio', isSelected)}
                  />
                  <Label htmlFor="isSocio">È socio</Label>
                </div>
              </div>

              {editedUser.isSocio && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="numeroTessera" className="text-right">
                      Numero Tessera
                    </Label>
                    <Input
                      id="numeroTessera"
                      value={editedUser.numeroTessera || ''}
                      onChange={(e) => handleInputChange('numeroTessera', e.target.value)}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="text-right">
                      <Label>Quota Annuale</Label>
                    </div>
                    <div className="flex items-center space-x-2 col-span-3">
                      <Checkbox
                        id="quotaAnnuale"
                        isSelected={editedUser.quotaAnnuale || false}
                        onChange={(isSelected) => handleInputChange('quotaAnnuale', isSelected)}
                      />
                      <Label htmlFor="quotaAnnuale">Pagata</Label>
                    </div>
                  </div>
                </>
              )}

              {/* Informazioni porto d'armi */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="portoArmi" className="text-right">
                  Porto d'Armi
                </Label>
                <Input
                  id="portoArmi"
                  value={editedUser.portoArmi || ''}
                  onChange={(e) => handleInputChange('portoArmi', e.target.value)}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="scadenzaPortoArmi" className="text-right">
                  Scadenza
                </Label>
                <Input
                  id="scadenzaPortoArmi"
                  type="date"
                  value={editedUser.scadenzaPortoArmi || ''}
                  onChange={(e) => handleInputChange('scadenzaPortoArmi', e.target.value)}
                  className="col-span-3"
                />
              </div>

              {/* Privacy */}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">
                  <Label>Privacy</Label>
                </div>
                <div className="flex items-center space-x-2 col-span-3">
                  <Checkbox
                    id="privacyConsent"
                    isSelected={editedUser.privacyConsent || false}
                    onChange={(isSelected) => handleInputChange('privacyConsent', isSelected)}
                  />
                  <Label htmlFor="privacyConsent">Consenso privacy</Label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSaving}
            >
              Annulla
            </Button>
            <Button 
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvataggio...
                </>
              ) : 'Salva modifiche'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserManagement;