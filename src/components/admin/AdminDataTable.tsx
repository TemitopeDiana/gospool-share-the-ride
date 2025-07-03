
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Trash2, Check, X } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface CustomAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
}

interface AdminDataTableProps {
  data: any[];
  columns: Column[];
  searchKey: string;
  showStatus?: boolean;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onApprove?: (item: any) => void;
  onReject?: (item: any) => void;
  customActions?: (item: any) => CustomAction[];
}

export const AdminDataTable = ({
  data,
  columns,
  searchKey,
  showStatus = false,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  customActions,
}: AdminDataTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter((item) => {
    if (!item || !item[searchKey]) return false;
    return item[searchKey]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'completed':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'failed':
        return 'bg-red-100 text-red-800';
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

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className="font-semibold">
                  {column.label}
                </TableHead>
              ))}
              {showStatus && <TableHead className="font-semibold">Status</TableHead>}
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (showStatus ? 1 : 0) + 1} 
                  className="text-center py-8 text-gray-500"
                >
                  {data.length === 0 ? 'No data available' : 'No matching results found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow key={item.id || index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <TableCell key={column.key} className="py-3">
                      {column.render 
                        ? column.render(item[column.key], item) 
                        : (item[column.key] || '-')
                      }
                    </TableCell>
                  ))}
                  {showStatus && (
                    <TableCell className="py-3">
                      <Badge className={getStatusColor(item.status)}>
                        {item.status || 'pending'}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell className="text-right py-3">
                    <div className="flex items-center justify-end space-x-2">
                      {customActions && customActions(item).map((action, actionIndex) => (
                        <Button
                          key={actionIndex}
                          variant={action.variant || 'outline'}
                          size="sm"
                          onClick={action.onClick}
                        >
                          {action.label}
                        </Button>
                      ))}
                      {onApprove && item.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onApprove(item)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {onReject && item.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onReject(item)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(item)}
                          className="hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(item)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
