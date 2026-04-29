import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const locale = searchParams.get("locale") ?? "en";

  if (secret !== process.env.PAYLOAD_PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const dm = await draftMode();
  dm.enable();

  redirect(`/${locale}/blog/${slug}`);
}
