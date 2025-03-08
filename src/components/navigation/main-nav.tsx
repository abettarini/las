"use client"

import * as React from "react";
import { NavLink } from "react-router-dom";
import { Image } from '../ui/image';

import { cn } from "../../lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import mainMenu, { MenuItem } from "./menu";

const struttura: { title: string; href: string; description: string }[] = [
  {
    title: "Dove siamo",
    href: "/struttura/dove-siamo",
    description:
      "Indicazioni per raggiungere la nostra struttura.",
  },
  {
    title: "Orari",
    href: "/struttura/orari",
    description:
      "Orari di apertura/chiusura segreteria e di inizio e termine spari.",
  },
  {
    title: "Impianti",
    href: "/struttura/impianti",
    description:
      "Dai un'occhiata ai nostri impianti.",
  }
]

const chisiamo: { title: string; href: string; description: string }[] = [
    {
        title: "Storia",
        href: "/chisiamo/la-struttura",
        description: "Informazioni sulla storia della struttura."
    },
    {
        title: "Statuto sezione e MOG",
        href: "/chisiamo/statuto-sezione-mog",
        description: "Lo statuto della sezione e il MOG."
    },
    {
        title: "Consiglio direttivo",
        href: "/chisiamo/consiglio-direttivo",
        description: "Elenco dei membri del consiglio direttivo e organigramma"
    },
    {
        title: "Bilanci",
        href: "/chisiamo/bilanci",
        description: "Bilanci annuali della struttura."
    },
];

const iscrizioni: { title: string; href: string; description: string }[] = [
  {
      title: "Iscrizioni",
      href: "/iscrizioni",
      description: "Informazioni sulle iscrizioni."
  },
  {
      title: "Documenti",
      href: "/iscrizioni/documenti",
      description: "Documenti e fac-simili necessari per l'iscrizione."
  },
  {
      title: "Test",
      href: "/iscrizioni/test",
      description: "Procedura a quiz di test per l'iscrizione."
  }
];

const MenuItemComponent: React.FC<{ item: MenuItem; depth?: number }> = ({ item, depth = 0 }) => {
  return (
    <>
      {item.submenu ? (
        <NavigationMenuItem>
          <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
          <NavigationMenuContent className="data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion$=left]:slide-in-from-left-10 data-[motion$=right]:slide-in-from-right-10 motion-reduce:transition-none data-[state=open]:duration-300">
            <ul className={cn(
              item.image && "grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]",
              !item.image && "grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
            )}>
            {item.image && (
              <li className="row-span-3 hidden lg:flex">
              <NavigationMenuLink asChild>
                <a
                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  href="/"
                >
                  <Image src={item.image} alt="" width={128} height={128} className="h-6 w-6" />
                  {item.heading && (<div className="mb-2 mt-4 text-lg font-medium">
                    {item.heading}
                  </div>)}
                  <p className="text-sm leading-tight text-muted-foreground">
                    {item.description}
                  </p>
                </a>
              </NavigationMenuLink>
            </li>
            )}
              {item.submenu.map((subItem) => (
                <ListItem
                  key={subItem.title}
                  title={subItem.title}
                  href={subItem.href}
                >
                  {subItem.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      ) : (
        <NavigationMenuItem>
          <NavLink to={item.href ?? "#"} className={navigationMenuTriggerStyle()}>
          {item.title}
          </NavLink>
        </NavigationMenuItem>
      )}
    </>
  );
};


export function MainNavigation() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {mainMenu.map((item) => (
          <MenuItemComponent key={item.title} item={item} />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
