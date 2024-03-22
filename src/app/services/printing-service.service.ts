import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PageOrientation, TDocumentDefinitions } from 'pdfmake/interfaces';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
@Injectable({
  providedIn: 'root',
})
export class PrintingServiceService {
  logoImagePath = 'assets/images/logo.png';
  constructor(private sanitizer: DomSanitizer) {}

  async printReport(
    title: string,
    description: string,
    date: string,
    owner: string
  ): Promise<void> {
    // Preload the image
    const logoDataUrl = await this.getImageDataUrl(this.logoImagePath);

    const documentDefinition: TDocumentDefinitions = {
      header: {
        columns: [
          {
            stack: [
              { text: 'JJF Frozen Store', bold: true },
              { text: title, bold: true },
              { text: description },
              {
                text: `Date: ${new Date().toLocaleDateString()}`,
                alignment: 'left',
              },
              { text: `Owner: ${owner}`, alignment: 'left' },
            ],
            alignment: 'left',
            margin: [10, 10, 0, 0],
          },
          {
            image: logoDataUrl, // Use the preloaded image data URL
            width: 50,
            height: 50,
            alignment: 'right',
            margin: [0, 10, 10, 0],
          },
        ],
      },
      content: [],
      footer: {
        columns: [
          { text: 'Left part', alignment: 'left', margin: [10, 0, 0, 10] },
          { text: 'Right part', alignment: 'right', margin: [0, 0, 10, 10] },
        ],
      },
      pageMargins: [40, 40, 40, 40],
    };

    pdfMake.createPdf(documentDefinition).download(`${title}.pdf`);
  }

  private async getImageDataUrl(imagePath: string): Promise<string> {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
