"use client"

import { ChevronRightIcon, Menu } from "lucide-react"
import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"
import { Image } from '../ui/image'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet"
import mainMenu, { MenuItem } from "./menu"


const MenuItemComponent: React.FC<{ item: MenuItem; depth?: number }> = ({ item, depth = 0 }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  if (item.submenu) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="grid gap-4">
        <CollapsibleTrigger className="flex w-full items-center text-lg font-semibold [&[data-state=open]>svg]:rotate-90">
            {item.title} <ChevronRightIcon className="ml-auto h-5 w-5 transition-all" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="-mx-6 grid gap-6 bg-muted p-6">
          {item.submenu.map((subItem) => (
            <MenuItemComponent key={subItem.title} item={subItem} depth={depth + 1} />
          ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Link
      to={item.href ?? "#"}
      className={cn(
        depth == 0 && "flex w-full items-center text-lg font-semibold",
        depth > 0 && "group grid h-auto w-full justify-start gap-1",
        item.href === "/" && "text-primary"
      )}
    >
      {depth == 0 && <div>{item.title}</div>}
      {depth > 0 && (
        <>
          <div className="text-sm font-medium leading-none group-hover:underline">
            {item.title}
          </div>
          {item.description && (<div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {item.description}
          </div>)}
        </>
      )}
    </Link>
  )
}

export default function HamburgerMenu() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" >
        <Link to="/">
          <Image src='/assets/las-logo.png' height={48} width={48} alt="Logo TSN Lastra a Signa" className="h-6 w-6" />
          <span className="sr-only">Logo TSN Lastra a Signa</span>
        </Link>
        <div className="grid gap-2 py-6">
          {mainMenu.map((item) => (
            <MenuItemComponent key={item.title} item={item} />
          ))}
        </div>
        
      </SheetContent>
    </Sheet>
  )
}