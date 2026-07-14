import { Categorie } from '@/types'

interface CategoryFilterProps {
  categories: Categorie[]
  selected: number | null
  onChange: (id: number | null) => void
}

export default function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        id="filter-cat-all"
        onClick={() => onChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
          selected === null
            ? 'text-white shadow-gold'
            : 'bg-white border border-brand-cream-dark text-brand-muted hover:border-brand-or hover:text-brand-orange'
        }`}
        style={selected === null ? { background: 'linear-gradient(135deg, #EA580C, #9A3412)' } : {}}
      >
        Tous
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          id={`filter-cat-${cat.id}`}
          onClick={() => onChange(cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            selected === cat.id
              ? 'text-white shadow-gold'
              : 'bg-white border border-brand-cream-dark text-brand-muted hover:border-brand-or hover:text-brand-orange'
          }`}
          style={selected === cat.id ? { background: 'linear-gradient(135deg, #EA580C, #9A3412)' } : {}}
        >
          {cat.nom}
        </button>
      ))}
    </div>
  )
}
