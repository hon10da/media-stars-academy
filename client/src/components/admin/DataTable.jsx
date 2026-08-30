// Generic admin table: { columns: [{ key, label, render? }], rows, rowKey }
// Handles loading/error/empty states consistently across every admin resource screen.
export default function DataTable({ columns, rows, rowKey = '_id', status = 'success', errorMessage = '', emptyMessage = 'لا توجد بيانات حاليًا.' }) {
  if (status === 'loading') {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-navy/10 border-t-[var(--color-gold)] rounded-full animate-spin" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--color-danger)] font-bold mb-2">تعذر تحميل البيانات</p>
        <p className="text-muted text-sm">{errorMessage}</p>
      </div>
    )
  }

  if (!rows || rows.length === 0) {
    return <p className="text-center text-muted py-16">{emptyMessage}</p>
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-soft">
      <table className="w-full text-sm text-right">
        <thead>
          <tr className="border-b border-navy/10 bg-navy/5">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-bold text-navy whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]} className="border-b border-navy/5 last:border-0 hover:bg-navy/[0.02] transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-middle">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
