"use client"

import * as React from "react"
import { z } from "zod"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

// Icons
import {
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheckFilled,
  IconCirclePlus,
  IconCircleXFilled,
  IconClockFilled,
  IconDotsVertical,
  IconEye,
  IconMail,
  IconSearch,
  IconX,
} from "@tabler/icons-react"

// Utils
import { cn } from "@/lib/utils"

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Jobs } from "@/app/api/job"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

// --- 1. Data Types & Schema ---
const applicantSchema = z.object({
  id: z.union([z.number(), z.string()]),
  applicationId: z.union([z.number(), z.string()]).optional(),
  name: z.string(),
  email: z.string(),
  initials: z.string().optional(),
  company: z.string().optional(),
  dateApplied: z.string(),
  matchScore: z.number().optional(),
  status: z.string(),
})

type Applicant = z.infer<typeof applicantSchema>

// --- 2. Sample Data ---
const SAMPLE_DATA: Applicant[] = [
  { id: 1, name: "Suryansh", email: "suryansh@gmail.com", initials: "Su", company: "Google", dateApplied: "Apr 30, 2025", matchScore: 92, status: "Accepted" },
  { id: 2, name: "Prajwal", email: "prajwal@gmail.com", initials: "Pr", company: "Microsoft", dateApplied: "Apr 28, 2025", matchScore: 45, status: "Pending" },
  { id: 3, name: "Amelia Rose", email: "amelia.r@example.com", initials: "AR", company: "Amazon", dateApplied: "Apr 25, 2025", matchScore: 12, status: "Rejected" },
  { id: 4, name: "Liam Smith", email: "liam.tech@example.com", initials: "LS", company: "Meta", dateApplied: "Apr 22, 2025", matchScore: 88, status: "Accepted" },
  { id: 5, name: "Olivia Jay", email: "olivia.j@example.com", initials: "OJ", company: "Apple", dateApplied: "Apr 20, 2025", matchScore: 78, status: "Pending" },
  { id: 6, name: "Noah Brown", email: "noah.b@example.com", initials: "NB", company: "Netflix", dateApplied: "Apr 18, 2025", matchScore: 65, status: "Pending" },
  { id: 7, name: "Sophia Green", email: "sophia.green@example.com", initials: "SG", company: "Tesla", dateApplied: "Apr 16, 2025", matchScore: 95, status: "Accepted" },
  { id: 8, name: "James Bond", email: "007@example.com", initials: "JB", company: "SpaceX", dateApplied: "Apr 15, 2025", matchScore: 99, status: "Pending" },
  { id: 9, name: "Lucas White", email: "lucas.w@example.com", initials: "LW", company: "Stripe", dateApplied: "Apr 12, 2025", matchScore: 30, status: "Rejected" },
  { id: 10, name: "Mia Wong", email: "mia.wong@example.com", initials: "MW", company: "Airbnb", dateApplied: "Apr 10, 2025", matchScore: 72, status: "Pending" },
]

// --- 3. Filter Component (No Search Input) ---
interface DataTableFacetedFilterProps<TData, TValue> {
  column?: any
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <IconCirclePlus className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value)
                      } else {
                        selectedValues.add(option.value)
                      }
                      const filterValues = Array.from(selectedValues)
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      )
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <IconCheck className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// --- 4. Table Configuration ---
const statusOptions = [
  { label: "Under Review", value: "Under Review", icon: IconClockFilled },
  { label: "Shortlisted", value: "Shortlisted", icon: IconCircleCheckFilled },
  { label: "Rejected", value: "Rejected", icon: IconCircleXFilled },
]

// --- 5. Main Component ---
interface DataTableProps {
  jobId?: string
  data?: Applicant[]
  isLoading?: boolean
  isError?: boolean
  jobTitle?: string
  onStatusFilterChange?: (status?: string) => void
}

