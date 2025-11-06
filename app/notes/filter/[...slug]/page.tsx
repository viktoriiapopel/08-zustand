import { fetchNotes } from "@/lib/api";
import { ALL_NOTES_FILTER } from "@/lib/constants";
import NotesClient from "./Notes.client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface Props {
  params: Promise<{ slug: string[] }>;
}
const PER_PAGE = 12;

const FilterPage = async ({ params }: Props) => {
  const { slug } = await params;
  const queryClient = new QueryClient();

  const tag = slug[0] === ALL_NOTES_FILTER ? undefined : slug[0];
  const title = slug[1] || "";

  await queryClient.prefetchQuery({
    queryKey: ["notes", { tag, title, page: 1, perPage: PER_PAGE }],
    queryFn: () =>
      fetchNotes({ tag, search: title, page: 1, perPage: PER_PAGE }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
};

export default FilterPage;
