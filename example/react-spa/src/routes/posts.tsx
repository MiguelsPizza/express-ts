import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { postsQueryOptions } from "../clientAPI/posts/postsQueryOptions";

export const Route = createFileRoute("/posts")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(postsQueryOptions),
  component: PostsComponent,
});

function PostsComponent() {
  const postsQuery = useSuspenseQuery(postsQueryOptions);
  const posts = postsQuery.data;
  return (
    <div className="p-2 flex gap-2">
      <ul className="list-disc pl-4">
        {posts.map(({ id, title }) => {

          return (
            <li key={id} className="whitespace-nowrap">
              <Link
                to="/posts/$postId"
                params={{
                  postId: id.toString(),
                }}
                className="block py-1 text-blue-600 hover:opacity-75"
                activeProps={{ className: "font-bold underline" }}
              >
                <div>{title.substring(0, 20)}</div>
              </Link>
            </li>
          );
        })}
      </ul>
      <hr />
      <Outlet />
    </div>
  );
}
