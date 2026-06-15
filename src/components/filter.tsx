import { cn } from "../lib/lib";

export type TFilter = {
  value?:
  | "unpublished"
  | "published"

  onFilter: (
    filter:
      | "unpublished"
      | "published"
  ) => void;
}

export const Filter = ({
  value,
  onFilter
}: TFilter) => {
  return (
    <div className="my-4 flex gap-x-6">
      <button
        type="button"
        onClick={() =>
          onFilter("unpublished")
        }
        className={
          cn('border-b-2 border-gray-400 text-gray-400 py-2 cursor-pointer', {
            'border-b-2 border-b-blue-300 text-gray-600 font-semibold': value === 'unpublished',
          },
          )
        }
      >
        Unpublished
      </button>

      <button
        type="button"
        onClick={() =>
          onFilter("published")
        }
        className={
          cn('border-b-2 border-gray-400 text-gray-400 py-2 cursor-pointer', {
            'border-b-2 border-b-blue-300 text-gray-600 font-semibold': value === 'published',
          },
          )
        }
      >
        Published
      </button>
    </div>
  )
}
