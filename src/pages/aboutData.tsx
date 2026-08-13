import {
    Leaf,
    Flame,
    Handshake,
    Sprout
} from "lucide-react";

import type {
    Pillar,
    TeamMember,
    Store
} from "../types/about";

export const PILLARS: Pillar[] = [
    {
        icon: <Leaf className="h-6 w-6 text-[#C9A96E]" />,
        title: "Sourced with purpose",
        description:
            "We partner directly with farmers across Ethiopia, Colombia and Sumatra ensuring fair trade and exceptional flavour."
    },
    {
        icon: <Flame className="h-6 w-6 text-[#C9A96E]" />,
        title: "Crafted with precision",
        description:
            "Every espresso, pour-over and cold brew follows a meticulous process."
    },
    {
        icon: <Handshake className="h-6 w-6 text-[#C9A96E]" />,
        title: "Built for community",
        description:
            "Our café belongs to the neighbourhood as much as it belongs to us."
    },
    {
        icon: <Sprout className="h-6 w-6 text-[#C9A96E]" />,
        title: "Rooted in sustainability",
        description:
            "Zero food waste partnerships and eco-conscious roasting."
    }
];

export const TEAM: TeamMember[] = [
    {
        id:1,
        initials:"A",
        name:"Arjun Mehta",
        role:"Head Roaster"
    },
    {
        id:2,
        initials:"P",
        name:"Priya Sharma",
        role:"Lead Barista"
    },
    {
        id:3,
        initials:"R",
        name:"Rohan Gupta",
        role:"Pastry Chef"
    }
];

export const STORES: Store[] = [
  {
    id: "01",
    name: "Connaught Place",
    area: "New Delhi",
    address: "12 Connaught Place, New Delhi",
    hours: "Mon - Sun | 7 AM - 10 PM",
    phone: "+91 9876543210",
    status: "open",
    tags: ["Dine-in", "Takeaway", "Wifi"],
  },
  {
    id: "02",
    name: "Cyber Hub",
    area: "Gurugram",
    address: "Cyber Hub, Gurugram",
    hours: "Mon - Sun | 8 AM - 11 PM",
    phone: "+91 9123456780",
    status: "open",
    tags: ["Delivery", "Cafe", "Parking"],
  },
];

