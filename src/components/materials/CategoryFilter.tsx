'use client'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
}

export function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  const allCategories = ['all', ...categories]

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {allCategories.map((category) => (
        <Link
          key={category}
          href={category === 'all' ? '/materials' : `/materials?category=${category}`}
        >
          <Button
            variant={selectedCategory === category ? 'primary' : 'outline'}
            size="sm"
          >
            {category === 'all' ? 'すべて' : category}
          </Button>
        </Link>
      ))}
    </div>
  )
}
