import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Il nome deve contenere almeno 2 caratteri",
  }),
  email: z.string().email({
    message: "Inserisci un indirizzo email valido",
  }),
  phone: z.string().min(10, {
    message: "Inserisci un numero di telefono valido",
  }),
  message: z.string().min(10, {
    message: "Il messaggio deve contenere almeno 10 caratteri",
  }),
})

type FormData = z.infer<typeof formSchema>

interface SubmitStatus {
  type: "success" | "error"
  message: string
}

const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  })

  const onSubmit = async (data: FormData): Promise<void> => {
    setIsSubmitting(true)
    try {
      // Here you would typically send the data to your backend
      console.log("Form data:", data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitStatus({
        type: "success",
        message: "Grazie per averci contattato! Ti risponderemo al più presto."
      })
      form.reset()
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Si è verificato un errore. Riprova più tardi."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {submitStatus && (
        <div
          className={`p-4 mb-4 rounded-md ${
            submitStatus.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">Nome</FormLabel>
                <FormControl>
                  <Input id="name" placeholder="Il tuo nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input id="email" type="email" placeholder="La tua email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="phone">Telefono</FormLabel>
                <FormControl>
                  <Input id="phone" type="tel" placeholder="Il tuo numero di telefono" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="message">Messaggio</FormLabel>
                <FormControl>
                  <textarea id="message" rows={8} cols={50}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                    placeholder="Il tuo messaggio..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting} >
            {isSubmitting ? "Invio in corso..." : "Invia messaggio"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ContactForm