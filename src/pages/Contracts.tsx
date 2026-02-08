import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Contracts() {
    const [formData, setFormData] = useState({
        clientName: 'AUTO PEÇAS KOBBER LTDA',
        clientCNPJ: '05.330.992/0001-39',
        clientAddress: 'Br 158, número 882, Bairro Nossa Senhora Medianeira, Santa Maria - RS',
        clientRepName: 'Victor Sarmanho Kober',
        clientRepCPF: '015.518.560-85',
        startDate: '2025-11-10',
        endDate: '2026-02-10',
        monthlyFee: '9.970,00'
    });
    const [isGenerated, setIsGenerated] = useState(false);

    const handleGenerate = () => {
        const doc = new jsPDF();
        const margin = 20;
        let yPos = 20;

        const addText = (text: string, fontSize = 12, isBold = false, align: "left" | "center" | "right" | "justify" = "left") => {
            doc.setFontSize(fontSize);
            doc.setFont("helvetica", isBold ? "bold" : "normal");

            const pageWidth = doc.internal.pageSize.getWidth();
            let xPos = margin;

            if (align === "center") {
                xPos = pageWidth / 2;
            } else if (align === "right") {
                xPos = pageWidth - margin;
            }

            const splitText = doc.splitTextToSize(text, 170); // 170 is safe width for A4 with 20mm margins
            doc.text(splitText, xPos, yPos, { align: align === "justify" ? "left" : align, maxWidth: 170 });

            // Adjust line height
            const lineHeight = fontSize * 0.5; // Approximate conversion pt to mm
            yPos += (splitText.length * lineHeight) + 6; // +6 for spacing

            if (yPos > 280) {
                doc.addPage();
                yPos = 20;
            }
        };

        // Title
        addText("CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CONSULTORIA E GESTÃO DE MARKETING DIGITAL", 14, true, "center");
        yPos += 5;

        // Parties
        addText("DAS PARTES", 12, true);
        addText(`CONTRATANTE: ${formData.clientName.toUpperCase()}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº ${formData.clientCNPJ}, com sede na ${formData.clientAddress}, neste ato representada por seu sócio/procurador, Sr. ${formData.clientRepName}, portador do CPF nº ${formData.clientRepCPF}.`, 11, false, "justify");

        addText(`CONTRATADA: SCI ADS AGENCY LTDA (representada por CARLOS EDUARDO DA CUNHA BRAGA), inscrita no CNPJ sob o nº 61.110.568/0001-50, com sede a Rua Terezinha Schirmer Schramm, 85, Santa Maria - RS.`, 11, false, "justify");

        addText("As partes acima identificadas celebram o presente Contrato de Prestação de Serviços, que se regerá pelas cláusulas e condições a seguir.", 11, false, "justify");
        yPos += 5;

        // Clausula 1
        addText("CLÁUSULA 1ª – DO OBJETO", 12, true);
        addText("1.1. O objeto deste contrato é a prestação de serviços de consultoria, estratégia, gestão de tráfego pago e produção de conteúdo digital, conforme descrito no \"Projeto de Aceleração Digital 90 Dias\" (Sprint 90 Dias).", 11, false, "justify");
        addText("1.2. O objetivo principal dos serviços é estruturar a base digital da CONTRATANTE, construir autoridade de marca e implementar motores de aquisição de clientes.", 11, false, "justify");

        // Clausula 2
        addText("CLÁUSULA 2ª – DO PRAZO", 12, true);
        addText("2.1. O presente contrato terá a duração determinada de 90 (noventa) dias.", 11, false, "justify");
        const start = new Date(formData.startDate).toLocaleDateString('pt-BR');
        const end = new Date(formData.endDate).toLocaleDateString('pt-BR');
        addText(`2.2. O início da prestação dos serviços se dará em ${start}, encerrando-se em ${end}.`, 11, false, "justify");

        // Clausula 3 (Simplified for brevity in PDF generation logic, but capturing key points)
        addText("CLÁUSULA 3ª – DOS SERVIÇOS E ENTREGÁVEIS", 12, true);
        addText("3.1. A CONTRATADA executará as 4 fases do projeto: 1) Fundação e Estruturação (Setup); 2) Construção de Autoridade; 3) Geração de Caixa e Performance; 4) Imersão e Otimização.", 11, false, "justify");

        // Clausula 6
        addText("CLÁUSULA 6ª – DO VALOR E FORMA DE PAGAMENTO", 12, true);
        addText(`6.1. Pelos serviços, a CONTRATANTE pagará o valor total de R$ ${formData.monthlyFee}.`, 11, false, "justify");
        addText("6.3. Pagamento via PIX; chave: 61.110.568/0001-50.", 11, false, "justify");

        // Signatures
        yPos += 20;
        if (yPos > 250) { doc.addPage(); yPos = 40; }

        addText("__________________________________", 11, false, "left");
        addText(`CONTRATANTE: ${formData.clientName}`, 11, true, "left");
        yPos += 10;

        addText("__________________________________", 11, false, "left");
        addText("CONTRATADA: SCI ADS AGENCY LTDA", 11, true, "left");

        // Save
        doc.save(`Contrato_${formData.clientName.replace(/\s+/g, '_')}.pdf`);
        setIsGenerated(true);
        setTimeout(() => setIsGenerated(false), 3000);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Fábrica de Contratos</h2>
                <p className="text-muted-foreground">Gere contratos personalizados em PDF instantaneamente.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Dados do Contrato</CardTitle>
                        <CardDescription>Preencha as informações para gerar o documento.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="client">Razão Social (Contratante)</Label>
                            <Input
                                id="client"
                                value={formData.clientName}
                                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cnpj">CNPJ</Label>
                            <Input
                                id="cnpj"
                                value={formData.clientCNPJ}
                                onChange={(e) => setFormData({ ...formData, clientCNPJ: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Endereço Completo</Label>
                            <Input
                                id="address"
                                value={formData.clientAddress}
                                onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="repName">Representante</Label>
                                <Input
                                    id="repName"
                                    value={formData.clientRepName}
                                    onChange={(e) => setFormData({ ...formData, clientRepName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="repCPF">CPF Rep.</Label>
                                <Input
                                    id="repCPF"
                                    value={formData.clientRepCPF}
                                    onChange={(e) => setFormData({ ...formData, clientRepCPF: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start">Início</Label>
                                <Input
                                    id="start"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end">Término</Label>
                                <Input
                                    id="end"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="value">Valor Total (R$)</Label>
                            <Input
                                id="value"
                                value={formData.monthlyFee}
                                onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                            />
                        </div>

                        <Button className="w-full mt-4" onClick={handleGenerate}>
                            {isGenerated ? (
                                <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" /> Gerado com Sucesso!
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" /> Gerar PDF
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-muted/30 border-dashed">
                    <CardHeader>
                        <CardTitle>Prévia do Modelo</CardTitle>
                        <CardDescription>O contrato será gerado com base no modelo Kobber.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-4">
                        <div className="p-4 bg-background rounded border shadow-sm h-[600px] overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10" />
                            <div className="space-y-2 select-none opacity-70 p-2 text-xs">
                                <p className="font-bold text-center text-foreground uppercase">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CONSULTORIA E GESTÃO DE MARKETING DIGITAL</p>
                                <br />
                                <p className="font-bold">DAS PARTES</p>
                                <p><span className="font-bold">CONTRATANTE:</span> {formData.clientName}, CNPJ {formData.clientCNPJ}...</p>
                                <p><span className="font-bold">CONTRATADA:</span> SCI ADS AGENCY LTDA...</p>
                                <br />
                                <p className="font-bold">CLÁUSULA 1ª – DO OBJETO</p>
                                <p>1.1. O objeto deste contrato é a prestação de serviços de consultoria...</p>
                                <br />
                                <p className="font-bold">CLÁUSULA 2ª – DO PRAZO</p>
                                <p>2.1. Início: {formData.startDate} | Término: {formData.endDate}</p>
                                <br />
                                <p className="font-bold">CLÁUSULA 3ª – DOS SERVIÇOS</p>
                                <p>3.1. Fases 1 a 4 (Setup, Autoridade, Geração de Caixa, Otimização)...</p>
                                <br />
                                <p className="font-bold">CLÁUSULA 6ª – DO VALOR</p>
                                <p>Total de R$ {formData.monthlyFee}. Pagamento via PIX.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
