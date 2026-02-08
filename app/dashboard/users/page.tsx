import UsersTable from "@/components/UsersTable";
import { getAdminUsers } from "@/lib/api/adminUsers";

type Props = {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
  };
};

export default async function Page({ searchParams }: Props) {
  const page = Number(searchParams?.page ?? "1");
  const limit = Number(searchParams?.limit ?? "10");
  const search = searchParams?.search ?? "";

  const data = await getAdminUsers({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: Number.isFinite(limit) && limit > 0 ? limit : 10,
    search,
  });

  return (
    <div className="p-8">
      <UsersTable data={data} />
    </div>
  );
}
