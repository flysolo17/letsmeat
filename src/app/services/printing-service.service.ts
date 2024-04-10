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
import {
  computeExpenses,
  computeInventoryCost,
  computeInventoryPrice,
  computeStartingCash,
  computeTransactionTotal,
  getTransactionTotal,
  toPHP,
} from '../utils/Constants';
import {
  tableCashierExpenses,
  tableExpenses,
  tableInventory,
  tableStartingCash,
  tableTransaction,
} from '../utils/Tables';
import { Expenses, PrintableExpenses } from '../models/expenses/Expenses';
import { Products } from '../models/products/Products';
import { CashRegister } from '../models/cashregister/CashRegister';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

interface Invoice {
  logo: string;
  company: {
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
  };
  invoice: {
    title: string;
    description: string;
    date: string;
  };
  total: string;
  shipping?: number;
}
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

  async printInventory(title: string, user: string, data: Products[]) {
    const logoImagePath = 'assets/images/logo.png';
    const logoImageDataURL = await this.getImageDataUrl(logoImagePath);

    const invoice = {
      logo: logoImageDataURL,
      company: {
        name: 'JJF Store',
        address: 'Urdaneta City',
        city: 'City, State, Zip',
        phone: '09665325698',
        email: 'letsmeat@example.com',
      },

      invoice: {
        title: title,
        date: new Date().toLocaleDateString(),
      },
      cost: toPHP(computeInventoryCost(data)),
      total: toPHP(computeInventoryPrice(data)),
    };

    const docDefinition: TDocumentDefinitions = {
      pageOrientation: 'landscape',
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
                {
                  text: 'Invoice Details\n\n',
                  style: 'header',
                  alignment: 'right',
                },

                {
                  text: `Title: ${invoice.invoice.title}\n`,
                  alignment: 'right',
                },
                { text: `Printed By: ${user}\n`, alignment: 'right' },
                { text: `Date: ${invoice.invoice.date}\n`, alignment: 'right' },
              ],
            },
          ],
          columnGap: 20,
          margin: [0, 0, 0, 20],
        },

        {
          style: 'tableExample',
          table: tableInventory(data),
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
            text: `Inventory Cost: ${invoice.cost}`,
            alignment: 'right',
            margin: [0, 0, 0, 0],
          },
          {
            text: `Total Price: ${invoice.total}`,
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

  async printExpenses(title: string, user: string, data: PrintableExpenses[]) {
    const logoImagePath = 'assets/images/logo.png';
    const logoImageDataURL = await this.getImageDataUrl(logoImagePath);

    const invoice = {
      logo: logoImageDataURL,
      company: {
        name: 'JJF Store',
        address: 'Urdaneta City',
        city: 'City, State, Zip',
        phone: '09665325698',
        email: 'letsmeat@example.com',
      },

      invoice: {
        title: title,
        date: new Date().toLocaleDateString(),
      },
      total: 0,
    };

    const docDefinition: TDocumentDefinitions = {
      pageOrientation: 'landscape',
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
                `Printed By: ${user}\n`,
                `Date: ${invoice.invoice.date}\n`,
              ],
            },
          ],
          columnGap: 20, // Add space between columns
          margin: [0, 0, 0, 20], // Add space at the bottom
        },

        {
          style: 'tableExample',
          table: tableExpenses(data),
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
            text: `Total: ${invoice.total}`,
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

  async printInvoice(printDate: PrintableTransactions<Transactions[]>) {
    const logoImagePath = 'assets/images/logo.png'; // Update the path based on your project structure
    const logoImageDataURL = await this.getImageDataUrl(logoImagePath);

    const invoice: Invoice = {
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
      total: computeTransactionTotal(printDate.data),
    };

    if (
      printDate.title === 'Online Transactions' ||
      printDate.title === 'Delivery Transactions'
    ) {
      invoice['shipping'] = printDate.shippintTotal;
    }

    const docDefinition: TDocumentDefinitions = {
      pageOrientation: 'landscape',
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
            text: invoice.shipping
              ? `Shipping Total: ${toPHP(invoice.shipping)}`
              : '',
            alignment: 'right',
            margin: [0, 0, 0, 0],
          },
          {
            text: `Total: ${invoice.total}`,
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

  async printZreading(
    user: String,
    transaction: Transactions[],
    cashRegister: CashRegister[],
    expenses: Expenses[]
  ) {
    const logoImagePath = 'assets/images/logo.png';
    const logoImageDataURL = await this.getImageDataUrl(logoImagePath);
    let sales = getTransactionTotal(transaction);
    let expense = computeExpenses(expenses);
    let startingCash = computeStartingCash(cashRegister);
    let total = sales + expense + startingCash;
    const invoice = {
      logo: logoImageDataURL,
      company: {
        name: 'JJF Store',
        address: 'Urdaneta City',
        city: 'City, State, Zip',
        phone: '09665325698',
        email: 'letsmeat@example.com',
      },

      invoice: {
        title: 'Z Reading',
        date: new Date().toLocaleDateString(),
      },
      transactons: toPHP(sales),
      expenses: toPHP(expense),
      cashregister: toPHP(computeStartingCash(cashRegister)),
      drawer: toPHP(total),
    };

    const docDefinition: TDocumentDefinitions = {
      pageOrientation: 'landscape',
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
                {
                  text: 'Z Reading\n\n',
                  style: 'header',
                  alignment: 'right',
                },

                {
                  text: `Title: ${invoice.invoice.title}\n`,
                  alignment: 'right',
                },
                { text: `Cashier: ${user}\n`, alignment: 'right' },
                { text: `Date: ${invoice.invoice.date}\n`, alignment: 'right' },
              ],
            },
          ],
          columnGap: 20,
          margin: [0, 0, 0, 20],
        },

        {
          style: 'tableExample',
          table: tableTransaction(transaction),
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
          style: 'tableExample',
          table: tableCashierExpenses(expenses),
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
          style: 'tableExample',
          table: tableStartingCash(cashRegister),
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
            text: `Sales: ${invoice.transactons}`,
            alignment: 'right',
            margin: [0, 0, 0, 0],
          },
          {
            text: `Starting Cash: ${invoice.cashregister}`,
            alignment: 'right',
            margin: [0, 0, 0, 0],
          },
          {
            text: `Expenses: ${invoice.expenses}`,
            alignment: 'right',
            margin: [0, 0, 0, 0],
          },

          {
            text: `Cash Drawer Total: ${invoice.drawer}`,
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
