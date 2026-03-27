'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { AuditLog } from '@/types'
import AdminNav from '@/components/admin-nav'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2 } from 'lucide-react'

function formatAction(action: AuditLog['action']) {
  if (action === 'INSERT') return 'Created'
  if (action === 'UPDATE') return 'Updated'
  return 'Deleted'
}

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

export default function AuditPage() {
  const supabase = createClient()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true)
      setError(null)

      const { data, error: queryError } = await supabase
        .from('audit_logs')
        .select('*')
        .order('changed_at', { ascending: false })
        .limit(300)

      if (queryError) {
        setError('Failed to load audit logs. Please confirm audit_logs exists in Supabase.')
      } else {
        setLogs((data || []) as AuditLog[])
      }

      setLoading(false)
    }

    fetchLogs()
  }, [supabase])

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNav />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Audit Logs</h1>
          <span className="text-sm text-slate-500">Latest {logs.length} events</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-6 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            No audit events yet.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <Table className="min-w-max w-full [&_th]:border-r [&_th]:border-slate-200 [&_th:last-child]:border-r-0 [&_td]:border-r [&_td]:border-slate-100 [&_td:last-child]:border-r-0">
              <TableHeader className="bg-slate-100/80">
                <TableRow>
                  <TableHead className="py-3 px-4">When</TableHead>
                  <TableHead className="py-3 px-4">Who</TableHead>
                  <TableHead className="py-3 px-4">Action</TableHead>
                  <TableHead className="py-3 px-4">Table</TableHead>
                  <TableHead className="py-3 px-4">Record</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="even:bg-slate-50/60">
                    <TableCell className="py-3 px-4 whitespace-nowrap">{formatDate(log.changed_at)}</TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">{log.actor_email || log.actor_user_id || 'Unknown'}</TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">{formatAction(log.action)}</TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">{log.table_name}</TableCell>
                    <TableCell className="py-3 px-4 whitespace-nowrap">{log.record_id || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  )
}