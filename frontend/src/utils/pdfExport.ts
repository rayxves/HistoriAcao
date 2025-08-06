import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DocumentDto {
  id: number;
  titulo?: string;
  tipo: string;
  descricao?: string;
  origem?: string;
  url?: string;
  texto?: string;
}

interface AlternativeDto {
  id: number;
  letra: string;
  texto: string;
  pontuacao: number;
}

interface QuestionDto {
  id: number;
  fase: number;
  olimpiada: string;
  nivelDificuldade: string;
  topico: string;
  subtopico: string;
  dataInicio?: string;
  dataFim?: string;
  enunciado: string;
  documentos?: DocumentDto[];
  alternativas?: AlternativeDto[];
}

const PDF_CONFIG = {
  page: {
    margins: {
      top: 25,
      left: 20,
      right: 20,
      bottom: 25,
    },
    size: "a4" as const,
  },
  colors: {
    primary: "#1A237E",
    secondary: "#5C6BC0",
    text: "#212121",
    lightText: "#757575",
    accent: "#D32F2F",
    background: "#F5F5F5",
    separator: "#BDBDBD",
  },
  fonts: {
    title: 18,
    subtitle: 14,
    body: 12,
    small: 9,
    lineHeight: 1.5,
  },
};

const imageCache = new Map<string, string>();

async function loadSupabaseImage(url: string): Promise<string> {
  if (imageCache.has(url)) {
    return imageCache.get(url)!;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not create canvas context");
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        imageCache.set(url, dataUrl);
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () =>
      reject(new Error(`Failed to load image from URL: ${url}`));
    const timestamp = Date.now();
    const separator = url.includes("?") ? "&" : "?";
    img.src = `${url}${separator}t=${timestamp}`;
  });
}

function addHeader(doc: jsPDF, title: string) {
  const { colors, fonts } = PDF_CONFIG;
  const pageWidth = doc.internal.pageSize.getWidth();
  (doc as any).title = title;

  const originalColor = doc.getTextColor();
  const originalFont = {
    fontName: doc.getFont().fontName,
    fontStyle: doc.getFont().fontStyle,
  };
  const originalFontSize = doc.getFontSize();

  doc.setFontSize(fonts.title);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(colors.primary);
  doc.text(title, pageWidth / 2, PDF_CONFIG.page.margins.top - 10, {
    align: "center",
  });

  doc.setDrawColor(colors.secondary);
  doc.setLineWidth(0.3);
  doc.line(
    PDF_CONFIG.page.margins.left,
    PDF_CONFIG.page.margins.top,
    pageWidth - PDF_CONFIG.page.margins.right,
    PDF_CONFIG.page.margins.top
  );

  doc.setTextColor(originalColor);
  doc.setFont(originalFont.fontName, originalFont.fontStyle);
  doc.setFontSize(originalFontSize);
}

function addFooter(doc: jsPDF, pageNumber: number, totalPages: number) {
  const { colors, fonts } = PDF_CONFIG;
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(fonts.small);
  doc.setTextColor(colors.lightText);

  const dateStr = `Gerado em: ${new Date().toLocaleDateString("pt-BR")}`;
  doc.text(
    dateStr,
    PDF_CONFIG.page.margins.left,
    pageHeight - PDF_CONFIG.page.margins.bottom + 10
  );

  const pageStr = `Página ${pageNumber} de ${totalPages}`;
  doc.text(
    pageStr,
    pageWidth - PDF_CONFIG.page.margins.right,
    pageHeight - PDF_CONFIG.page.margins.bottom + 10,
    { align: "right" }
  );
}

