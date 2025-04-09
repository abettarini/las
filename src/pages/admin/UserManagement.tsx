import { Check, Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { User } from '../../context/auth-context';
import { getUsers, updateUser, updateUserRoles } from '../../services/admin-service';

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
        setUsers(response.users);
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
      setEditedUser({
        ...editedUser,
        [field]: value
      });
    }
  };

  // Funzione per salvare le modifiche
  const handleSaveChanges = async () => {
    if (editedUser && selectedUser) {
      setIsSaving(true);
      try {
        // Estrai i ruoli per aggiornarli separatamente
        const { roles, ...profileData } = editedUser;
        
        // Aggiorna il profilo dell'utente
        const profileResponse = await updateUser(selectedUser.id, profileData);
        
        if (!profileResponse.success) {
          throw new Error(profileResponse.message || 'Errore durante l\'aggiornamento del profilo');
        }
        
        // Se i ruoli sono cambiati, aggiornali
        if (JSON.stringify(selectedUser.roles) !== JSON.stringify(roles)) {
          const rolesResponse = await updateUserRoles(selectedUser.id, roles || ['ROLE_USER']);
          
          if (!rolesResponse.success) {
            throw new Error(rolesResponse.message || 'Errore durante l\'aggiornamento dei ruoli');
          }
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
                          {user.roles?.map((role) => (
                            <Badge key={role} variant={role === 'ROLE_ADMIN' ? 'default' : 'outline'}>
                              {role.replace('ROLE_', '')}
                            </Badge>
                          ))}
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
                    checked={editedUser.isVerified}
                    onCheckedChange={(checked) => handleInputChange('isVerified', checked)}
                  />
                  <Label htmlFor="isVerified">Utente verificato</Label>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="roles" className="text-right">
                  Ruolo
                </Label>
                <Select
                  value={editedUser.roles?.includes('ROLE_ADMIN') ? 'admin' : 'user'}
                  onValueChange={(value) => {
                    const newRoles = value === 'admin' 
                      ? ['ROLE_USER', 'ROLE_ADMIN']
                      : ['ROLE_USER'];
                    handleInputChange('roles', newRoles);
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleziona un ruolo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Utente</SelectItem>
                    <SelectItem value="admin">Amministratore</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Informazioni socio */}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">
                  <Label>Socio</Label>
                </div>
                <div className="flex items-center space-x-2 col-span-3">
                  <Checkbox
                    id="isSocio"
                    checked={editedUser.isSocio || false}
                    onCheckedChange={(checked) => handleInputChange('isSocio', checked)}
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
                        checked={editedUser.quotaAnnuale || false}
                        onCheckedChange={(checked) => handleInputChange('quotaAnnuale', checked)}
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
                    checked={editedUser.privacyConsent || false}
                    onCheckedChange={(checked) => handleInputChange('privacyConsent', checked)}
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