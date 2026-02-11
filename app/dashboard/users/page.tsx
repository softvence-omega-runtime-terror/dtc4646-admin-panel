import UsersTable from "@/components/UsersTable";
import { getAdminUsers } from "@/lib/api/adminUsers";

type Props = {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    search?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const page = Number(resolvedSearchParams.page ?? "1");
  const limit = Number(resolvedSearchParams.limit ?? "10");
  const search = resolvedSearchParams.search ?? "";

  const data = await getAdminUsers({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: Number.isFinite(limit) && limit > 0 ? limit : 10,
    search,
  });

  return (
    <div className="w-full min-w-0 p-6 lg:p-8">
      <UsersTable data={data} />
    </div>
  );
}
