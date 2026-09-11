import { AppShell } from "@/components/app-shell"
import { CrewProvider } from "@/components/crew-store"

export default function Page() {
  return (
    <CrewProvider>
      <AppShell />
    </CrewProvider>
  )
}
