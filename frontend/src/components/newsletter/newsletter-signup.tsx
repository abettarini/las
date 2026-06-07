import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { z } from "zod";

const emailSchema = z.string().email({
  message: "Inserisci un indirizzo email valido",
});

interface NewsletterSignupProps {
  variant?: "default" | "compact";
  onSuccess?: (email: string) => void;
}

const NewsletterSignup = ({ 
  variant = "default", 
  onSuccess 
}: NewsletterSignupProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate email
      emailSchema.parse(email);
      
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success
      setIsSuccess(true);
      setEmail("");
      
      // Store in localStorage that user is subscribed
      localStorage.setItem("newsletter-subscribed", "true");
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(email);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("Si è verificato un errore. Riprova più tardi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`${variant === "compact" ? "text-sm" : "text-base"} text-green-600 dark:text-green-400 font-medium`}>
        Grazie per l'iscrizione! Ti terremo aggiornato sulle nostre novità.
      </div>
    );
  }

  return (
    <div className={variant === "compact" ? "space-y-2" : "space-y-4"}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Input
            type="email"
            placeholder="La tua email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full ${error ? "border-red-500" : ""}`}
            aria-label="Indirizzo email per la newsletter"
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className={variant === "compact" ? "h-9 px-3" : ""}
        >
          {isSubmitting ? "Iscrizione..." : "Iscriviti"}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSignup;