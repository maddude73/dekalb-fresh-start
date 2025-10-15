
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("demo");
    const body = await request.json();

    const existingLead = await db.collection("leads").findOne({
      address: body.address,
      city: body.city,
      state: body.state,
      zip: body.zip,
    });

    if (existingLead) {
      return NextResponse.json({ message: "A lead with this address already exists" }, { status: 409 });
    }

    const lead = {
      ...body,
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
