import { Plant } from "@/types/plant";

interface PlantsComponentProps {
  plants: Plant[];
}

export default function PlantsComponent({ plants }: PlantsComponentProps) {
    return (
        <>
        {plants.map((plant) => (
        <div
          key={plant.id}
          className="flex flex-col md:flex-row p-8   rounded-md items-start gap-x-20 gap-y-6 md:odd:flex-row-reverse"
        >
          <div className="w-full aspect-[6/4] bg-muted rounded-xl border border-border/50 basis-1/2" />
          <div className="basis-1/2 shrink-0">
            <span className="uppercase font-semibold text-sm text-muted-foreground">
              {plant.category}
            </span>
            <h4 className="my-3 text-3xl font-semibold tracking-tight">
              {plant.title}
            </h4>
            <p className="text-muted-foreground text-[17px]">
              {plant.description}
            </p>
            <div className={`p-4 rounded-md bg-muted/50`}>
          <h3 className={`font-semibold mb-2`}>
            Caratteristiche:
          </h3>
          <ul className="list-disc pl-5">
            {plant.features.items.map((item, index) => (
              <li 
                key={index} 
                className={index < plant.features.items.length - 1 ? "mb-1" : ""}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
          </div>
        </div>
      ))}
      </>
      );
    }