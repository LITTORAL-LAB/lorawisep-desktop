import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface ICodeViewerProps {
    open: boolean
    setOpen: (open: boolean) => void
}

export function CodeViewer({ open, setOpen }: ICodeViewerProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div role="button"
                    onClick={() => setOpen(true)}>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>View Results</DialogTitle>
                    <DialogDescription>
                        {/* You can use the following code to start integrating your current
                        prompt and settings into your application. */}
                        This is are the results of your simulation. You can copy the code below
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="rounded-md bg-black p-6">
                        <pre>
                            <code className="grid gap-1 text-sm text-muted-foreground [&_span]:h-4">
                                <span>
                                    <span className="text-sky-300">Packet Delivery Ratio (PDR):</span> <span className="text-amber-300">90%</span>
                                </span>
                                <span>
                                    <span className="text-sky-300">Signal Noise Ratio (SNR): </span>  <span className="text-amber-300">120 dbi</span>
                                </span>
                                <span>
                                    <span className="text-sky-300">Received Signal Strength Indication (RSSI): </span> <span className="text-green-300">
                                        80%
                                    </span>
                                </span>
                                <span>
                                    <span className="text-sky-300">Delay:</span>  <span className="text-amber-300">9 ms</span>
                                </span>
                            </code>
                        </pre>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {/* Your API Key can be found here. You should use environment
                            variables or a secret management tool to expose your key to your
                            applications. */}
                            You can export the results to a file or copy the code above to use in your application. The file will be saved in your downloads folder as CSV.
                        </p>
                        <Button variant="default" className="mt-4 w-full">Export Results</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}