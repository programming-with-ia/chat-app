import { Icon } from "@/components/Icons"

export interface SidebarOption {
  id: number
  name: string
  href: string
  Icon: Icon
}

export interface SessionType {
  user: User
  expires: string;
}