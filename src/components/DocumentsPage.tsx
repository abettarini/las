import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import documentsData from "@/data/documents.json"
import { ChevronDown, ChevronUp, Download, ExternalLink } from "lucide-react"
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
      <p className="mb-8 text-gray-600">
        In questa sezione puoi trovare e scaricare tutti i documenti utili, suddivisi per categoria.
      </p>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.id} className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div 
              className="flex cursor-pointer items-center justify-between p-4"
              onClick={() => toggleCategory(category.id)}
            >
              <div>
                <h2 className="text-xl font-semibold">{category.name}</h2>
                <p className="text-gray-600">{category.description}</p>
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
              <div className="border-t border-gray-200 p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {getDocumentsByCategory(category.id).map((document) => (
                    <Card key={document.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle>{document.title}</CardTitle>
                        <CardDescription>{document.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <a
                          href={document.url}
                          target={document.isExternal ? "_blank" : "_self"}
                          rel={document.isExternal ? "noopener noreferrer" : ""}
                          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          {document.isExternal ? (
                            <>
                              <ExternalLink className="h-4 w-4" />
                              Visita
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                              Scarica
                            </>
                          )}
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}