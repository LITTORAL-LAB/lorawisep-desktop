import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface EnvironmentFormProps {
    openEnvConfig: boolean
    setOpenEnvConfig: (open: boolean) => void
}

export function EnvironmentForm(
    {openEnvConfig, setOpenEnvConfig}: EnvironmentFormProps
) {
  return (
    <Dialog open={openEnvConfig} onOpenChange={setOpenEnvConfig}>
    <DialogTrigger>
      <Button className="mt-2 w-full" variant="outline">
        Configurar
      </Button>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your account
          and remove your data from our servers.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
  );
}