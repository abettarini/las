import { Button } from "@/components/ui/button"
import documentsData from "@/data/documents.json"
import { ChevronDown, ChevronUp, Download, ExternalLink, FileText } from "lucide-react"
import { useState } from "react"

interface Document {
  id: string
  title: string
  description: string
  categoryId: string
  url: string
  isExternal: boolean
}

interface Category {
  id: string
  name: string
  description: string
}

export default function DocumentsPage() {
  const { categories, documents } = documentsData as {
    categories: Category[]
    documents: Document[]
  }

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    categories.reduce((acc, category) => ({ ...acc, [category.id]: true }), {})
  )

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const getDocumentsByCategory = (categoryId: string) => {
    return documents.filter((doc) => doc.categoryId === categoryId)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Documenti</h1>
      <p className="mb-8 text-muted-foreground">
        In questa sezione puoi trovare e scaricare tutti i documenti utili, suddivisi per categoria.
      </p>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.id} className="rounded-lg border border-border bg-card text-card-foreground shadow-sm">
            <div 
              className="flex cursor-pointer items-center justify-between p-4"
              onClick={() => toggleCategory(category.id)}
            >
              <div>
                <h2 className="text-xl font-semibold">{category.name} <span className="ml-2 text-sm font-normal text-muted-foreground">({getDocumentsByCategory(category.id).length} documenti)</span></h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              <Button variant="ghost" size="icon">
                {expandedCategories[category.id] ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </Button>
            </div>

            {expandedCategories[category.id] && (
              <div className="border-t border-border p-4">
                {getDocumentsByCategory(category.id).length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nessun documento disponibile in questa categoria.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {getDocumentsByCategory(category.id).map((document) => (
                      <li key={document.id} className="py-4 flex items-start">
                        <div className="flex-shrink-0 mr-4 mt-1">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-medium">{document.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{document.description}</p>
                          <a
                            href={document.url}
                            target={document.isExternal ? "_blank" : "_self"}
                            rel={document.isExternal ? "noopener noreferrer" : ""}
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
                          >
                            {document.isExternal ? (
                              <>
                                <ExternalLink className="h-4 w-4" />
                                Visita il link esterno
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4" />
                                Scarica documento
                              </>
                            )}
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}