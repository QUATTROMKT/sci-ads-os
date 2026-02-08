import { ModeToggle } from "@/components/mode-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function Settings() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Configurações</h3>
                <p className="text-sm text-muted-foreground">
                    Gerencie suas preferências de conta e aparência.
                </p>
            </div>
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Aparência</CardTitle>
                        <CardDescription>
                            Personalize a aparência do sistema. Alterne entre modo claro e escuro.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label>Tema</Label>
                                <p className="text-sm text-muted-foreground">Selecione o tema de sua preferência.</p>
                            </div>
                            <ModeToggle />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
