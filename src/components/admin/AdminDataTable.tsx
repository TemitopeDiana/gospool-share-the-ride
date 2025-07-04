
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, X, Search } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface AdminDataTableProps {
  data: any[];
  columns: Column[];
  searchKey: string;
  showStatus?: boolean;
  onApprove?: (item: any) => void;
  onReject?: (item: any) => void;
  showActions?: (item: any) => boolean;
}

export const AdminDataTable = ({
  data,
  columns,
  searchKey,
  showStatus = false,
  onApprove,
  onReject,
  showActions,
}: AdminDataTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter((item) =>
    item[searchKey]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.organization_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={`Search ${searchKey}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              {showStatus && <TableHead>Status</TableHead>}
              {(onApprove || onReject) && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showStatus ? 1 : 0) + (onApprove || onReject ? 1 : 0)}
                  className="text-center py-8 text-gray-500"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow key={item.id || index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key] || '-'}
                    </TableCell>
                  ))}
                  {showStatus && (
                    <TableCell>
                      <Badge className={getStatusColor(item.status)} variant="secondary">
                        {item.status || 'pending'}
                      </Badge>
                    </TableCell>
                  )}
                  {(onApprove || onReject) && (
                    <TableCell>
                      <div className="flex space-x-2">
                        {(!showActions || showActions(item)) && (
                          <>
                            {onApprove && (
                              <Button
                                size="sm"
                                onClick={() => onApprove(item)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            {onReject && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => onReject(item)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </>
                        )}
                        {showActions && !showActions(item) && (
                          <span className="text-sm text-gray-500">Auto-confirmed</span>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
