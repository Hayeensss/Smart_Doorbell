import Link from "next/link"
import { Bell } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <p className="text-sm text-muted-foreground">© 2025 Smart Doorbell. All rights reserved.</p>
        </div>
        <div className="flex gap-4">
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Terms
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Support
          </Link>
        </div>
      </div>
    </footer>
  )
} 