// src/app/(dashboard)/agreement-templates/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Tag,
  Edit
} from 'lucide-react';
import { AgreementTemplate } from '@/lib/data/mock-data';

export default function AgreementTemplatesPage() {
  const [templates, setTemplates] = useState<AgreementTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates');
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(templates.map(t => t.category))];

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Agreement Templates</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center">
          <Plus size={18} className="mr-2" /> Create New Template
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search templates..."
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="appearance-none border rounded-md px-4 py-2 pr-8 bg-white"
            value={selectedCategory || 'All'}
            onChange={(e) => setSelectedCategory(e.target.value === 'All' ? null : e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Filter size={18} className="text-gray-600" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({ template }: { template: AgreementTemplate }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between mb-2">
        <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
        <div className="flex items-center">
          <Calendar size={16} className="text-gray-400 mr-1" />
          <span className="text-sm text-gray-600">Created: {template.createdAt}</span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{template.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Tag size={16} className="text-indigo-500 mr-1" />
          <span className="text-sm text-gray-600">{template.category}</span>
        </div>
        <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-1 px-3 rounded-md flex items-center">
          <Edit size={16} className="mr-1" /> Edit
        </button>
      </div>
    </div>
  );
}