export function DataTable({
  jobId,
  jobTitle,
  data = SAMPLE_DATA,
  isLoading,
  isError,
  onStatusFilterChange,
}: DataTableProps) {
  const [tableData, setTableData] = React.useState(data)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const router= useRouter()
  const queryClient = useQueryClient()
    const handleView=()=>{
      router.push(`/admin/applications/${jobId}`)
    }
  React.useEffect(() => {
    setTableData(data)
  }, [data])

  const statusMutation = useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: string }) =>
      Jobs.updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-applications", jobId] })
    },
  })

  const columns: ColumnDef<Applicant>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                ? "indeterminate"
                : false
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      size: 40,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Applicant Name",
      enableHiding: false,
      cell: ({ row }) => {
        const name = (row.getValue("name") as string) || "No Name"
        const email = row.original.email || "No Email"
        const initials = row.original.initials || name.slice(0, 2).toUpperCase()

        return (
          <div className="flex items-center gap-3 min-w-[150px]">
            <Avatar className="h-9 w-9 bg-muted/50 border">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground truncate">
                {name}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {email}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "matchScore",
      header: "Match Score",
      cell: ({ row }) => {
        const score = row.original.matchScore || 0
        let colorClass = "bg-red-500"
        if (score >= 80) colorClass = "bg-emerald-500"
        else if (score >= 50) colorClass = "bg-amber-500"

        return (
          <div className="flex w-[120px] items-center gap-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full ${colorClass} transition-all duration-500`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground w-8 text-right">
              {score}%
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "dateApplied",
      header: "Date Applied",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {row.original.dateApplied || "--"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const rawStatus = row.original.status || "Under Review"
        const status = rawStatus.replace(/_/g, " ")
        let variant = "bg-amber-50 text-amber-700 border-amber-200"
        let Icon = IconClockFilled

        if (status.toLowerCase().includes("shortlisted")) {
          variant = "bg-emerald-50 text-emerald-700 border-emerald-200"
          Icon = IconCircleCheckFilled
        } else if (status.toLowerCase().includes("reject")) {
          variant = "bg-red-50 text-red-700 border-red-200"
          Icon = IconCircleXFilled
        }

        return (
          <Badge
            variant="outline"
            className={`${variant} gap-1.5 py-0.5 pl-1.5 pr-2.5`}
          >
            <Icon className="size-3.5" />
            {status}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: "actions",
      header: () => <div className="sr-only">Actions</div>,
      cell: ({ row }) => {
        const applicationId =
          (row.original as any).applicationId || (row.original as any).id

        const handleUpdate = (status: "SHORTLISTED" | "REJECTED") => {
          if (!applicationId || statusMutation.isPending) return
          statusMutation.mutate({ applicationId: String(applicationId), status })
        }

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground"
                  disabled={statusMutation.isPending}
                >
                  <IconDotsVertical className="size-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleView} >
                  <IconEye className="mr-2 size-4 opacity-70" />
                  View Application
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <IconMail className="mr-2 size-4 opacity-70" />
                  Email Applicant
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => handleUpdate("SHORTLISTED")}
                  disabled={statusMutation.isPending}
                >
                  <IconCircleCheckFilled className="mr-2 size-4 opacity-70" />
                  Accept Application
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleUpdate("REJECTED")}
                  disabled={statusMutation.isPending}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <IconCircleXFilled className="mr-2 size-4 opacity-70" />
                  Reject Application
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const isFiltered = table.getState().columnFilters.length > 0

  React.useEffect(() => {
    if (!onStatusFilterChange) return
    const statusColumn = table.getColumn("status")
    const currentFilter = (statusColumn?.getFilterValue() as string[]) || []
    onStatusFilterChange(currentFilter[0])
  }, [table, onStatusFilterChange, columnFilters])

  if (isLoading) {
    return (
      <div className="w-full p-4 md:p-8 bg-muted/5 min-h-screen font-sans">
        <p className="text-sm text-muted-foreground">Loading applications…</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full p-4 md:p-8 bg-muted/5 min-h-screen font-sans">
        <p className="text-sm text-red-500">Failed to load applications.</p>
      </div>
    )
  }

  return (
    <div className="w-full p-4 md:p-8 space-y-6 bg-muted/5 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Recruitment Pipeline</h2>
          <p className="text-sm text-muted-foreground">
            {jobId
              ? `Viewing applications for ${jobTitle || `job ${jobId}`}`
              : "Manage applicants and track their status."}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search Input */}
          <div className="relative max-w-sm">
            <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by name..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="h-8 w-full sm:w-[250px] pl-8"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {table.getColumn("status") && (
              <DataTableFacetedFilter
                column={table.getColumn("status")}
                title="Status"
                options={statusOptions}
              />
            )}
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-8 px-2 lg:px-3"
              >
                Reset
                <IconX className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-background overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-10">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center gap-2 mr-4 text-sm font-medium">
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
          </div>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <IconChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <IconChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
