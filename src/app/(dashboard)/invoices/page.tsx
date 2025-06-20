<<<<<<< HEAD
// i18n-enabled invoices page
'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
=======
'use client';

import { useEffect, useState } from 'react';
>>>>>>> main
import { Download, Calendar, Search, Eye } from 'lucide-react';
import { Invoice, mockInvoices } from '@/lib/data/mock-data';
import PdfPreviewModal from '@/app/components/shared/PdfPreviewModal';

export default function InvoicesPage() {
<<<<<<< HEAD
  const { t } = useTranslation();
=======
>>>>>>> main
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState('');

  useEffect(() => {
<<<<<<< HEAD
    setInvoices(mockInvoices);
=======
    setInvoices(mockInvoices); // Simulate API fetch
>>>>>>> main
  }, []);

  const filtered = invoices.filter((inv) =>
    inv.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
<<<<<<< HEAD
        <h1 className="text-2xl font-semibold text-gray-800">{t('invoices.title')}</h1>
=======
        <h1 className="text-2xl font-semibold text-gray-800">Invoices</h1>
>>>>>>> main
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
<<<<<<< HEAD
            placeholder={t('invoices.search_placeholder')}
=======
            placeholder="Search invoices..."
>>>>>>> main
            className="pl-10 pr-4 py-2 border rounded-md text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-50 text-gray-600 font-medium">
            <tr>
<<<<<<< HEAD
              <th className="px-6 py-3 text-left">{t('invoices.columns.id')}</th>
              <th className="px-6 py-3 text-left">{t('invoices.columns.date')}</th>
              <th className="px-6 py-3 text-left">{t('invoices.columns.amount')}</th>
              <th className="px-6 py-3 text-left">{t('invoices.columns.status')}</th>
              <th className="px-6 py-3 text-right">{t('invoices.columns.action')}</th>
=======
              <th className="px-6 py-3 text-left">Invoice #</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Amount</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
>>>>>>> main
            </tr>
          </thead>
          <tbody>
            {filtered.map((invoice) => (
              <tr key={invoice.id} className="border-t">
                <td className="px-6 py-4">{invoice.id}</td>
                <td className="px-6 py-4 flex items-center gap-2 text-gray-700">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {invoice.date}
                </td>
                <td className="px-6 py-4">{invoice.amount}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      invoice.status === 'Paid'
                        ? 'bg-green-100 text-green-600'
                        : invoice.status === 'Unpaid'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
<<<<<<< HEAD
                    {t(`invoices.status.${invoice.status.toLowerCase()}`)}
=======
                    {invoice.status}
>>>>>>> main
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex gap-3 justify-end">
                  <a
                    href={`/pdf/${invoice.fileUrl}`}
                    download
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Download size={16} />
                  </a>
                  <button
                    onClick={() => {
                      setSelectedPdfUrl(`/pdf/${invoice.fileUrl}`);
                      setPdfModalOpen(true);
                    }}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <Eye size={16} />
                  </button>
<<<<<<< HEAD
=======

                  <PdfPreviewModal
                    isOpen={pdfModalOpen}
                    onClose={() => setPdfModalOpen(false)}
                    fileUrl={selectedPdfUrl}
                  />
>>>>>>> main
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
<<<<<<< HEAD
                  {t('invoices.no_results')}
=======
                  No invoices found.
>>>>>>> main
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PdfPreviewModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        fileUrl={selectedPdfUrl}
      />
    </div>
  );
}
