import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"

export default function DocumentationPage() {
  const sections = [
    { id: "introduzione", label: "Introduzione" },
    { id: "section1", label: "Sezione 1" },
    { id: "section2", label: "Sezione 2" },
    { id: "section3", label: "Sezione 3" },
  ]

  const handleScroll = (id: string) => {
    const targetElement = document.getElementById(id)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex">
      {/* Menu a sinistra (TOC) */}
      <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white p-4">
        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleScroll(section.id)}
              className="block w-full text-left hover:text-blue-600"
            >
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Contenuto a destra */}
      <ScrollArea className="ml-64 h-screen w-full overflow-auto p-8">
        <h1 id="introduzione" className="mb-4 text-2xl font-bold">
          Introduzione
        </h1>
        <p className="mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
          semper vitae sapien vitae interdum. Quisque faucibus ex risus...
        </p>

        <h2 id="section1" className="mb-4 text-xl font-semibold">
          Sezione 1
        </h2>
        <p className="mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
          ullamcorper consectetur nulla. Aenean in turpis libero...
        </p>

        <h3 id="section2" className="mb-4 text-lg font-semibold">
          Sezione 2
        </h3>
        <p className="mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          volutpat fermentum odio non sodales. Curabitur placerat...
        </p>

        <h4 id="section3" className="mb-4 text-base font-medium">
          Sezione 3
        </h4>
        <p className="mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
          in ornare nisl. Praesent erat ante, vulputate eu felis sit
          amet, fauc...
        </p>
      </ScrollArea>

      {/* Bottone flottante per tornare su */}
      <Button
        className="fixed bottom-5 right-5"
        onClick={scrollToTop}
      >
        Torna su
      </Button>
    </div>
  )
}