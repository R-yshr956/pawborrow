import {
  usePublishedCmsContent,
} from "@repo/api";

import Nav from "@/components/ui/Navbar";

function formatUpdatedDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-PH",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
}

function renderContentLine(
  line: string,
  index: number,
) {
  const normalizedLine =
    line.trim();

  if (!normalizedLine) {
    return (
      <div
        key={index}
        className="h-2"
        aria-hidden="true"
      />
    );
  }

  if (
    normalizedLine.startsWith(
      "### ",
    )
  ) {
    return (
      <h3
        key={index}
        className="
          mt-3 text-xl
          font-semibold
          text-gray-900
        "
      >
        {normalizedLine.slice(4)}
      </h3>
    );
  }

  if (
    normalizedLine.startsWith(
      "## ",
    )
  ) {
    return (
      <h2
        key={index}
        className="
          mt-5 text-2xl
          font-bold
          text-gray-900
        "
      >
        {normalizedLine.slice(3)}
      </h2>
    );
  }

  if (
    normalizedLine.startsWith(
      "- "
    ) ||
    normalizedLine.startsWith(
      "• "
    )
  ) {
    return (
      <div
        key={index}
        className="
          flex gap-3 pl-4
          leading-7
          text-gray-700
        "
      >
        <span
          className="
            mt-2 text-sm
            text-froly-400
          "
          aria-hidden="true"
        >
          ●
        </span>

        <p>
          {normalizedLine.slice(2)}
        </p>
      </div>
    );
  }

  const numberedItem =
    normalizedLine.match(
      /^(\d+)\.\s+(.+)$/,
    );

  if (numberedItem) {
    return (
      <div
        key={index}
        className="
          flex gap-3 pl-4
          leading-7
          text-gray-700
        "
      >
        <span className="min-w-6 font-semibold text-gray-900">
          {numberedItem[1]}.
        </span>

        <p>{numberedItem[2]}</p>
      </div>
    );
  }

  return (
    <p
      key={index}
      className="
        whitespace-pre-wrap
        leading-7 text-gray-700
      "
    >
      {normalizedLine}
    </p>
  );
}

export default function Tos() {
  const {
    data: terms,
    isLoading,
    isError,
    error,
    refetch,
  } = usePublishedCmsContent(
    "terms-of-service",
  );

  return (
    <main className="min-h-screen bg-white">
      <Nav />

      <article
        className="
          container mx-auto
          max-w-5xl px-4
        "
      >
        {isLoading && (
          <div
            className="
              flex min-h-96
              items-center
              justify-center
              py-12
            "
          >
            <div className="text-center">
              <div
                className="
                  mx-auto size-9
                  animate-spin
                  rounded-full
                  border-4
                  border-gray-200
                  border-t-froly-400
                "
              />

              <p className="mt-4 text-sm text-gray-500">
                Loading terms of
                service...
              </p>
            </div>
          </div>
        )}

        {isError && (
          <div
            className="
              my-12 rounded-2xl
              border border-red-100
              bg-red-50 px-6
              py-10 text-center
            "
            role="alert"
          >
            <h1 className="text-xl font-bold text-red-700">
              Terms of service
              could not be loaded
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error instanceof Error
                ? error.message
                : "An unexpected error occurred."}
            </p>

            <button
              type="button"
              onClick={() => {
                void refetch();
              }}
              className="
                mt-5 rounded-xl
                border-0 bg-red-600
                px-5 py-2.5
                text-sm font-semibold
                text-white
                transition
                hover:bg-red-700
              "
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading &&
          !isError &&
          !terms && (
            <div
              className="
                my-12 rounded-2xl
                border border-amber-200
                bg-amber-50 px-6
                py-10 text-center
              "
            >
              <h1 className="text-xl font-bold text-amber-800">
                Terms of service
                are unavailable
              </h1>

              <p className="mt-2 text-sm text-amber-700">
                The terms of service
                have not been
                published yet.
              </p>
            </div>
          )}

        {!isLoading &&
          !isError &&
          terms && (
            <div
              className="
                flex flex-col
                gap-6 p-6 py-12
                md:p-10 lg:p-12
              "
            >
              <header className="border-b border-gray-200 pb-6">
                <p
                  className="
                    mb-3 text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                    text-froly-400
                  "
                >
                  PawBorrow Legal
                </p>

                <h1
                  className="
                    text-3xl
                    font-bold
                    text-gray-900
                    md:text-4xl
                  "
                >
                  {terms.title}
                </h1>

                <p className="mt-3 text-sm text-gray-500">
                  Last updated:{" "}
                  {formatUpdatedDate(
                    terms.updated_at,
                  )}
                </p>
              </header>

              {terms.body.trim() ? (
                <div className="space-y-4">
                  {terms.body
                    .split("\n")
                    .map(
                      (
                        line,
                        index,
                      ) =>
                        renderContentLine(
                          line,
                          index,
                        ),
                    )}
                </div>
              ) : (
                <div
                  className="
                    rounded-xl
                    border
                    border-amber-200
                    bg-amber-50
                    p-6 text-center
                    text-sm
                    text-amber-700
                  "
                >
                  These terms have
                  been published,
                  but they do not
                  have any content
                  yet.
                </div>
              )}

              <footer
                className="
                  mt-4 border-t
                  border-gray-200
                  pt-6
                "
              >
                <p className="font-semibold leading-7 text-gray-800">
                  By using
                  PawBorrow, you
                  acknowledge that
                  you have read,
                  understood, and
                  agreed to these
                  Terms of Service.
                </p>
              </footer>
            </div>
          )}
      </article>
    </main>
  );
}