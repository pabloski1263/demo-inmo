import { NextResponse } from "next/server";
import { getProperties, saveProperties, generateSlug } from "@/lib/properties";
import { verifyAuth } from "@/lib/auth";
import type { Property } from "@/lib/properties";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const properties = getProperties();

  let filtered = [...properties];

  const status = searchParams.get("status");
  if (status) filtered = filtered.filter((p) => p.status === status);

  const type = searchParams.get("type");
  if (type) filtered = filtered.filter((p) => p.property_type === type);

  const city = searchParams.get("city");
  if (city) filtered = filtered.filter((p) => p.city.toLowerCase().includes(city.toLowerCase()));

  const minPrice = searchParams.get("minPrice");
  if (minPrice) filtered = filtered.filter((p) => p.price >= Number(minPrice));

  const maxPrice = searchParams.get("maxPrice");
  if (maxPrice) filtered = filtered.filter((p) => p.price <= Number(maxPrice));

  const beds = searchParams.get("beds");
  if (beds) filtered = filtered.filter((p) => p.beds >= Number(beds));

  const baths = searchParams.get("baths");
  if (baths) filtered = filtered.filter((p) => p.baths >= Number(baths));

  const q = searchParams.get("q");
  if (q) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title_en.toLowerCase().includes(lower) ||
        p.title_es.toLowerCase().includes(lower) ||
        p.city.toLowerCase().includes(lower) ||
        p.neighborhood.toLowerCase().includes(lower) ||
        p.address.toLowerCase().includes(lower)
    );
  }

  const sort = searchParams.get("sort");
  if (sort === "price_asc") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") filtered.sort((a, b) => b.price - a.price);
  else if (sort === "largest") filtered.sort((a, b) => b.sqft - a.sqft);
  else filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 12));
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return NextResponse.json({ items, total, page, totalPages });
}

export async function POST(req: Request) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const properties = getProperties();

    const now = new Date().toISOString();
    const slug = generateSlug(body.title_en || body.title_es || "property");
    const id = `prop-${Date.now()}`;

    const existingSlugs = properties.map((p) => p.slug);
    let uniqueSlug = slug;
    let counter = 1;
    while (existingSlugs.includes(uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const property: Property = {
      id,
      slug: uniqueSlug,
      status: body.status || "for-sale",
      created_at: now,
      updated_at: now,
      price: Number(body.price) || 0,
      currency: body.currency || "CLP",
      beds: Number(body.beds) || 0,
      baths: Number(body.baths) || 0,
      sqft: Number(body.sqft) || 0,
      lot_size: Number(body.lot_size) || 0,
      year_built: Number(body.year_built) || 0,
      property_type: body.property_type || "house",
      title_en: body.title_en || "",
      title_es: body.title_es || "",
      description_en: body.description_en || "",
      description_es: body.description_es || "",
      features_en: body.features_en || [],
      features_es: body.features_es || [],
      address: body.address || "",
      city: body.city || "",
      neighborhood: body.neighborhood || "",
      region: body.region || "",
      lat: Number(body.lat) || 0,
      lng: Number(body.lng) || 0,
      images: body.images || [],
      agent_name: body.agent_name || "",
      agent_email: body.agent_email || "",
      agent_phone: body.agent_phone || "",
      agent_image: body.agent_image || "",
      mls_number: body.mls_number || "",
      taxes: Number(body.taxes) || 0,
      hoa_fees: Number(body.hoa_fees) || 0,
      parking: Number(body.parking) || 0,
      stories: Number(body.stories) || 0,
      bedrooms: Number(body.bedrooms) || 0,
      bathrooms: Number(body.bathrooms) || 0,
      schools: body.schools || [],
      price_history: body.price_history || [{ date: now, price: Number(body.price) || 0, event: "Listed" }],
    };

    properties.push(property);
    saveProperties(properties);

    return NextResponse.json({ success: true, property });
  } catch {
    return NextResponse.json({ error: "Error al crear propiedad" }, { status: 500 });
  }
}
