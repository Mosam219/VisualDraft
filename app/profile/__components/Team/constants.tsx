import Link from 'next/link';
import { unixToStringFormat } from '@/lib/utils';
import { Project } from './types';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'index',
    header: '#',
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link href={`/project/${row.original._id}`}>
        <u>{row.original.name}</u>
      </Link>
    ),
  },
  {
    accessorKey: 'authorName',
    header: 'Author',
  },
  {
    accessorKey: '_creationTime',
    header: 'Created On',
    accessorFn: (data) => unixToStringFormat(data._creationTime),
  },
];
