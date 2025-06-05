'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  HourglassIcon,
  Eye,
} from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';
import { Agreement, AgreementStatus } from '@/lib/data/mock-data';
import PdfPreviewModal from '@/app/components/shared/PdfPreviewModal';

export default function ClubAgreementsPage() {
  const { user } = useAuth();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | AgreementStatus>('All');
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState('');

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const response = await fetch('/api/agreements');
        const data: Agreement[] = await response.json();

        if (user?.clubId) {
          const filtered = data.filter(
            (agreement) => agreement.clubId === user.clubId && agreement.id === 'AGR-00100',
          );
          setAgreements(filtered);
        }
      } catch (error) {
        console.error('Error fetching agreements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgreements();
  }, [user]);

  const filtered = agreements.filter((agreement) => {
    const matchesSearch =
      agreement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || agreement.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: AgreementStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <HourglassIcon size={12} className="mr-1" /> Pending
          </span>
        );
      case 'Active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" /> Active
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock size={12} className="mr-1" /> In Progress
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <CheckCircle size={12} className="mr-1" /> Completed
          </span>
        );
      case 'Canceled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle size={12} className="mr-1" /> Canceled
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Club Agreements</h1>
        <p className="text-gray-500 text-sm mt-1">
          View and manage contracts and agreements related to your club.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search agreements..."
            className="pl-10 pr-4 py-2 w-full border rounded-md text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative min-w-[150px]">
          <select
            className="appearance-none border rounded-md px-4 py-2 pr-8 bg-white w-full text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AgreementStatus | 'All')}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Filter size={18} className="text-gray-600" />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <FileText size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No agreements found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((agreement) => (
            <div
              key={agreement.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {agreement.id}
                  </div>
                  {getStatusBadge(agreement.status)}
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-2">{agreement.name}</h3>

                <div className="space-y-2 mt-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-2 text-gray-400" />
                    <span>Start: {agreement.createdAt}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-2 text-gray-400" />
                    <span>End: {agreement.validUntil}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 flex items-center justify-end gap-4">
                <a
                  href={`/pdf/${agreement.file}`}
                  download
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Download size={16} />
                </a>
                <button
                  onClick={() => {
                    setSelectedPdfUrl(`/pdf/${agreement.file}`);
                    setPdfModalOpen(true);
                  }}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <Eye size={16} />
                </button>

                <PdfPreviewModal
                  isOpen={pdfModalOpen}
                  onClose={() => setPdfModalOpen(false)}
                  fileUrl={selectedPdfUrl}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
