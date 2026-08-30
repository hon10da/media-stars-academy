// Presentational only — does not fetch its own data. The parent page (Programs.jsx)
// fetches Departments and passes them here, matching the project's existing
// pattern of keeping cards/bars presentational.
export default function ProgramFilterBar({ active, onChange, departments = [] }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      <button
        onClick={() => onChange('all')}
        className={`px-5 py-2 rounded-full text-sm font-bold border transition-colors ${
          active === 'all'
            ? 'bg-navy text-white border-navy'
            : 'border-navy/15 text-navy hover:border-navy/40'
        }`}
      >
        الكل
      </button>
      {departments.map((department) => (
        <button
          key={department._id}
          onClick={() => onChange(department._id)}
          className={`px-5 py-2 rounded-full text-sm font-bold border transition-colors ${
            active === department._id
              ? 'gold-gradient text-navy border-transparent'
              : 'border-navy/15 text-navy hover:border-navy/40'
          }`}
        >
          {department.name}
        </button>
      ))}
    </div>
  )
}
