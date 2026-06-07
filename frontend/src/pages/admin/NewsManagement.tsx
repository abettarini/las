import { Content } from "@/components/news/news-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { Book, Calendar, FileText, Loader2, PenSquare, Plus, Target, Trash2, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../context/auth-context";
import { createNews, deleteNews, getAllNews, updateNews } from "../../services/news-service";

export function NewsManagement() {
  const { user, hasRole, isAuthenticated, loading: authLoading } = useAuth();
  const [news, setNews] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState<Partial<Content>>({
    type: "event",
    date: new Date().toISOString().split("T")[0],
    title: "",
    abstract: "",
    fullContent: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  
  // Verifica se l'utente è un amministratore
  const isAdmin = hasRole("ROLE_ADMIN");
  
  // Mostra un indicatore di caricamento mentre verifichiamo l'autenticazione
  if (authLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  // Se l'utente non è autenticato o non è un amministratore, reindirizza alla home
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      const response = await getAllNews();
      if (response.success && response.data) {
        setNews(response.data);
      } else {
        toast.error("Errore", {
          description: response.message || "Impossibile caricare le comunicazioni"
        });
      }
    } catch (error) {
      console.error("Errore durante il caricamento delle comunicazioni:", error);
      toast.error("Errore", {
        description: "Si è verificato un errore durante il caricamento delle comunicazioni"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNews = () => {
    setIsEditing(false);
    setCurrentNews({
      type: "event",
      date: new Date().toISOString().split("T")[0],
      title: "",
      abstract: "",
      fullContent: ""
    });
    setIsDialogOpen(true);
  };

  const handleEditNews = (newsItem: Content) => {
    setIsEditing(true);
    setCurrentNews({ ...newsItem });
    setIsDialogOpen(true);
  };

  const handleDeleteNews = (id: number) => {
    setSelectedNewsId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedNewsId === null) return;

    try {
      const response = await deleteNews(selectedNewsId);
      if (response.success) {
        toast.success("Successo", {
          description: "Comunicazione eliminata con successo"
        });
        // Aggiorna la lista delle comunicazioni
        setNews(news.filter(item => item.id !== selectedNewsId));
      } else {
        // Gestisci errori di autorizzazione
        if (response.message && response.message.includes("Accesso negato")) {
          toast.error("Errore di autorizzazione", {
            description: "Non hai i permessi necessari per eseguire questa operazione. Solo gli amministratori possono eliminare le comunicazioni."
          });
        } else {
          toast.error("Errore", {
            description: response.message || "Impossibile eliminare la comunicazione"
          });
        }
      }
    } catch (error) {
      console.error("Errore durante l'eliminazione della comunicazione:", error);
      toast.error("Errore", {
        description: "Si è verificato un errore durante l'eliminazione della comunicazione"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedNewsId(null);
    }
  };

  const handleSaveNews = async () => {
    // Validazione dei campi
    if (!currentNews.title || !currentNews.date || !currentNews.type || !currentNews.abstract) {
      toast.error("Errore", {
        description: "Compila tutti i campi obbligatori"
      });
      return;
    }

    try {
      let response;
      if (isEditing && currentNews.id) {
        // Aggiorna una comunicazione esistente
        response = await updateNews(currentNews.id, currentNews);
      } else {
        // Crea una nuova comunicazione
        response = await createNews(currentNews as Omit<Content, "id">);
      }

      if (response.success) {
        toast.success("Successo", {
          description: isEditing
            ? "Comunicazione aggiornata con successo"
            : "Comunicazione creata con successo"
        });

        // Aggiorna la lista delle comunicazioni
        if (isEditing) {
          setNews(news.map(item => (item.id === currentNews.id ? response.data! : item)));
        } else if (response.data) {
          setNews([...news, response.data]);
        }

        // Chiudi il dialog
        setIsDialogOpen(false);
      } else {
        // Gestisci errori di autorizzazione
        if (response.message && response.message.includes("Accesso negato")) {
          toast.error("Errore di autorizzazione", {
            description: "Non hai i permessi necessari per eseguire questa operazione. Solo gli amministratori possono gestire le comunicazioni."
          });
        } else {
          toast.error("Errore", {
            description: response.message || "Impossibile salvare la comunicazione"
          });
        }
      }
    } catch (error) {
      console.error("Errore durante il salvataggio della comunicazione:", error);
      toast.error("Errore", {
        description: "Si è verificato un errore durante il salvataggio della comunicazione"
      });
    }
  };

  const getTypeIcon = (type: Content["type"]) => {
    switch (type) {
      case "target":
        return <Target className="h-5 w-5" />;
      case "event":
        return <Calendar className="h-5 w-5" />;
      case "article":
        return <FileText className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "book":
        return <Book className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: Content["type"]) => {
    switch (type) {
      case "target":
        return "Obiettivo";
      case "event":
        return "Evento";
      case "article":
        return "Articolo";
      case "video":
        return "Video";
      case "book":
        return "Libro";
      default:
        return "Sconosciuto";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestione Comunicazioni</h1>
          <p className="text-muted-foreground">
            Crea, modifica ed elimina le comunicazioni del sito.
          </p>
        </div>
        <Button onClick={handleCreateNews} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuova Comunicazione
        </Button>
      </div>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : news.length === 0 ? (
        <Card>
          <CardContent className="flex h-[300px] flex-col items-center justify-center p-6">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">Nessuna comunicazione</h3>
            <p className="text-center text-muted-foreground">
              Non ci sono comunicazioni disponibili. Crea la tua prima comunicazione cliccando sul
              pulsante "Nuova Comunicazione".
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map(item => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                  {getTypeIcon(item.type)}
                  <span>{getTypeLabel(item.type)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-2">
                  {format(parseISO(item.date), "d MMMM yyyy", { locale: it })}
                </div>
                <p className="line-clamp-3">{item.abstract}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => handleEditNews(item)}>
                  <PenSquare className="mr-2 h-4 w-4" />
                  Modifica
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteNews(item.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Elimina
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog per creare/modificare una comunicazione */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Modifica Comunicazione" : "Nuova Comunicazione"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modifica i dettagli della comunicazione esistente."
                : "Inserisci i dettagli per creare una nuova comunicazione."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titolo</Label>
                <Input
                  id="title"
                  value={currentNews.title || ""}
                  onChange={e => setCurrentNews({ ...currentNews, title: e.target.value })}
                  placeholder="Inserisci il titolo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={currentNews.date || ""}
                  onChange={e => setCurrentNews({ ...currentNews, date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={currentNews.type}
                  onValueChange={value => setCurrentNews({ ...currentNews, type: value as Content["type"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="event">Evento</SelectItem>
                    <SelectItem value="target">Obiettivo</SelectItem>
                    <SelectItem value="article">Articolo</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="book">Libro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="abstract">Abstract</Label>
                <Input
                  id="abstract"
                  value={currentNews.abstract || ""}
                  onChange={e => setCurrentNews({ ...currentNews, abstract: e.target.value })}
                  placeholder="Inserisci un breve riassunto"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullContent">Contenuto Completo</Label>
              <Textarea
                id="fullContent"
                value={currentNews.fullContent || ""}
                onChange={e => setCurrentNews({ ...currentNews, fullContent: e.target.value })}
                placeholder="Inserisci il contenuto completo"
                className="min-h-[200px]"
              />
              <p className="text-xs text-muted-foreground">
                Puoi utilizzare la sintassi Markdown per formattare il testo. Ad esempio: **grassetto**, *corsivo*, [link](https://example.com)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleSaveNews}>Salva</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog di conferma eliminazione */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma eliminazione</DialogTitle>
            <DialogDescription>
              Sei sicuro di voler eliminare questa comunicazione? Questa azione non può essere annullata.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annulla
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Elimina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}