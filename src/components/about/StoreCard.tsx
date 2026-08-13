import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { MapPin, Clock3, Phone } from "lucide-react";

import type { Store } from "@/types/about";

interface StoreCardProps {
  store: Store;
}

const statusColor = {
  open: "bg-green-500",
  closed: "bg-red-500",
  soon: "bg-yellow-500",
};

const statusLabel = {
  open: "Open",
  closed: "Closed",
  soon: "Coming Soon",
};

const StoreCard = ({ store }: StoreCardProps) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    store.address,
  )}`;
  return (
    <Card
      className="
      rounded-2xl
      shadow-none
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-lg
      "
    >
      <CardContent className="space-y-6 p-8">
        <div className="flex justify-between">
          <div>
            <h3 className="font-serif text-2xl text-[#2E1F14]">{store.name}</h3>

            <p className="text-sm text-muted-foreground">{store.area}</p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-bold text-[#C9A96E]">
              {store.id}
            </span>

            <div className="mt-2 flex items-center justify-end gap-2">
              <div
                className={`h-2 w-2 rounded-full ${statusColor[store.status]}`}
              />

              <span className="text-sm">{statusLabel[store.status]}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          {/* <div className="flex gap-3">
            <MapPin className="h-5 w-5 text-[#C9A96E]" />
            <span>{store.address}</span>
          </div> */}
          <div className="flex gap-3">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-3 rounded-lg transition-colors hover:bg-[#F8F4EE] p-2 -m-2"
            >
              <MapPin className="mt-0.5 h-5 w-5 text-[#C9A96E]" />
            </a>
            <div>
              <p className="text-sm text-[#2E1F14] group-hover:text-[#8B5E3C]">
                {store.address}
              </p>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-3 rounded-lg transition-colors hover:bg-[#F8F4EE] p-2 -m-2"
              >
                <span className="text-xs text-[#C9A96E]">
                  View on Google Maps →
                </span>
              </a>
            </div>
          </div>
          <div className="flex gap-3">
            <Clock3 className="h-5 w-5 text-[#C9A96E]" />
            <span>{store.hours}</span>
          </div>

          <div className="flex gap-3">
            <Phone className="h-5 w-5 text-[#C9A96E]" />
            <span>{store.phone}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-wrap gap-2">
              {store.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* <Button
              //   asChild
              variant="outline"
              size="sm"
              className="border-[#C9A96E] text-[#2E1F14] hover:bg-[#C9A96E]/10"
            >
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                Directions
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>

            </Button> */}

            <Button
              //   asChild
              className="
    group
    rounded-full
    bg-[#2E1F14]
    px-5
    text-white
    transition-all
    duration-300
    hover:bg-[#C9A96E]
    hover:text-[#2E1F14]
    hover:shadow-lg
  "
            >
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                Get Directions
                <ExternalLink
                  className="
        ml-2
        h-4
        w-4
        transition-transform
        duration-300
        group-hover:translate-x-1
        group-hover:-translate-y-1
      "
                />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreCard;
