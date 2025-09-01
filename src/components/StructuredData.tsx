interface StructuredDataProps {
  data: (Record<string, unknown> | null)[] | Record<string, unknown>
}

export default function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data.filter(Boolean) : [data]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  )
}
