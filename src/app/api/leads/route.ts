
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("demo");
    const body = await request.json();

    const standardizedAddress = body.address.trim().toUpperCase();
    const standardizedCity = body.city.trim().toUpperCase();
    const standardizedState = body.state.trim().toUpperCase();
    const standardizedZip = body.zip.trim(); // Zip codes might have specific formats, so only trim for now.

    const existingLead = await db.collection("leads").findOne({
      address: standardizedAddress,
      city: standardizedCity,
      state: standardizedState,
      zip: standardizedZip,
    });

    if (existingLead) {
      return NextResponse.json({ message: "A lead with this address already exists" }, { status: 409 });
    }

    const lead = {
      ...body,
      address: standardizedAddress,
      city: standardizedCity,
      state: standardizedState,
      zip: standardizedZip,
      createdAt: new Date(),
      status: "New",
    };

    await db.collection("leads").insertOne(lead);

    return NextResponse.json({ message: "Lead created successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Error creating lead" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("demo");
    const leads = await db.collection("leads").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(leads);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Error fetching leads" }, { status: 500 });
  }
}
