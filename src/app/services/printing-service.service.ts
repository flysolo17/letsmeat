import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {
  PageOrientation,
  TDocumentDefinitions,
  TDocumentInformation,
} from 'pdfmake/interfaces';
import { Transactions } from '../models/transactions/Transactions';
import {
  PrintTransactionData,
  PrintableTransactions,
  transactionDataTotal,
} from '../models/transactions/PrintableTransactions';
import { computeTransactionTotal, toPHP } from '../utils/Constants';
import { tableTransaction } from '../utils/Tables';

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

  async printInvoice(printDate: PrintableTransactions<Transactions[]>) {
    const logoImagePath = 'assets/images/logo.png'; // Update the path based on your project structure
    const logoImageDataURL = await this.getImageDataUrl(logoImagePath);
    const invoice = {
      logo: logoImageDataURL, // Replace with your logo URL
      company: {
        name: 'JJF Store',
        address: 'Urdaneta City',
        city: 'City, State, Zip',
        phone: '09665325698',
        email: 'letsmeat@example.com',
      },

      invoice: {
        title: printDate.title,
        description: printDate.description,
        date: printDate.date,
      },
      shipping: toPHP(printDate.shippintTotal),
      total: computeTransactionTotal(printDate.data),
    };

    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          columns: [
            {
              image: logoImageDataURL,
              fit: [100, 100],
              width: 100,
              alignment: 'left',
            },
            {
              alignment: 'right',
              width: '*',
              text: [
                { text: 'Invoice Details\n\n', style: 'header' },
                `Title: ${invoice.invoice.title}\n`,
                `${invoice.invoice.description}\n`,
                `Date: ${invoice.invoice.date}\n`,
              ],
            },
          ],
          columnGap: 20, // Add space between columns
          margin: [0, 0, 0, 20], // Add space at the bottom
        },

        {
          style: 'tableExample',
          table: tableTransaction(printDate.data),
          layout: {
            fillColor: function (
              rowIndex: number,
              node: any,
              columnIndex: any
            ) {
              return rowIndex === 0 ? '#4CAF50' : null;
            },
          },
        },
        {
          text: 'Signature: ___________________________',
          margin: [0, 20, 0, 0],
        },

        [
          {
            text: `Item Subtotal: ${invoice.total}`,
            alignment: 'right',
            margin: [0, 0, 0, 0],
          },
          {
            text: `Shipping Total: ${invoice.shipping}`,
            alignment: 'right',
            margin: [0, 0, 0, 0],
          },
          {
            text: `Total: ${invoice.total + invoice.shipping}`,
            alignment: 'right',
            margin: [0, 0, 0, 0],
          },
        ],
      ],
      styles: {
        tableExample: {
          margin: [0, 5, 0, 15],
        },
      },
    };
    pdfMake.createPdf(docDefinition).open();
  }
}