function addLongText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeightMultiplier: number = 1.4
): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  const lineHeight = doc.getFontSize() * 0.352777 * lineHeightMultiplier;
  let currentY = y;

  for (const line of lines) {
    if (
      currentY + lineHeight >
      doc.internal.pageSize.getHeight() - PDF_CONFIG.page.margins.bottom
    ) {
      doc.addPage();
      addHeader(doc, (doc as any).title || "Questões Selecionadas");
      currentY = PDF_CONFIG.page.margins.top + 10;
    }
    doc.text(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

class PDFBuilder {
  private doc: jsPDF;
  private yPos: number;
  private title: string;

  constructor(doc: jsPDF, title: string) {
    this.doc = doc;
    this.yPos = PDF_CONFIG.page.margins.top + 10;
    this.title = title;
  }

  private checkSpace(neededHeight: number): void {
    if (
      this.yPos + neededHeight >
      this.doc.internal.pageSize.getHeight() - PDF_CONFIG.page.margins.bottom
    ) {
      this.doc.addPage();
      addHeader(this.doc, this.title);
      this.yPos = PDF_CONFIG.page.margins.top + 10;
    }
  }

  private async addDocument(documento: DocumentDto) {
    const { colors, fonts } = PDF_CONFIG;
    const contentWidth =
      this.doc.internal.pageSize.getWidth() -
      PDF_CONFIG.page.margins.left -
      PDF_CONFIG.page.margins.right;

    if (documento.titulo) {
      this.checkSpace(15);
      this.doc.setFontSize(fonts.subtitle - 2);
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(colors.secondary);
      this.yPos = addLongText(
        this.doc,
        documento.titulo,
        PDF_CONFIG.page.margins.left,
        this.yPos,
        contentWidth
      );
      this.yPos += 4;
    }

    if (documento.descricao) {
      this.checkSpace(10);
      this.doc.setFontSize(fonts.small);
      this.doc.setFont("helvetica", "italic");
      this.doc.setTextColor(colors.lightText);
      this.yPos = addLongText(
        this.doc,
        documento.descricao,
        PDF_CONFIG.page.margins.left,
        this.yPos,
        contentWidth
      );
      this.yPos += 5;
    }

    if (documento.url) {
      try {
        const imgData = await loadSupabaseImage(documento.url);
        const imgProps = this.doc.getImageProperties(imgData);
        const maxWidth = contentWidth;
        const maxHeight = 120;
        const ratio = Math.min(
          maxWidth / imgProps.width,
          maxHeight / imgProps.height
        );
        const width = imgProps.width * ratio;
        const height = imgProps.height * ratio;

        this.checkSpace(height + 15);
        this.doc.addImage(
          imgData,
          "JPEG",
          PDF_CONFIG.page.margins.left,
          this.yPos,
          width,
          height
        );
        this.yPos += height + 5;

        if (documento.origem) {
          this.doc.setFontSize(fonts.small - 1);
          this.doc.setTextColor(colors.lightText);
          this.doc.text(
            `Fonte: ${documento.origem}`,
            PDF_CONFIG.page.margins.left,
            this.yPos
          );
          this.yPos += 8;
        }
      } catch (error) {
        this.doc.setFontSize(fonts.small);
        this.doc.setTextColor(colors.accent);
        this.yPos = addLongText(
          this.doc,
          `[Imagem não disponível: ${documento.url}]`,
          PDF_CONFIG.page.margins.left,
          this.yPos,
          contentWidth
        );
        this.yPos += 5;
      }
    }

    if (documento.texto) {
      this.doc.setFontSize(fonts.body - 1);
      this.doc.setFont("helvetica", "normal");
      this.doc.setTextColor(colors.text);
      this.yPos = addLongText(
        this.doc,
        documento.texto,
        PDF_CONFIG.page.margins.left + 5,
        this.yPos,
        contentWidth - 5
      );
      this.yPos += 10;
    }

    this.doc.setTextColor(colors.text);
  }

  public async addQuestion(
    question: QuestionDto,
    index: number,
    isLast: boolean
  ) {
    const { colors, fonts } = PDF_CONFIG;
    const contentWidth =
      this.doc.internal.pageSize.getWidth() -
      PDF_CONFIG.page.margins.left -
      PDF_CONFIG.page.margins.right;

    this.checkSpace(40);
    this.doc.setFontSize(fonts.subtitle);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(colors.primary);
    this.doc.text(
      `Questão ${index + 1}`,
      PDF_CONFIG.page.margins.left,
      this.yPos
    );
    this.yPos += 8;

    this.doc.setFontSize(fonts.small);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(colors.lightText);
    const metaText = `${question.fase}ª Fase | ${question.nivelDificuldade} | ${
      question.topico
    }${question.subtopico ? ` | ${question.subtopico}` : ""}`;
    this.doc.text(metaText, PDF_CONFIG.page.margins.left, this.yPos);
    this.yPos += 10;

    this.doc.setFontSize(fonts.body);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(colors.text);
    this.yPos = addLongText(
      this.doc,
      question.enunciado,
      PDF_CONFIG.page.margins.left,
      this.yPos,
      contentWidth
    );
    this.yPos += 10;

    if (question.documentos?.length) {
      this.checkSpace(15);
      this.doc.setFontSize(fonts.body - 1);
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(colors.text);
      this.doc.text(
        "Documentos de Apoio",
        PDF_CONFIG.page.margins.left,
        this.yPos
      );
      this.yPos += 8;

      for (const doc of question.documentos) {
        await this.addDocument(doc);
      }
    }

    if (question.alternativas?.length) {
      this.checkSpace(15);
      this.doc.setFontSize(fonts.body - 1);
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(colors.text);
      this.doc.text("Alternativas", PDF_CONFIG.page.margins.left, this.yPos);
      this.yPos += 8;
      const sortedAlts = [...question.alternativas].sort((a, b) =>
        a.letra.localeCompare(b.letra)
      );

      for (const alt of sortedAlts) {
        this.doc.setFontSize(fonts.body - 1);
        this.doc.setFont("helvetica", "normal");
        this.doc.setTextColor(colors.text);

        const altText = `${alt.letra}) ${alt.texto}`;
        this.yPos = addLongText(
          this.doc,
          altText,
          PDF_CONFIG.page.margins.left + 5,
          this.yPos,
          contentWidth - 5
        );
        this.yPos += 6;
      }
    }

    if (!isLast) {
      this.yPos += 8;
      this.checkSpace(20);
      this.doc.setDrawColor(colors.separator);
      this.doc.setLineWidth(0.2);
      this.doc.line(
        PDF_CONFIG.page.margins.left,
        this.yPos,
        this.doc.internal.pageSize.getWidth() - PDF_CONFIG.page.margins.right,
        this.yPos
      );
      this.yPos += 12;
    } else {
      this.yPos += 15;
    }
  }

  public addAnswerKey(questions: QuestionDto[]) {
    this.doc.addPage();
    addHeader(this.doc, "GABARITO");
    this.yPos = PDF_CONFIG.page.margins.top + 15;
    const { colors, fonts } = PDF_CONFIG;

    this.doc.setFontSize(fonts.body);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(
      "A pontuação mais alta indica a resposta correta.",
      PDF_CONFIG.page.margins.left,
      this.yPos
    );
    this.yPos += 15;

    const answerBody = questions.map((q, i) => {
      const correctAlt = q.alternativas?.reduce((max, alt) =>
        alt.pontuacao > max.pontuacao ? alt : max
      );
      return [
        (i + 1).toString(),
        correctAlt?.letra || "-",
        correctAlt?.texto || "Não disponível",
      ];
    });

    autoTable(this.doc, {
      startY: this.yPos,
      head: [["Questão", "Resposta", "Alternativa Correta"]],
      body: answerBody,
      theme: "grid",
      headStyles: {
        fillColor: colors.primary,
        textColor: "#FFFFFF",
        fontStyle: "bold",
        fontSize: fonts.small + 1,
        halign: "center",
      },
      styles: {
        cellPadding: 3,
        fontSize: fonts.small,
        overflow: "linebreak",
        lineWidth: 0.1,
        borderColor: "#DDDDDD",
      },
      columnStyles: {
        0: { cellWidth: 25, halign: "center" },
        1: { cellWidth: 25, halign: "center" },
        2: { cellWidth: "auto" },
      },
      alternateRowStyles: { fillColor: colors.background },
    });
  }
}

export async function exportQuestionsToPDF(
  questions: QuestionDto[],
  title: string = "Questões Selecionadas",
  options?: { includeAnswerKey?: boolean; watermark?: string }
): Promise<void> {
  if (!questions || questions.length === 0) {
    console.warn("Nenhuma questão fornecida para exportação");
    return;
  }
  if (!questions.every((q) => q.enunciado && q.alternativas?.length >= 2)) {
    throw new Error(
      "Algumas questões não têm enunciado ou alternativas suficientes"
    );
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: PDF_CONFIG.page.size,
  });
  const builder = new PDFBuilder(doc, title);
  addHeader(doc, title);

  if (options?.watermark) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(50);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(230, 230, 230);
    doc.setGState(new (doc as any).GState({ opacity: 0.5 }));
    doc.text(options.watermark, pageWidth / 2, pageHeight / 2, {
      angle: -45,
      align: "center",
    });
    doc.setGState(new (doc as any).GState({ opacity: 1 }));
  }

  try {
    for (let i = 0; i < questions.length; i++) {
      await builder.addQuestion(questions[i], i, i === questions.length - 1);
    }

    if (options?.includeAnswerKey !== false) {
      builder.addAnswerKey(questions);
    }

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(doc, i, totalPages);
    }

    const fileName = `${title.replace(/[^a-zA-Z0-9]/g, "_")}_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw new Error(
      "Falha ao gerar PDF. Verifique o console para mais detalhes."
    );
  }
}
