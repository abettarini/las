import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CalendarClock, Clock, Info } from "lucide-react";
import { useEffect, useState } from "react";
import {
    getCurrentSeasonId,
    isExceptionalOpening,
    isHolidayClosure,
    isSpecialClosure,
    seasonConfigurations
} from "../booking/event-type";
import NewsletterSignup from "../newsletter/newsletter-signup";

interface OrariModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrariModal = ({ isOpen, onClose }: OrariModalProps) => {
  const [currentSeason, setCurrentSeason] = useState<string>("");
  const [seasonData, setSeasonData] = useState<any>(null);
  const [today, setToday] = useState<Date>(new Date());
  const [specialStatus, setSpecialStatus] = useState<{
    type: "normal" | "holiday" | "special" | "exceptional";
    description: string | null;
    date?: { start: string; end?: string };
  }>({ type: "normal", description: null });

  // Formatta la data in formato italiano (giorno/mese)
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "Data non specificata";
    const [month, day] = dateStr.split("-");
    return `${day}/${month}`;
  };

  // Formatta il giorno della settimana in italiano
  const formatDayOfWeek = (day: string) => {
    const days: Record<string, string> = {
      "lunedì": "Lunedì",
      "martedì": "Martedì",
      "mercoledì": "Mercoledì",
      "giovedì": "Giovedì",
      "venerdì": "Venerdì",
      "sabato": "Sabato",
      "domenica": "Domenica",
    };
    return days[day] || day;
  };

  // Verifica se oggi è un giorno speciale
  useEffect(() => {
    const checkSpecialDay = () => {
      const now = new Date();
      
      // Verifica se è un'apertura eccezionale
      const exceptionalOpening = isExceptionalOpening(now);
      if (exceptionalOpening) {
        setSpecialStatus({
          type: "exceptional",
          description: `Apertura straordinaria: ${exceptionalOpening.descrizione}`,
          date: {
            start: exceptionalOpening.data,
          }
        });
        return;
      }

      // Verifica se è un giorno di chiusura festiva
      const holidayClosure = isHolidayClosure(now);
      if (holidayClosure) {
        setSpecialStatus({
          type: "holiday",
          description: `Chiuso per ${holidayClosure.descrizione}`,
          date: {
            start: holidayClosure.data,
          }
        });
        return;
      }

      // Verifica se è un giorno di chiusura speciale
      const specialClosure = isSpecialClosure(now);
      if (specialClosure) {
        setSpecialStatus({
          type: "special",
          description: `Chiuso per ${specialClosure.descrizione}`,
          date: {
            start: specialClosure.data,
            end: specialClosure.dataFine
          }
        });
        return;
      }

      // Giorno normale
      setSpecialStatus({ type: "normal", description: null });
    };

    checkSpecialDay();
  }, [today]);

  // Carica i dati della stagione corrente
  useEffect(() => {
    const updateSeason = () => {
      const now = new Date();
      const seasonId = getCurrentSeasonId(now);
      setCurrentSeason(seasonId);
      if (seasonId && seasonConfigurations[seasonId]) {
        setSeasonData(seasonConfigurations[seasonId]);
      }
    };

    updateSeason();
  }, [today]);

  // Formatta la data corrente
  const formattedToday = format(today, "EEEE d MMMM yyyy", { locale: it });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            <DialogTitle>Orari di apertura</DialogTitle>
          </div>
          <DialogDescription>
            Orari in vigore dal {formatDate(seasonData?.startDate)} al{" "}
            {formatDate(seasonData?.endDate)}
          </DialogDescription>
        </DialogHeader>

        {/* Stato speciale (chiusura o apertura straordinaria) */}
        {specialStatus.description && (
          <div 
            className={`p-3 rounded-md mb-4 flex items-start gap-2 ${
              specialStatus.type === "exceptional" 
                ? "bg-green-50 text-green-800 border border-green-200" 
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">{specialStatus.description}</p>
              {specialStatus.date?.end ? (
                <p className="text-sm mt-1">
                  Dal {format(new Date(specialStatus.date.start), "d MMMM", { locale: it })} al{" "}
                  {format(new Date(specialStatus.date.end), "d MMMM", { locale: it })}
                </p>
              ) : (
                <p className="text-sm mt-1">
                  {format(new Date(specialStatus.date?.start || ""), "d MMMM", { locale: it })}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Data corrente */}
        <div className="text-center mb-4">
          <p className="text-muted-foreground">
            Oggi è <span className="font-medium capitalize">{formattedToday}</span>
          </p>
        </div>

        {/* Orari di apertura */}
        {seasonData && (
          <div className="border rounded-md p-4 mb-6">
            <h3 className="font-medium flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-primary" />
              Orari di apertura settimanali
            </h3>
            <div className="space-y-2">
              {Object.entries(seasonData.openingHours).map(([day, hours]: [string, any]) => {
                const isToday = 
                  today.toLocaleString("it-IT", { weekday: "long" }).toLowerCase() === day;
                
                return (
                  <div 
                    key={day} 
                    className={`flex justify-between ${
                      isToday ? "bg-primary/5 p-2 rounded-md -mx-2" : ""
                    }`}
                  >
                    <span className={`capitalize ${isToday ? "font-medium" : ""}`}>
                      {formatDayOfWeek(day)}:
                    </span>
                    <span>
                      {hours.map(
                        (hour: { start: string; end: string }, index: number) => (
                          <span key={index}>
                            {hour.start} - {hour.end}
                            {index < hours.length - 1 ? ", " : ""}
                          </span>
                        )
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Form newsletter */}
        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-3">Resta aggiornato</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Iscriviti alla newsletter per ricevere aggiornamenti su eventi, gare e novità
          </p>
          <NewsletterSignup />
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Chiudi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrariModal;