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

        // Helper for currency and dates
        const formatMoney = (val: string) => {
            const num = parseFloat(val.replace(/\./g, '').replace(',', '.').replace('R$', '').trim());
            return isNaN(num) ? '0,00' : num.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        };

        const calculateHalf = (val: string) => {
            const num = parseFloat(val.replace(/\./g, '').replace(',', '.').replace('R$', '').trim());
            return isNaN(num) ? '0,00' : (num / 2).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        }

        const formatDate = (dateString: string) => {
            if (!dateString) return 'DD/MM/AAAA';
            const [year, month, day] = dateString.split('-');
            return `${day}/${month}/${year}`;
        };

        const today = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

        // --- PDF CONTENT START ---

        // Title
        addText("CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CONSULTORIA E GESTÃO DE MARKETING DIGITAL", 14, true, "center");
        yPos += 5;

        // Parties
        addText("DAS PARTES", 12, true);
        addText(`CONTRATANTE: ${formData.clientName.toUpperCase()}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº ${formData.clientCNPJ}, com sede na ${formData.clientAddress}, neste ato representada por seu sócio/procurador, Sr. ${formData.clientRepName}, portador do CPF nº ${formData.clientRepCPF}.`, 11, false, "justify");

        addText("CONTRATADA: CARLOS EDUARDO DA CUNHA BRAGA, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 61.110.568/0001-50, com sede na Rua Terezinha Schirmer Schramm, 85, Bairro Presidente João Goulart, Santa Maria - RS, CEP 97090-597, neste ato representada por CARLOS EDUARDO DA CUNHA BRAGA, portador do CPF nº 037.113.100-60.", 11, false, "justify");

        addText("As partes acima identificadas celebram o presente Contrato de Prestação de Serviços, que se regerá pelas cláusulas e condições a seguir.", 11, false, "justify");
        yPos += 5;

        // Clause 1
        addText("CLÁUSULA 1ª – DO OBJETO", 12, true);
        addText("1.1. O objeto deste contrato é a prestação de serviços de consultoria, estratégia, gestão de tráfego pago e produção de conteúdo digital, conforme descrito no \"Projeto de Aceleração Digital 90 Dias\" (Sprint 90 Dias), apresentado e aprovado pela CONTRATANTE.", 11, false, "justify");
        addText("1.2. O objetivo principal dos serviços é estruturar a base digital da CONTRATANTE, construir autoridade de marca e implementar motores de aquisição de clientes (Geração de Caixa), conforme detalhado na proposta estratégica.", 11, false, "justify");

        // Clause 2
        addText("CLÁUSULA 2ª – DO PRAZO", 12, true);
        addText("2.1. O presente contrato terá a duração determinada de 90 (noventa) dias, referentes ao \"Sprint 90 Dias\".", 11, false, "justify");
        addText(`2.2. O início da prestação dos serviços se dará em ${formatDate(formData.startDate)}, encerrando-se em ${formatDate(formData.endDate)}.`, 11, false, "justify");

        // Clause 3
        addText("CLÁUSULA 3ª – DOS SERVIÇOS E ENTREGÁVEIS", 12, true);
        addText("3.1. A CONTRATADA se compromete a executar os serviços descritos nas quatro fases do projeto, conforme detalhado na tabela de entregáveis. Os serviços incluem, mas não se limitam a:", 11, false, "justify");

        addText("3.1.1. FASE 1: FUNDAÇÃO E ESTRUTURAÇÃO (SETUP)", 11, true);
        addText("Setup Técnico Completo: Configuração e otimização das contas de anúncio (Meta Ads, Google Ads), redes sociais (Instagram, Facebook, LinkedIn) e Google Meu Negócio.", 11, false, "justify");
        addText("Treinamento Operacional: Uma (1) sessão de capacitação da equipe interna da CONTRATANTE para execução da estratégia de conteúdo diário (Stories), incluindo a entrega de um cronograma de conteúdo.", 11, false, "justify");

        addText("3.1.2. FASE 2: CONSTRUÇÃO DE AUTORIDADE", 11, true);
        addText("Implementação de campanhas de reconhecimento e funil de vídeos estratégicos, abordando: Atração (Ex: \"Na Kobber Têm\"), Conexão (História/Tradição) e Prova Social (Estrutura/Equipe).", 11, false, "justify");

        addText("3.1.3. FASE 3: GERAÇÃO DE CAIXA E PERFORMANCE", 11, true);
        addText("Criação e gestão de campanhas de Alta Margem (foco em Motor/Caixa) para público qualificado no RS e SC.", 11, false, "justify");
        addText("Criação e gestão de Campanhas Sazonais (Fluxo de Caixa), visando a \"queima de estoque\" de peças paradas (Ex: \"Mês da Roda\").", 11, false, "justify");

        addText("3.1.4. FASE 4: IMERSÃO E OTIMIZAÇÃO (GESTÃO CONTÍNUA)", 11, true);
        addText("Gestão \"Lado a Lado\" para otimização de processos.", 11, false, "justify");
        addText("Testes contínuos de criativos, públicos e otimização de performance.", 11, false, "justify");
        addText("Entrega de doze (12) Relatórios Semanais de Performance.", 11, false, "justify");
        addText("Acompanhamento contínuo das metas de faturamento.", 11, false, "justify");

        addText("3.1.5. PRODUÇÃO DE CONTEÚDO", 11, true);
        addText("Roteiro de Vídeo Estratégico: 12 unidades (1 por semana).", 11, false, "justify");
        addText("Captação (Filmagem) Profissional: 12 sessões (1 por semana).", 11, false, "justify");
        addText("Edição de Vídeo (Feed/Anúncio): 12 unidades (1 por semana).", 11, false, "justify");

        // Clause 4
        addText("CLÁUSULA 4ª – DAS OBRIGAÇÕES DA CONTRATADA", 12, true);
        addText("4.1. Prestar os serviços descritos na Cláusula 3ª com zelo profissional, ética e observância às melhores práticas de mercado.", 11, false, "justify");
        addText("4.2. Fornecer relatórios de performance semanais à CONTRATANTE.", 11, false, "justify");
        addText("4.3. Manter sigilo absoluto sobre todas as informações da CONTRATANTE, conforme Cláusula 7ª.", 11, false, "justify");
        addText("4.4. A CONTRATADA prestará serviços como uma consultoria independente, não estabelecendo este contrato qualquer vínculo empregatício com a CONTRATANTE.", 11, false, "justify");
        addText("4.5. A CONTRATADA se compromete a empregar todos os esforços e técnicas para a otimização das campanhas, tratando-se de uma obrigação de meio, e não de resultado financeiro (faturamento) específico.", 11, false, "justify");

        // Clause 5
        addText("CLÁUSULA 5ª – DAS OBRIGAÇÕES DA CONTRATANTE", 12, true);
        addText("5.1. Efetuar o pagamento dos honorários conforme estabelecido na Cláusula 6ª.", 11, false, "justify");
        addText("5.2. Fornecer à CONTRATADA, em tempo hábil, todos os acessos necessários (logins, senhas, contas de anúncio, redes sociais) para a execução dos serviços.", 11, false, "justify");
        addText(`5.3. Indicar o Sr. ${formData.clientRepName} como ponto focal para comunicação, aprovações e fornecimento de informações.`, 11, false, "justify");
        addText("5.4. Fornecer o investimento (verba de anúncios) a ser pago diretamente às plataformas (Meta), valor este que não está incluso nos honorários deste contrato.", 11, false, "justify");
        addText("5.5. Participar do Treinamento Operacional e designar a equipe interna responsável pela execução da estratégia de conteúdo diário (Stories, Atendimento, etc.).", 11, false, "justify");
        addText("5.6. Fornecer materiais institucionais (logos, informações históricas, fotos de estoque) necessários para a criação dos conteúdos e vídeos.", 11, false, "justify");

        // Clause 6
        addText("CLÁUSULA 6ª – DO VALOR E FORMA DE PAGAMENTO", 12, true);
        addText(`6.1. Pelos serviços de consultoria, gestão e produção descritos neste contrato, a CONTRATANTE pagará à CONTRATADA o valor total de R$ ${formData.monthlyFee}, referente ao "Projeto Sprint 90 Dias".`, 11, false, "justify");
        addText("6.2. O pagamento será efetuado da seguinte forma (conforme Condição Especial da proposta):", 11, false, "justify");

        addText(`Opção A (À Vista): Pagamento integral de R$ ${formData.monthlyFee} na data da assinatura deste contrato.`, 11, false, "justify");

        const halfValue = calculateHalf(formData.monthlyFee);
        addText(`Opção B (2x): Pagamento de uma entrada de R$ ${halfValue} na data da assinatura deste contrato, e uma segunda parcela de R$ ${halfValue} em 30 (trinta) dias corridos.`, 11, false, "justify");

        addText("6.3. O(s) pagamento(s) deverá(ão) ser efetuado(s) através de PIX; chave: 61.110.568/0001-50", 11, false, "justify");
        addText("6.4. O não pagamento nas datas estipuladas sujeitará a CONTRATANTE a multa de 2% (dois por cento) e juros de 1% (um por cento) ao mês sobre o valor devido, podendo a CONTRATADA suspender os serviços após 5 (cinco) dias úteis de atraso, até a regularização.", 11, false, "justify");

        // Clause 7
        addText("CLÁUSULA 7ª – DA CONFIDENCIALIDADE E SIGILO (NDA)", 12, true);
        addText("7.1. A CONTRATADA obriga-se, em caráter irrevogável e irretratável, a manter o mais absoluto sigilo sobre quaisquer dados, informações estratégicas, comerciais, técnicas ou financeiras da CONTRATANTE a que venha a ter acesso em decorrência da execução deste contrato.", 11, false, "justify");
        addText("7.2. Este sigilo inclui, mas não se limita a: números de faturamento, volume de vendas, margens de lucro, custos operacionais, processos de atendimento (como o fluxo do WhatsApp), dados de estoque, lista de clientes, fornecedores e qualquer outra informação que não seja de domínio público.", 11, false, "justify");
        addText("7.3. A CONTRATADA não poderá divulgar, copiar, reproduzir ou transmitir tais informações a terceiros sem a prévia e expressa autorização por escrito da CONTRATANTE.", 11, false, "justify");
        addText("7.4. A CONTRATADA compromete-se a utilizar as informações confidenciais exclusivamente para os fins deste contrato.", 11, false, "justify");
        addText("7.5. A obrigação de sigilo prevista nesta cláusula sobreviverá ao término ou rescisão deste contrato por um período vitalício.", 11, false, "justify");

        // Clause 8
        addText("CLÁUSULA 8ª – DA RESCISÃO", 12, true);
        addText("8.1. O presente contrato poderá ser rescindido por qualquer das partes, mediante comunicação por escrito com antecedência mínima de 15 dias.", 11, false, "justify");
        addText("8.2. Caso a rescisão ocorra por iniciativa da CONTRATANTE sem justa causa (inadimplemento da CONTRATADA), os valores já pagos não serão reembolsados, e a CONTRATANTE deverá pagar pelos serviços proporcionalmente prestados até a data da rescisão.", 11, false, "justify");
        addText("8.3. Caso a rescisão ocorra por inadimplemento de qualquer das partes, a parte infratora ficará sujeita ao pagamento de multa rescisória no valor de 20% do valor do contrato, sem prejuízo de eventuais perdas e danos.", 11, false, "justify");

        // Clause 9
        addText("CLÁUSULA 9ª – DO FORO", 12, true);
        addText("9.1. As partes elegem o Foro da Comarca de Santa Maria, Estado do Rio Grande do Sul, para dirimir quaisquer controvérsias oriundas deste contrato, renunciando a qualquer outro, por mais privilegiado que seja.", 11, false, "justify");

        yPos += 5;
        addText("E, por estarem assim justas e contratadas, assinam o presente instrumento em 2 (duas) vias de igual teor e forma, na presença de 2 (duas) testemunhas.", 11, false, "justify");

        yPos += 5;
        addText(`Santa Maria, ${today}.`, 11, false, "right");

        // Signatures
        yPos += 20;
        if (yPos > 240) { doc.addPage(); yPos = 40; }

        addText("__________________________________", 11, false, "left");
        addText(`CONTRATANTE: ${formData.clientName}`, 11, true, "left");
        addText(`Por: ${formData.clientRepName}`, 10, false, "left");
        addText(`CPF: ${formData.clientRepCPF}`, 10, false, "left");

        yPos += 20;

        addText("__________________________________", 11, false, "left");
        addText("CONTRATADA: CARLOS EDUARDO DA CUNHA BRAGA", 11, true, "left");
        addText("Por: CARLOS EDUARDO DA CUNHA BRAGA", 10, false, "left");
        addText("CPF: 037.113.100-60", 10, false, "left");
        addText("JOÃO LEONARDO SANGOI KUPKE CPF: 030.519.500-09", 10, false, "left");

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
                        <CardDescription>O contrato será gerado com base no novo modelo padrão.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-4">
                        <div className="p-4 bg-background rounded border shadow-sm h-[600px] overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10" />
                            <div className="space-y-2 select-none opacity-70 p-2 text-xs">
                                <p className="font-bold text-center text-foreground uppercase">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CONSULTORIA E GESTÃO DE MARKETING DIGITAL</p>
                                <br />
                                <p className="font-bold">DAS PARTES</p>
                                <p><span className="font-bold">CONTRATANTE:</span> {formData.clientName}, CNPJ {formData.clientCNPJ}...</p>
                                <p><span className="font-bold">CONTRATADA:</span> CARLOS EDUARDO DA CUNHA BRAGA...</p>
                                <br />
                                <p className="font-bold">CLÁUSULA 1ª – DO OBJETO</p>
                                <p>1.1. O objeto deste contrato é a prestação de serviços de consultoria...</p>
                                <br />
                                <p className="font-bold">CLÁUSULA 3ª – DOS SERVIÇOS E ENTREGÁVEIS</p>
                                <p>3.1. FASE 1: FUNDAÇÃO E ESTRUTURAÇÃO...</p>
                                <p>3.1.2. FASE 2: CONSTRUÇÃO DE AUTORIDADE...</p>
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
