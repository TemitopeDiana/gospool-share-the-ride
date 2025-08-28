import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { Search, Download, Eye, EyeOff, Calendar, DollarSign, User } from 'lucide-react';

export const RecentDonorsPage = () => {
  const { toast } = useToast();
  const { trackPageView, trackContentEngagement } = useAnalytics();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAnonymousDetails, setShowAnonymousDetails] = useState(false);

  // Track page view
  useEffect(() => {
    trackPageView('/admin/recent-donors');
  }, [trackPageView]);

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ['recent-donors', sortBy, sortOrder],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select(`
          *,
          paystack_transactions (
            reference,
            status,
            created_at
          )
        `)
        .eq('status', 'completed')
        .order(sortBy, { ascending: sortOrder === 'asc' });
      
      if (error) throw error;
      return data;
    },
  });

  // Filter donations based on search term and status
  const filteredDonations = donations.filter(donation => {
    const matchesSearch = searchTerm === '' || 
      donation.donor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donor_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.organization_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'anonymous' && donation.is_anonymous) ||
      (statusFilter === 'public' && !donation.is_anonymous) ||
      (statusFilter === 'individual' && donation.donor_type === 'individual') ||
      (statusFilter === 'organization' && donation.donor_type === 'organization');
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalAmount = filteredDonations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
  const averageAmount = filteredDonations.length > 0 ? totalAmount / filteredDonations.length : 0;
  const anonymousDonations = filteredDonations.filter(d => d.is_anonymous).length;
  const organizationDonations = filteredDonations.filter(d => d.donor_type === 'organization').length;

  const formatCurrency = (amount: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleExportData = () => {
    // Track export action
    trackContentEngagement('project', 'recent_donors_export', 'clicked');
    
    // Create CSV content
    const headers = ['Date', 'Donor Name', 'Email', 'Phone', 'Amount', 'Currency', 'Type', 'Organization', 'Anonymous', 'Reference'];
    const csvContent = [
      headers.join(','),
      ...filteredDonations.map(donation => [
        format(new Date(donation.created_at), 'yyyy-MM-dd HH:mm:ss'),
        donation.is_anonymous && !showAnonymousDetails ? 'Anonymous' : `"${donation.donor_name || ''}"`,
        donation.is_anonymous && !showAnonymousDetails ? 'Hidden' : `"${donation.donor_email || ''}"`,
        donation.is_anonymous && !showAnonymousDetails ? 'Hidden' : `"${donation.donor_phone || ''}"`,
        donation.amount || 0,
        donation.currency || 'NGN',
        donation.donor_type || 'individual',
        `"${donation.organization_name || ''}"`,
        donation.is_anonymous ? 'Yes' : 'No',
        `"${donation.paystack_transactions?.[0]?.reference || ''}"`
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `recent-donors-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: `Exported ${filteredDonations.length} donor records to CSV.`,
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recent Donors</h1>
            <p className="text-gray-600">View and manage all successful donations</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAnonymousDetails(!showAnonymousDetails)}
              variant={showAnonymousDetails ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              {showAnonymousDetails ? <EyeOff size={16} /> : <Eye size={16} />}
              {showAnonymousDetails ? 'Hide' : 'Show'} Anonymous Details
            </Button>
            <Button onClick={handleExportData} variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donors</p>
                <p className="text-2xl font-bold text-gray-900">{filteredDonations.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageAmount)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Eye className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Anonymous</p>
                <p className="text-2xl font-bold text-gray-900">{anonymousDonations}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search donors by name, email, or organization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Donors</SelectItem>
                  <SelectItem value="public">Public Donors</SelectItem>
                  <SelectItem value="anonymous">Anonymous Donors</SelectItem>
                  <SelectItem value="individual">Individuals</SelectItem>
                  <SelectItem value="organization">Organizations</SelectItem>
                </SelectContent>
              </Select>

              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [field, order] = value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at-desc">Newest First</SelectItem>
                  <SelectItem value="created_at-asc">Oldest First</SelectItem>
                  <SelectItem value="amount-desc">Highest Amount</SelectItem>
                  <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                  <SelectItem value="donor_name-asc">Name A-Z</SelectItem>
                  <SelectItem value="donor_name-desc">Name Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Donors List */}
        <Card>
          <CardHeader>
            <CardTitle>Donor Records ({filteredDonations.length})</CardTitle>
            <CardDescription>
              All successfully completed donations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredDonations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No donors found matching your criteria.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          {donation.donor_type === 'organization' ? (
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {donation.is_anonymous && !showAnonymousDetails 
                                  ? 'Anonymous Organization' 
                                  : donation.organization_name || 'Unknown Organization'
                                }
                              </h3>
                              {(!donation.is_anonymous || showAnonymousDetails) && (
                                <p className="text-sm text-gray-600">
                                  Contact: {donation.contact_person || 'N/A'} 
                                  {donation.organization_type && ` • ${donation.organization_type}`}
                                </p>
                              )}
                            </div>
                          ) : (
                            <h3 className="font-medium text-gray-900">
                              {donation.is_anonymous && !showAnonymousDetails 
                                ? 'Anonymous Donor' 
                                : donation.donor_name || 'Unknown Donor'
                              }
                            </h3>
                          )}
                          
                          {(!donation.is_anonymous || showAnonymousDetails) && (
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              {donation.donor_email && <span>{donation.donor_email}</span>}
                              {donation.donor_phone && <span>{donation.donor_phone}</span>}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={donation.donor_type === 'organization' ? 'default' : 'secondary'}>
                              {donation.donor_type || 'Individual'}
                            </Badge>
                            {donation.is_anonymous && (
                              <Badge variant="outline">Anonymous</Badge>
                            )}
                            {donation.belongs_to_church === 'yes' && (
                              <Badge variant="outline">Church Member</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">
                            {formatCurrency(donation.amount || 0, donation.currency)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(donation.created_at), 'MMM dd, yyyy')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(donation.created_at), 'HH:mm')}
                          </p>
                          {donation.paystack_transactions?.[0]?.reference && (
                            <p className="text-xs text-gray-400 mt-1">
                              Ref: {donation.paystack_transactions[0].reference}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {donation.church_name && (!donation.is_anonymous || showAnonymousDetails) && (
                        <p className="text-sm text-gray-600 mt-2">
                          Church: {donation.church_name}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};
