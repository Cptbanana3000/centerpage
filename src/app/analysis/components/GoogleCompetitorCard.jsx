export default function GoogleCompetitorCard({ result, isDirect }) {
    const { title, link, snippet } = result;
    return (
      <div className="py-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-blue-600 hover:underline flex-1"
          >
            {title}
          </a>
          {isDirect && (
            <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full border border-red-200 whitespace-nowrap">
              Direct Competitor
            </span>
          )}
        </div>
        <p className="text-sm text-green-700 truncate">{link}</p>
        <p className="mt-2 text-gray-600 text-sm line-clamp-3">{snippet}</p>
      </div>
    );
  } 