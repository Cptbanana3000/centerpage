export default function GoogleCompetitorCard({ result, isDirect }) {
    const { title, link, snippet } = result;
    return (
      <div className="p-4 rounded-lg hover:bg-white/10 transition-colors">
        <div className="flex items-start justify-between gap-2 mb-2">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-blue-400 hover:underline flex-1"
          >
            {title}
          </a>
          {isDirect && (
            <span className="inline-block bg-red-500/20 text-red-400 text-xs font-semibold px-2 py-1 rounded-full border border-red-500/30 whitespace-nowrap">
              Direct Competitor
            </span>
          )}
        </div>
        <p className="text-sm text-green-400 truncate">{link}</p>
        <p className="mt-2 text-gray-400 text-sm line-clamp-3">{snippet}</p>
      </div>
    );
  } 